import db from "@/core/db";
import { Project, Shot } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type ProjectPick = Pick<
  Project,
  "id" | "name" | "instanceName" | "instanceClass" | "createdAt"
>;
type ShotsPick = Pick<
  Shot,
  | "createdAt"
  | "filterId"
  | "filterName"
  | "id"
  | "imageUrl"
  | "upscaledImageUrl"
  | "projectId"
  | "status"
>;

export type ProjectIdResponse = {
  project?: {
    shots: ShotsPick[];
  } & ProjectPick;
  message?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ProjectIdResponse>
) => {
  try {
    const projectId = req.query.id as string;
    const session = await getSession({ req });

    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    const project = await db.project.findFirstOrThrow({
      where: {
        id: projectId,
        userId: session.user.id,
        modelStatus: "succeeded",
      },
      select: {
        createdAt: true,
        id: true,
        instanceName: true,
        instanceClass: true,
        name: true,
        replicateModelId: true,
        shots: {
          select: {
            // Not selecting the `prompt` so user doesn't have info on that.
            prompt: false,
            createdAt: true,
            filterId: true,
            filterName: true,
            id: true,
            imageUrl: true,
            upscaledImageUrl: true,
            projectId: true,
            status: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ project });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "There was an error" });
  }
};

export default handler;
