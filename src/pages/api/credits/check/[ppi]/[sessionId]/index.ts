import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import db from "@/core/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export type StripeCheckoutSession = {
  total_credits?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StripeCheckoutSession>
) {
  const sessionId = req.query.sessionId as string;
  const ppi = req.query.ppi as string;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid" && session.metadata?.userId === ppi) {
    const user = await db.user.update({
      data: {
        credits: {
          increment: Number(session.metadata.purchased_credits),
        },
      },
      where: { id: ppi },
    });

    return res.status(200).json({ total_credits: user.credits });
  }

  return res.status(400).json({});
}
