import replicateClient, {
  PredictionResponse as ReplicatePredictResponse,
} from "@/core/clients/replicate";
import db from "@/core/db";
import { Shot } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export interface PredictionsBody {
  filterId: string;
  filterName: string;
  projectId: string;
}

export interface PredictionsResponse {
  shot?: Omit<Shot, "prompt">;
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
    const { filterId, filterName, projectId } = req.body;
    const session = await getSession({ req });

    if (!session?.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Fetch the project from the database
    const project = await db.project.findFirstOrThrow({
      where: { id: projectId, userId: session.user.id },
    });

    if (project.credits < 1) {
      return res.status(400).json({ message: "No credit" });
    }

    // Fetch the filter from the database
    const filter = await db.filters.findFirst({
      where: { id: filterId },
    });

    // replace the instance name and class in the prompt with the actual values
    const prompt = filter!.prompt
      .replaceAll("{instanceName}", project.instanceName)
      .replaceAll("{instanceClass}", project.instanceClass);

    // Create a prediction on Replicate
    const { data } = await replicateClient.post<ReplicatePredictResponse>(
      `https://api.replicate.com/v1/predictions`,
      {
        input: { prompt },
        version: project.modelVersionId!,
      }
    );

    // Create a shot in the database
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

    // Update the project credits
    await db.project.update({
      where: { id: project.id },
      data: {
        credits: project.credits - 1,
      },
    });

    // remove the prompt from the shot
    const { prompt: _, ...shotWithoutPrompt } = shot;

    return res.json({ shot: shotWithoutPrompt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
