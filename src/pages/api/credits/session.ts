import { getPackageInfo } from "@/core/utils/getPackageInfo";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Stripe from "stripe";
import { CREDIT_PRICE } from "../../../core/constants";

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

    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      metadata: {
        userId: userSession?.user?.id as string,
        packageId,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: selectedPackage?.price,
            product_data: {
              name: `${selectedPackage?.totalCredits} Credits`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&ppi=${req.query.ppi}&updateCredits=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return res.redirect(303, session.url!);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
}
