import replicateClient, {
  PredictionResponse as ReplicatePredictResponse,
} from "@/core/clients/replicate";
import db from "@/core/db";
import { Shot } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export interface PredictionsBody {
  styleId: string;
  styleName: string;
  projectId: string;
  /**
   * Amount of predictions to make
   */
  predictionAmount?: number;
}

export interface PredictionsResponse {
  shots?: Omit<Shot, "prompt">[];
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
    const { styleId, styleName, projectId, predictionAmount } = req.body;
    const session = await getSession({ req });

    if (!session?.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Fetch user to check if they have credits
    const dbUser = await db.user.findFirstOrThrow({
      where: { id: session.user.id },
    });

    if (dbUser.credits < 1) {
      return res.status(400).json({ message: "No credits" });
    }

    // Fetch the project from the database
    const project = await db.project.findFirstOrThrow({
      where: { id: projectId, userId: session.user.id },
    });

    // Fetch the style from the database
    const style = await db.styles.findFirst({
      where: { id: styleId },
    });

    // replace the instance name and class in the prompt with the actual values
    const prompt = style!.prompt
      .replaceAll("{instanceName}", project.instanceName)
      .replaceAll("{instanceClass}", project.instanceClass);

    // Assure amount of predictions is between 1 and 10
    const predictionsToMake = Math.min(Math.max(predictionAmount || 1, 1), 10);

    // Send batched fetch requests to replicate
    const batchedFetches = await Promise.all(
      // Depending on how many predictions we want to make
      Array.from({ length: predictionsToMake }).map(async () => {
        // Create a prediction on Replicate
        const { data } = await replicateClient.post<ReplicatePredictResponse>(
          `https://api.replicate.com/v1/predictions`,
          {
            input: { prompt },
            version: project.modelVersionId!,
          }
        );
        return data;
      })
    );

    const batchedData = batchedFetches.map((data) => ({
      prompt: data.input.prompt,
      replicateId: data.id,
      status: "starting",
      projectId: project.id,
      styleId,
      styleName,
    }));

    const shots = await db.$transaction(
      batchedData.map((shotData) =>
        db.shot.create({
          data: shotData,
        })
      )
    );

    // Decrement the project credits
    await db.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    // remove the prompt field from all shots
    const shotsWithoutPromp = shots.map((shot) => {
      const { prompt: _, ...shotWithoutPrompt } = shot;
      return shotWithoutPrompt;
    });

    return res.json({ shots: shotsWithoutPromp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
