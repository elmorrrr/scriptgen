// import { NextResponse, NextApiRequest, NextApiResponse } from "next/server"
// import rawBody from "raw-body"
// import Stripe from "stripe"
// import { buffer } from "micro"
// import { db } from "@/lib/db"
// import { stripe } from "@/lib/stripe"

// export async function POST(req: Request, { params }: any) {
//   const url = new URL(req.url)
//   switch (params.id) {
//     case "stripe":
//       const signature = req.headers.get("stripe-signature") as string
//       let event: Stripe.Event

//       try {
//         const body = await rawBody(req)
//         console.log("🚀 ~ file: route.ts:23 ~ POST ~ body:", body)
//         event = stripe.webhooks.constructEvent(
//           body,
//           signature,
//           process.env.STRIPE_WEBHOOK_SECRET || ""
//         )
//       } catch (error) {
//         console.log(`❌ Error message: ${error.message}`)
//         return NextResponse.json(
//           { msg: `Webhook Error: ${error.message}` },
//           { status: 400 }
//         )
//       }

//       console.log("✅ Success:", event.id)

//       return NextResponse.json(
//         { msg: params.id, result: event },
//         { status: 201 }
//       )
//     case "twilio":
//       return NextResponse.json({ msg: params.id }, { status: 201 })
//     default:
//       return NextResponse.json(
//         { msg: url.pathname + " pathname not supported" },
//         { status: 404 }
//       )
//   }
// }

// export function GET(req: Request, { params }: any) {
//   const url = new URL(req.url)
//   switch (params.id) {
//     case "stripe":
//       return NextResponse.json({ msg: params.id }, { status: 201 })
//     case "twilio":
//       return NextResponse.json({ msg: params.id }, { status: 201 })
//     default:
//       return NextResponse.json(
//         { msg: url.pathname + " pathname not supported" },
//         { status: 404 }
//       )
//   }
// }
