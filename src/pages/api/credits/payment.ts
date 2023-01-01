import { NextApiRequest, NextApiResponse } from "next";
import db from "@/core/db";
import { getSession } from "next-auth/react";
import { STUDIO_COST_IN_CREDITS } from "@/core/constants";

export type CreditPayment = {
  ppi: string;
  userId: string;
  purchaseId: "STUDIO";
};

const getCreditPrice = (purchaseId: string) => {
  if (purchaseId === "STUDIO") {
    return STUDIO_COST_IN_CREDITS;
  }
};

interface CreditPaymentRequest extends NextApiRequest {
  query: CreditPayment;
}

export default async function handler(
  req: CreditPaymentRequest,
  res: NextApiResponse
) {
  try {
    const ppi = req.query.ppi;
    const userId = req.query.userId;
    const purchaseId = req.query.purchaseId;
    const session = await getSession({ req });

    const purchasePrice = getCreditPrice(purchaseId);

    if (purchaseId !== "STUDIO" || !purchasePrice || !ppi) {
      throw new Error("Invalid purchase");
    }

    if (session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < purchasePrice) {
      throw new Error("Insufficient credits");
    }

    // This is only for a studio purchase with credits
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: purchasePrice,
        },
        projects: {
          update: {
            where: { id: ppi },
            data: { stripePaymentId: "CREDIT-PURCHASE" },
          },
        },
      },
    });

    return res.status(200).json({ total_credits: updatedUser.credits });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
}
