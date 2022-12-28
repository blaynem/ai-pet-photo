import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import db from "@/core/db";
import { useSession } from "next-auth/react";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionId = req.query.sessionId as string;
  const ppi = req.query.ppi as string;
  const { data: AuthSession } = useSession();
  const user = AuthSession?.user;
  const credits = user?.credits || 0;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid" && session.metadata?.userId === ppi) {
    await db.user.update({
      where: { id: ppi },
      data: { credits: credits + Number(req.query.price) },
    });

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false });
}
