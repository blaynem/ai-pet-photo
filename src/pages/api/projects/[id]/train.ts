import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import replicateClient from "@/core/clients/replicate";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
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

  const instanceClass = getRefinedInstanceClass(project.instanceClass);

  // TODO: Check if this actually returns the data url for the bucket
  const { data: data_url } = supabase(session.supabaseAccessToken!)
    .storage.from(process.env.SUPABASE_UPLOAD_BUCKET_NAME!)
    .getPublicUrl(`${project.id}.zip`);

  console.log("----does this even return bucket data?", data_url);
  return;
  const responseReplicate = await replicateClient.post(
    "/v1/trainings",
    {
      input: {
        instance_prompt: `a photo of a ${project.instanceName} ${instanceClass}`,
        class_prompt: `a photo of a ${instanceClass}`,
        // TODO: See what the supabase url would be?
        instance_data: data_url,
        max_train_steps: 800,
        num_class_images: 50,
        learning_rate: 1e-6,
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
