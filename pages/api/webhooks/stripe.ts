import { NextApiRequest, NextApiResponse } from "next"
import rawBody from "raw-body"
import Stripe from "stripe"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { string } from "prop-types"

export const config = {
  api: {
    // Turn off the body parser so we can access raw body for verification.
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = await rawBody(req)
  const signature = req.headers["stripe-signature"] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (error) {
    return res.status(400).send(`❌ Webhook Error: ${error.message}`)
  }
  const session = event.data.object as Stripe.Checkout.Session

  if (
    event.type === "invoice.payment_succeeded" ||
    event.type === "checkout.session.completed"
  ) {
    // Retrieve the subscription details from Stripe.

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (event.type === "checkout.session.completed") {
      await db.user.update({
        where: {
          id: session?.client_reference_id as string,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      })
    }

    // Update the price id and set the new period end.
    if (event.type === "invoice.payment_succeeded") {
      console.log("🚀 ~ file: stripe.ts:49 ~ event.type:", event.type)

      await db.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      })
    }
  }

  return res.json({ msg: "HOOK COMPLETED" })
}
