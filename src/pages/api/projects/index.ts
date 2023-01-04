import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";
import { createZipFolder } from "@/core/utils/assets";
import replicateClient, { TrainingResponse } from "@/core/clients/replicate";
import urlSlug from "url-slug";
import supabase from "@/core/clients/supabase";
import { Project, Shot } from "@prisma/client";

export type ShotsPick = Pick<
  Shot,
  | "createdAt"
  | "filterId"
  | "filterName"
  | "id"
  | "outputUrl"
  | "projectId"
  | "status"
>;

export type ProjectWithShots = {
  shots: ShotsPick[];
} & Project;

export type ProjectsGetResponse = {
  projects?: ProjectWithShots[];
  message?: string;
};

export type ProjectPostResponse = {
  project: Project;
  message?: string;
};

export type CreateProjectBody = {
  name: string;
  instanceName: string;
  instanceClass: string;
  urls: string[];
};

interface ProjectRequest extends NextApiRequest {
  body: CreateProjectBody;
}

const handler = async (
  req: ProjectRequest,
  res: NextApiResponse<ProjectsGetResponse | ProjectPostResponse>
) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "POST") {
    const urls = req.body.urls as string[];
    const name = req.body.name as string;
    const instanceName = req.body.instanceName as string;
    const instanceClass = req.body.instanceClass as string;
    const userId = session.user.id;

    const project = await db.project.create({
      data: {
        name,
        imageUrls: urls,
        userId: userId,
        modelStatus: "not_created",
        instanceClass: instanceClass,
        instanceName: urlSlug(instanceName, { separator: "" }),
      },
    });

    const buffer = await createZipFolder(urls, project);

    await supabase.storage
      .from(process.env.NEXT_PUBLIC_UPLOAD_BUCKET_NAME!)
      .upload(`${userId}/${project.id}.zip`, buffer, {
        contentType: "application/zip",
      });

    return res.json({ project });
  }

  if (req.method === "GET") {
    const userId = session.user.id;
    // Limits the amount of shots to return
    const shotAmount = req.query.shotAmount as string;

    const projects = await db.project.findMany({
      where: { userId: userId },
      include: {
        shots: {
          orderBy: { createdAt: "desc" },
          // We DO NOT want to return the prompt, NEVER select
          select: {
            createdAt: true,
            filterId: true,
            filterName: true,
            id: true,
            outputUrl: true,
            projectId: true,
            status: true,
          },
          ...(shotAmount && { take: Number(shotAmount) }),
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // We are checking if the project status on replicate has changed
    for (const project of projects) {
      if (project?.replicateModelId && project?.modelStatus !== "succeeded") {
        const { data } = await replicateClient.get<TrainingResponse>(
          `/v1/trainings/${project.replicateModelId}`
        );

        await db.project.update({
          where: { id: project.id },
          data: { modelVersionId: data.version, modelStatus: data?.status },
        });
      }
    }

    return res.json({ projects });
  }

  // handle delete method and delete uploaded photos
  if (req.method === "DELETE") {
    const { projectId } = req.query;

    const project = await db.project.findUnique({
      where: { id: projectId as string },
      select: { userId: true },
    });

    if (project?.userId !== session.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    await db.project.delete({
      where: { id: projectId as string },
    });
    // todo: delete uploaded photos
    return res.json({ message: "Project deleted" });
  }
};

export default handler;
