import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "GET") {
    const styles = await db.styles.findMany({
      orderBy: { name: "desc" },
    });

    // Remove the prompt from the style
    const parsedStyles = styles.map((style) => {
      const { prompt, ...rest } = style;
      return rest;
    });

    return res.json(parsedStyles);
  }
};

export default handler;
