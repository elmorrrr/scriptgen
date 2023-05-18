import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import jwt from "jsonwebtoken"
import transporter from "@/lib/nodemailer"
import { render } from "@react-email/render"
import { PasswordChangedEmail } from "@/email/emails/password-changed"
import { resetPasswordSchema } from "@/validation/zod"
import updateUserPassword from "@/lib/users/updateUserPassword"
import api from "@/lib/axios"
import bcrypt from "bcrypt"

export async function PATCH(req: Request, { params }, res: Response) {
  try {
    const { user_id, phone, email, new_password, confirm_new_password } =
      resetPasswordSchema.parse(await req.json())

    if (new_password !== confirm_new_password) {
      return NextResponse.json({ msg: "Password not match" }, { status: 400 })
    }

    if (!user_id && !phone && !email) {
      return NextResponse.json(
        { me: "Please provide email or user id or email to change password" },
        { status: 400 }
      )
    }

    const user = await updateUserPassword(user_id, new_password)

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Password changed",
      // html: render(),
      // PasswordChangedEmail()
    }

    // transporter.sendMail(mailOptions)

    return NextResponse.json(
      {
        message:
          "Your password has been successfully updated. You can now use your new password to log in.",
        result: null,
      },
      { status: 200 }
    )
  } catch (err) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        {
          message: err.issues[0].message,
          error: err.flatten(),
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        message: err.message,
        error: err,
      },
      { status: 500 }
    )
  }
}
