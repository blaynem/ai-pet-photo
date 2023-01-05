import { PricingPackage } from "@/core/constants/pricing-packages";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import db from "@/core/db";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
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
  const packageIdsString = session?.metadata?.packageIdsString as string;
  const packageIdsArray = packageIdsString.split(",") as string[];
  // get packages for each packageId
  const selectedPackages = packageIdsArray.map((id: string) =>
    getPackageInfo(id)
  ) as PricingPackage[];
  try {
    const paymentsCreate = selectedPackages.reduce(
      (acc, pkg: PricingPackage) => {
        // Create initializer array to add
        const payments: Prisma.PaymentCreateInput[] = [];
        // Add the payment for the package
        payments.push({
          amount: pkg?.credits!,
          paid_amount: pkg?.price!,
          stripePaymentId: session.id,
          purchaseType: pkg?.purchaseType!,
        });
        // If there are bonus credits, add them to the payments array
        if (pkg?.bonusCredits) {
          payments.push({
            amount: pkg.bonusCredits,
            paid_amount: 0,
            stripePaymentId: session.id,
            purchaseType: PurchaseType.PROMOTION_CREDIT_GIFT,
          });
        }
        // Add the payments to the accumulator
        return [...acc, ...payments];
      },
      [] as Prisma.PaymentCreateInput[]
    );

    const creditIncrement = selectedPackages.reduce(
      (acc, pkg) => (acc += pkg.totalCredits),
      0
    );

    if (
      session.payment_status === "paid" &&
      session.metadata?.projectId === ppi
    ) {
      await db.user.update({
        where: { id: session?.metadata?.userId },
        data: {
          credits: {
            increment: creditIncrement,
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
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json({ success: false });
  }
}
