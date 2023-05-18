import { NextResponse } from "next/server"
import twilio, { sendMessage, sendCall } from "@/lib/twilio"
import prisma from "@/lib/db"
import speakeasy from "speakeasy"
import { z, ZodError } from "zod"
/**
 * The properties expected in the request body for sending a verification code.
 * If `method` is "sms" or "call", `phone` is required.
 * If `method` is "email", `email` is required.
 */
interface BodyProps {
  /**
   * The method to use for sending the verification code.
   */
  method: "sms" | "call" | "app" | "email"

  /**
   * The phone number to send the verification code to (required for "sms" and "call" methods).
   */
  phone?: RequiredIf<BodyProps, "method", "sms" | "call">

  /**
   * The email address to send the verification code to (required for "email" method).
   */
  email?: RequiredIf<BodyProps, "method", "email">
}

/**
 * A type that makes a property required if another property has a certain value.
 */
type RequiredIf<T, K extends keyof T, V> = T & {
  [P in K]-?: T[P] extends V ? NonNullable<T[P]> : T[P]
}

const OTP_SECRET = process.env.NEXTAUTH_SECRET

// Generate a new verification code and store it in the database
async function generateCode(phone) {
  const code = speakeasy.totp({
    secret: OTP_SECRET,
    encoding: "base32",
  })
  await prisma.verificationCode.create({
    data: {
      phone,
      code,
    },
  })
  return code
}

const bodySchema = z.object({
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  method: z.enum(["sms", "call", "email"]),
})

type bodyProps = z.infer<typeof bodySchema>

export async function POST(req: Request, res: Response) {
  try {
    const { phone, email, method }: bodyProps = bodySchema.parse(
      await req.json()
    )
    const url = new URL(req.url)
    if (method === "sms" || method === "call") {
      if (!phone) {
        return NextResponse.json(
          { message: `Phone number is required to send ${method}` },
          { status: 400 }
        )
      }
      const existingCode = await prisma.verificationCode.findUnique({
        where: { phone },
      })

      const existingNumber = await prisma.user.findFirst({
        where: { phone },
      })

      return NextResponse.json({ message: `Code sent` }, { status: 200 })

      if (!existingNumber) {
        return NextResponse.json(
          { message: `Phone number not exists in database` },
          { status: 400 }
        )
      }
      const code = existingCode ? existingCode.code : await generateCode(phone)
      const msg = `Your one-time verification code is ${code}.`
      const sig = `\n\n@${url.hostname} #${code}`
      if (method === "call") {
        const twiml = new twilio.twiml.VoiceResponse()
        const digits = code.split("").join(" ")

        twiml.say("Your OTP is:")
        twiml.say(digits, { sayAs: "digits" })
        twiml.pause({ length: 1 })
        twiml.say("I repeat, your OTP is:")
        twiml.say(digits, { sayAs: "digits" })
        twiml.pause({ length: 1 })

        await sendCall(phone, twiml)
      }
      if (method === "sms") {
        await sendMessage(phone, msg + sig)
      }

      return NextResponse.json({
        message: `Sent verification code to ${phone}: ${code}`,
      })
    }

    if (method === "email") {
      if (!email) {
        return NextResponse.json(
          {
            message: `Email is required to send Verification code in Email`,
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          message: `Handel send email`,
        },
        { status: 200 }
      )
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          message: err.errors[0].message,
          error: err.flatten(),
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: err.message, error: err },
      { status: 500 }
    )
  }
}
