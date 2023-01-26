import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import replicateClient, {
  TrainingRequest,
  TrainingResponse,
  UpscaleRequest,
  UpscaleResponse,
} from "@/core/clients/replicate";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
import supabase from "@/core/clients/supabase";
import { fetchImageAndGetDataUrl } from "@/core/utils/bucketHelpers";

const SWINIR_VERSION =
  "660d922d33153019e8c263a3bba265de882e7f4f70396546b6c9c8f9d47a021a";

const TASK_TYPE = "Real-World Image Super-Resolution-Large";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const shotId = req.query.id as string;
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let shot = await db.shot.findFirstOrThrow({
    where: {
      id: shotId,
      upscaledImageUrl: null,
    },
  });

  const { data: data_url } = supabase.storage
    .from(process.env.NEXT_SHOT_BUCKET_NAME!)
    .getPublicUrl(`${shot.projectId}/standard/${shot.id}.png`);

  const { data } = await replicateClient.post<UpscaleResponse>(
    `https://api.replicate.com/v1/predictions`,
    {
      input: { image: data_url.publicUrl, task_type: TASK_TYPE },
      version: SWINIR_VERSION,
    }
  );

  shot = await db.shot.update({
    where: { id: shot.id },
    data: { upscaleId: data.id, status: data.status },
  });

  // Decrement the user's credits
  await db.user.update({
    where: { id: session.user.id },
    data: { credits: { decrement: 1 } },
  });

  return res.json({ shot });
};

export default handler;
