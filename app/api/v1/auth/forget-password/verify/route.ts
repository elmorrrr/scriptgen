import { NextResponse } from "next/server"
import twilio, { sendMessage, sendCall } from "@/lib/twilio"
import prisma from "@/lib/db"
import speakeasy from "speakeasy"
import { z, ZodError } from "zod"
import transporter from "@/lib/nodemailer"
import jwt from "jsonwebtoken"
import { ResetPasswordEmail } from "@/email/emails/reset-password"
import { render } from "@react-email/render"
import { createVerificationCode, verifyCode } from "@/lib/verification"

const bodySchema = z
  .object({
    id: z.string({
      required_error: "Please provide ID",
      invalid_type_error: "ID must be string",
    }),
    code: z
      .string({
        required_error: "Please provide code",
        invalid_type_error: "Code must be string digits",
      })
      .length(6, { message: "Code must be 6 digits" }),
  })
  .strict()

type bodyProps = z.infer<typeof bodySchema>

export async function POST(req: Request, res: Response) {
  try {
    const { id, code }: bodyProps = bodySchema.parse(await req.json())

    const isCorrectCode = await verifyCode(id, code)

    if (!isCorrectCode) {
      return NextResponse.json(
        {
          message: "Invalid code",
        },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { phone: isCorrectCode.contact },
    })

    if (!user) {
      return NextResponse.json(
        {
          message: "User not exists",
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: "Your code is valid",
      result: user.id,
    })
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
