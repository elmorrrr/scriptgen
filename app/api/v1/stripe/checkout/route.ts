import { getSession } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { user } = (await getSession()) ?? {}
    if (!user) {
      throw new Error("User not found")
    }
    const origin = req.headers.get("origin")
    const otherData = await req.json()

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: `${origin}/dashboard/billings`,
      })

      return NextResponse.json(
        { msg: "Session updated", session_url: stripeSession.url },
        { status: 202 }
      )
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRO_MONTHLY_PLAN_ID,
          quantity: 1,
        },
      ],
      metadata: {
        client: JSON.stringify(otherData),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    })

    if (stripeSession) {
      return NextResponse.json(
        { msg: "Session created", session_url: stripeSession.url },
        { status: 201 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { msg: error.message, error: error },
      { status: 500 }
    )
  }
}
