import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";
import { PurchaseType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "GET") {
    const hasPromotionalPurchase = await db?.payment.findFirst({
      where: {
        userId: session?.user?.id,
        purchaseType: PurchaseType.PROMOTION_STUDIO_PURCHASE,
      },
    });

    return res.json(Boolean(hasPromotionalPurchase));
  }

  return res.status(404).json({ message: "Not Found" });
};

export default handler;
