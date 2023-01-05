import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "GET") {
    const filters = await db.filters.findMany({
      orderBy: { name: "asc" },
    });

    // Remove the prompt from the filter
    const parsedFilters = filters.map((filter) => {
      const { prompt, ...rest } = filter;
      return rest;
    });

    return res.json(parsedFilters);
  }
};

export default handler;
