import replicateClient, {
  PredictionResponse as ReplicatePredictResponse,
} from "@/core/clients/replicate";
import db from "@/core/db";
import { Shot } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export interface PredictionsBody {
  prompt: string;
  filterId: string;
  filterName: string;
  projectId: string;
}

export interface PredictionsResponse {
  shot?: Shot;
  message?: string;
}

interface PredictionRequest extends NextApiRequest {
  body: PredictionsBody;
}

const handler = async (
  req: PredictionRequest,
  res: NextApiResponse<PredictionsResponse>
) => {
  try {
    const { filterId, filterName, prompt, projectId } = req.body;
    const session = await getSession({ req });

    if (!session?.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const project = await db.project.findFirstOrThrow({
      where: { id: projectId, userId: session.user.id },
    });

    if (project.credits < 1) {
      return res.status(400).json({ message: "No credit" });
    }

    const { data } = await replicateClient.post<ReplicatePredictResponse>(
      `https://api.replicate.com/v1/predictions`,
      {
        input: { prompt },
        version: project.modelVersionId!,
      }
    );

    const shot = await db.shot.create({
      data: {
        prompt: data.input.prompt,
        replicateId: data.id,
        status: "starting",
        projectId: project.id,
        filterId,
        filterName,
      },
    });

    await db.project.update({
      where: { id: project.id },
      data: {
        credits: project.credits - 1,
      },
    });

    return res.json({ shot });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
