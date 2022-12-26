import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";
import { createZipFolder } from "@/core/utils/assets";
import replicateClient, { TrainingResponse } from "@/core/clients/replicate";
import urlSlug from "url-slug";
import supabase from "@/core/clients/supabase";

export type CreateProjectBody = {
  name: string;
  instanceName: string;
  instanceClass: string;
  urls: string[];
};

interface ProjectRequest extends NextApiRequest {
  body: CreateProjectBody;
}

const handler = async (req: ProjectRequest, res: NextApiResponse) => {
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
        // TODO: Create the actual number of credits
        credits: Number(process.env.NEXT_PUBLIC_STUDIO_SHOT_AMOUNT) || 50,
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
    const projects = await db.project.findMany({
      where: { userId: session.user.id },
      include: { shots: { take: 10, orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

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

    return res.json(projects);
  }
};

export default handler;
