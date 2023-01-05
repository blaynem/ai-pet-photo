import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import replicateClient, {
  TrainingRequest,
  TrainingResponse,
} from "@/core/clients/replicate";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
import supabase from "@/core/clients/supabase";

const STABLE_DIFFUSION_VERSIONS = {
  "1.5": "cd3f925f7ab21afaef7d45224790eedbb837eeac40d22e8fefe015489ab644aa",
  "2.1-base":
    "d5e058608f43886b9620a8fbb1501853b8cbae4f45c857a014011c86ee614ffb",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let project = await db.project.findFirstOrThrow({
    where: {
      id: projectId,
      userId: session.user.id,
      modelStatus: "not_created",
      NOT: { stripePaymentId: null },
    },
  });

  const instanceClass = getRefinedInstanceClass(project.instanceClass);
  // const numOfImages = getTrainCoefficient(project.imageUrls.length);
  // const MAX_NUM_STEPS = Math.min(2000, Math.min(numOfImages, MAX_IMAGES) * 80);
  const MAX_NUM_STEPS = 800; // Let's not get fancy, let's just set it to the standard.

  const { data: data_url } = supabase.storage
    .from(process.env.NEXT_PUBLIC_UPLOAD_BUCKET_NAME!)
    .getPublicUrl(`${session.user.id}/${project.id}.zip`);

  const trainingData: TrainingRequest = {
    input: {
      instance_prompt: `${project.instanceName} ${instanceClass}`,
      class_prompt: `${instanceClass}`,
      instance_data: data_url.publicUrl,
      // num_class_images: numOfImages * 12,
      num_class_images: 200, // We're just going to use 200 for now
      max_train_steps: MAX_NUM_STEPS,
      lr_warmup_steps: Math.round(MAX_NUM_STEPS / 10),
      learning_rate: 1e-6,
      lr_scheduler: "constant",
      gradient_accumulation_steps: 1,
      gradient_checkpointing: true,
      train_batch_size: 1,
      train_text_encoder: true,
      // resolution: 512, // I don't know what resolution we're using rn
    },
    trainer_version: STABLE_DIFFUSION_VERSIONS["1.5"],
    // Model has to be lowercase
    model: `${process.env.REPLICATE_USERNAME}/${project.name
      .toLowerCase()
      .trim()}`,
    webhook_completed: `${process.env.NEXTAUTH_URL}/api/webhooks/completed`,
  };

  const responseReplicate = await replicateClient.post<TrainingResponse>(
    "/v1/trainings",
    trainingData,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const replicateModelId = responseReplicate.data.id as string;

  project = await db.project.update({
    where: { id: project.id },
    data: { replicateModelId: replicateModelId, modelStatus: "processing" },
  });

  return res.json({ project });
};

export default handler;
