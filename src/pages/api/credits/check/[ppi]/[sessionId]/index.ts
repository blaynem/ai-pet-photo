import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import db from "@/core/db";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
import { Prisma, PurchaseType } from "@prisma/client";
import { PricingPackageId } from "@/core/constants";

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

  const packageId = session?.metadata?.packageId as string;
  const selectedPackage = getPackageInfo(packageId);

  const paymentsCreate: Prisma.PaymentCreateInput[] = [
    {
      amount: selectedPackage?.totalCredits!,
      paid_amount: selectedPackage?.price!,
      stripePaymentId: session.id,
      purchaseType: selectedPackage?.purchaseType!,
    },
  ];

  if (session.payment_status === "paid" && session.metadata?.userId === ppi) {
    const user = await db.user.update({
      where: { id: session.metadata?.userId },
      data: {
        credits: {
          increment: selectedPackage?.totalCredits,
        },
        payments: {
          create: paymentsCreate,
        },
      },
    });

    return res.status(200).json({ total_credits: user.credits });
  }

  return res.status(400).json({});
}
