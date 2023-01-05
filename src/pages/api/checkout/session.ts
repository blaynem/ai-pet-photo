import { PricingPackage } from "./../../../core/constants/pricing-packages";
import { PricingPackageId } from "@/core/constants";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
import { PurchaseType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Stripe from "stripe";
import { LineItem } from "@stripe/stripe-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userSession = await getSession({ req });
    const packageIds = req.query.packageIds as string;

    // split package IDs by comma
    const packageIdsArray = packageIds.split(",") as string[];
    // get packages for each packageId
    const selectedPackages = packageIdsArray.map((id: string) =>
      getPackageInfo(id)
    );

    // Only check for promotional code if the user is purchasing the studio package
    if (packageIdsArray.includes(PricingPackageId.PROMOTION_STUDIO)) {
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
    if (!selectedPackages) {
      return res.status(400).json("No packages selected");
    }

    const lineItems = selectedPackages.map((selectedPackage) => {
      // This name should only go through if we forget to update the pricing packages when we add a new one.
      let name = "PetPics.ai Purchase";
      if (
        selectedPackage?.purchaseType === "STUDIO_PURCHASE" ||
        selectedPackage?.purchaseType === "PROMOTION_STUDIO_PURCHASE"
      ) {
        // Name if studio package is purchased
        name = `Studio model training ${
          selectedPackage?.totalCredits
            ? `+ ${selectedPackage.totalCredits} credits`
            : ""
        }`;
      } else if (
        selectedPackage?.purchaseType === "CREDIT_PURCHASE" ||
        selectedPackage?.purchaseType === "PROMOTION_CREDIT_GIFT"
      ) {
        // name if credit package is purchased
        name = `${selectedPackage?.totalCredits} Credits`;
      }
      return {
        price_data: {
          currency: "usd",
          unit_amount: selectedPackage?.price,
          product_data: {
            name: name,
          },
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      metadata: {
        userId: userSession?.user?.id as string,
        projectId: req.query.ppi as string,
        packageIds,
      },
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&ppi=${req.query.ppi}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return res.redirect(303, session.url!);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
}
