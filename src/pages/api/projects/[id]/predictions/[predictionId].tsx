import replicateClient, { PredictionResponse } from "@/core/clients/replicate";
import db from "@/core/db";
import { fetchImageAndStoreIt } from "@/core/utils/bucketHelpers";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { ShotsPick } from "../..";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ shot: ShotsPick | null; message?: string }>
) => {
  try {
    const projectId = req.query.id as string;
    const predictionId = req.query.predictionId as string;
    const getUpscaledPrediction = req.query.upscaled === "true";
    console.log(req.query);
    const session = await getSession({ req });

    if (!session?.user) {
      return res.status(401).json({ message: "Not authenticated", shot: null });
    }

    // Remove the `prompt` from the shot, so users don't see it.
    const { prompt, ...shot } = await db.shot.findFirstOrThrow({
      where: { projectId: projectId, id: predictionId },
    });

    const fetchId = shot.upscaleId ? shot.upscaleId : shot.replicateId;
    const { data: prediction } = await replicateClient.get<PredictionResponse>(
      `https://api.replicate.com/v1/predictions/${fetchId}`
    );

    // If the prediction has failed, update the shot in database and return.
    if (prediction.status === "failed") {
      const updatedShot = await db.shot.update({
        where: { id: shot.id },
        data: {
          upscaleStatus: prediction.status,
          upscaleId: null,
        },
      });
      return res.json({ shot: updatedShot });
    }

    // If the initial shot status changes from the prediction, update the shot in database.

    console.log(shot);

    const checkPredictionStatus = shot.upscaleId
      ? shot.upscaleStatus !== prediction.status
      : shot.status !== prediction.status;

    if (checkPredictionStatus) {
      // Depending on the prediction, the output is either a single url or an array of urls.
      // For predictions to the upscaler, the output is a single url.
      const outputUrl = shot.upscaleId
        ? prediction.output
        : prediction.output?.[0];

      let dataToUpdate: Prisma.ShotUpdateArgs["data"] = {};
      // If the prediction has an output
      if (outputUrl) {
        // Fetch the image and store it in the "shots" bucket.
        const fileName = await fetchImageAndStoreIt(outputUrl, shot);
        // Add data to update the shot with
        dataToUpdate = shot.upscaleId
          ? { upscaledImageUrl: fileName, upscaleStatus: prediction.status }
          : { imageUrl: fileName, status: prediction.status };
      }
      // Update the shot with status, and other data if it exists.
      const updatedShot = await db.shot.update({
        where: { id: shot.id },
        data: {
          ...dataToUpdate,
        },
      });
      return res.json({ shot: updatedShot });
    }

    return res.json({ shot });
  } catch (error) {
    res.status(500).json({ message: "There was an error", shot: null });
  }
};

export default handler;
