import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import replicateClient, { TrainingResponse } from "@/core/clients/replicate";
import {
  getRefinedInstanceClass,
  getTrainCoefficient,
} from "@/core/utils/predictions";
import supabase from "@/core/clients/supabase";

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

  const MAX_IMAGES = 45; // Doesn't actually match the max number of images, but we want to set a limit on the steps
  const instanceClass = getRefinedInstanceClass(project.instanceClass);
  const numOfImages = getTrainCoefficient(project.imageUrls.length);
  const MAX_NUM_STEPS = Math.min(4500, Math.min(numOfImages, MAX_IMAGES) * 80);

  const { data: data_url } = supabase.storage
    .from(process.env.NEXT_PUBLIC_UPLOAD_BUCKET_NAME!)
    .getPublicUrl(`${session.user.id}/${project.id}.zip`);

  const responseReplicate = await replicateClient.post<TrainingResponse>(
    "/v1/trainings",
    {
      input: {
        instance_prompt: `${project.instanceName} ${instanceClass}`,
        class_prompt: `${instanceClass}`,
        instance_data: data_url.publicUrl,
        num_class_images: numOfImages * 12,
        max_train_steps: MAX_NUM_STEPS,
        lr_warmup_steps: Math.round(MAX_NUM_STEPS / 10),
        learning_rate: 1e-6,
        lr_scheduler: "polynomial",
        gradient_accumulation_steps: 1,
        gradient_checkpointing: true,
        train_batch_size: 1,
        train_text_encoder: true,
        // class_data: undefined, // Training data of the class image ex: 'dog' or 'person'
        // resolution: 512, // I don't know what resolution we're using rn
      },
      model: `${process.env.REPLICATE_USERNAME}/${project.name}`,
      webhook_completed: `${process.env.NEXTAUTH_URL}/api/webhooks/completed`,
    },
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
