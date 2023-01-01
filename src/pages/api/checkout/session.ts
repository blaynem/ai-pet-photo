import { PricingPackageId } from "@/core/constants";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
import { PurchaseType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userSession = await getSession({ req });
    const packageId = req.query.packageId as string;
    const selectedPackage = getPackageInfo(packageId);

    // Only check for promotional code if the user is purchasing the studio package
    if (packageId === PricingPackageId.PROMOTION_STUDIO) {
      // Check the db to see if the user has already used a promotional code
      const hasPromotionalPurchase = await db?.payment.findFirst({
        where: {
          userId: userSession?.user?.id,
          purchaseType: PurchaseType.PROMOTION_STUDIO_PURCHASE,
        },
      });

      // If the user has already used a promotional code, return an error
      if (hasPromotionalPurchase) {
        return res
          .status(400)
          .json("You have already used your promotional code");
      }
    }

    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      metadata: {
        userId: userSession?.user?.id as string,
        projectId: req.query.ppi as string,
        packageId,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: selectedPackage?.price,
            product_data: {
              name: `Studio model training ${
                selectedPackage?.totalCredits
                  ? `+ ${selectedPackage.totalCredits} credits`
                  : ""
              }`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&ppi=${req.query.ppi}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return res.redirect(303, session.url!);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
}
