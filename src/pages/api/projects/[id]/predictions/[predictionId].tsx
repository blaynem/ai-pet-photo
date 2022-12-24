import replicateClient, { PredictionResponse } from "@/core/clients/replicate";
import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  const predictionId = req.query.predictionId as string;

  const session = await getSession({ req });

  if (session?.user) {
    const shot = await db.shot.findFirstOrThrow({
      where: { projectId: projectId, id: predictionId },
    });

    const { data: prediction } = await replicateClient.get<PredictionResponse>(
      `https://api.replicate.com/v1/predictions/${shot.replicateId}`
    );

    await db.shot.update({
      where: { id: shot.id },
      data: {
        status: prediction.status,
        outputUrl: prediction.output?.[0] || null,
      },
    });

    // Remove the `prompt` from the shot, so users don't see it.
    const { prompt, ...shotWithoutPrompt } = shot;
    return res.json({ shot: shotWithoutPrompt });
  }

  res.status(401).json({ message: "Not authenticated" });
};

export default handler;
