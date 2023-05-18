import { NextResponse } from "next/server"
import twilio, { sendMessage, sendCall } from "@/lib/twilio"
import prisma from "@/lib/db"
import speakeasy from "speakeasy"
import { z, ZodError } from "zod"
import transporter from "@/lib/nodemailer"
import jwt from "jsonwebtoken"
import { ResetPasswordEmail } from "@/email/emails/reset-password"
import { render } from "@react-email/render"
import { createVerificationCode } from "@/lib/verification"

interface BodyProps {
  method: "sms" | "call" | "app" | "email"

  phone?: RequiredIf<BodyProps, "method", "sms" | "call">

  email?: RequiredIf<BodyProps, "method", "email">
}

type RequiredIf<T, K extends keyof T, V> = T & {
  [P in K]-?: T[P] extends V ? NonNullable<T[P]> : T[P]
}

const bodySchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Invalid phone number" })
    .max(14, { message: "Invalid phone number" })
    .optional(),
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

      const existingNumber = await prisma.user.findFirst({
        where: { phone },
      })

      if (!existingNumber) {
        return NextResponse.json(
          { message: `Phone number not exists in database` },
          { status: 400 }
        )
      }
      // const { code, id } = await createVerificationCode()
      const { code, id } = await createVerificationCode(phone)
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

        // await sendCall(phone, twiml)
      }
      if (method === "sms") {
        // await sendMessage(phone, msg + sig)
      }

      return NextResponse.json({
        message: `Sent verification code to ${phone} -${code}`,
        result: id,
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

      const user = await prisma.user.findUnique({
        where: {
          email: email.trim().toLowerCase(),
        },
      })

      if (!user) {
        return NextResponse.json(
          { message: "User with this email not registered." },
          { status: 400 }
        )
      }

      const secret = process.env.NEXTAUTH_SECRET + user.password
      const payload = {
        email: user.email,
        id: user.id,
      }

      const token = jwt.sign(payload, secret, { expiresIn: "15m" })
      const link = `${process.env.SITE_URL}/reset-password/${user.id}/${token}`
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Request for reset password",
        text: "Request for reset password",
        html: render(
          ResetPasswordEmail({
            username: user.name,
            resetPasswordLink: link,
            updatedDate: new Date(),
          })
        ),
      }
      // send email if req coming from client
      transporter.sendMail(mailOptions)

      return NextResponse.json(
        {
          message: "Password reset link has been sent to your email address.",
          result: link,
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
