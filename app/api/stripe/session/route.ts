import { getSession } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import db from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { user } = (await getSession()) ?? {}
    if (!user) {
      throw new Error("User not found")
    }
    const origin = req.headers.get("origin")
    const otherData = await req.json()
    console.log("🚀 ~ file: route.ts:15 ~ POST ~ otherData:", otherData)

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email as string,
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
      // success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${origin}/dashboard/scripts`,
      cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    })

    const updatedScript = await db.config.update({
      where: { id: otherData.script_id },
      data: {
        payment_status: "completed",
      },
    })

    if (stripeSession) {
      return NextResponse.json(
        {
          msg: "Session created",
          session_url: stripeSession.url,
          result: updatedScript,
        },
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
