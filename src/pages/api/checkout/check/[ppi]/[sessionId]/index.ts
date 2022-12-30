import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import db from "@/core/db";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
import { PricingPackageId } from "@/core/constants";
import { Prisma, PurchaseType } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionId = req.query.sessionId as string;
  const ppi = req.query.ppi as string;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const packageId = session?.metadata?.packageId as string;
  const selectedPackage = getPackageInfo(packageId);

  const paymentsCreate: Prisma.PaymentCreateInput[] = [
    {
      amount: selectedPackage?.credits!,
      paid_amount: selectedPackage?.price!,
      stripePaymentId: session.id,
      purchaseType: selectedPackage?.purchaseType!,
    },
  ];

  // If there are bonus credits, add them to the payments array
  if (selectedPackage?.bonusCredits) {
    paymentsCreate.push({
      amount: selectedPackage?.bonusCredits,
      paid_amount: 0,
      stripePaymentId: session.id,
      purchaseType: PurchaseType.PROMOTION_CREDIT_GIFT,
    });
  }

  if (
    session.payment_status === "paid" &&
    session.metadata?.projectId === ppi
  ) {
    await db.user.update({
      where: { id: session?.metadata?.userId },
      data: {
        credits: {
          increment: selectedPackage?.totalCredits || 0,
        },
        projects: {
          update: {
            where: { id: ppi },
            data: { stripePaymentId: session.id },
          },
        },
        payments: {
          create: paymentsCreate,
        },
      },
    });

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false });
}
