import { NextApiRequest, NextApiResponse } from "next";
import db from "@/core/db";

const simplifiedUrl = new URL(process.env.NEXTAUTH_URL!);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check that they are coming from our nextjs app
  const { host, referer } = req.headers;
  if (host !== simplifiedUrl.host && referer !== simplifiedUrl.href) {
    return res.status(200).json([]);
  }

  if (req.method === "GET") {
    const filters = await db.filters.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        example_url_dog: true,
      },
    });

    return res.json(filters);
  }
};

export default handler;
