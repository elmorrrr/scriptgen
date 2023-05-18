import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import jwt from "jsonwebtoken"
import transporter from "@/lib/nodemailer"
import { render } from "@react-email/render"
import { PasswordChangedEmail } from "@/email/emails/password-changed"
import api from "@/lib/axios"
import bcrypt from "bcrypt"
import updateUserPassword from "@/lib/users/updateUserPassword"

export async function POST(req: Request, { params }, res: Response) {
  const origin = req.headers.get("origin")
  const { password, confirm_password } = await req.json()
  if (!params.user_id || !params.token) {
    return NextResponse.json(
      { msg: "Invalid password reset url" },
      { status: 400 }
    )
  }

  if (!password.trim() || !confirm_password.trim()) {
    return NextResponse.json(
      { msg: "please enter required fields" },
      { status: 400 }
    )
  }

  if (password !== confirm_password) {
    return NextResponse.json({ msg: "Passwords do not match" }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: params.user_id } })

    if (!user) {
      return NextResponse.json(
        { msg: "User with this id not registered" },
        { status: 400 }
      )
    }

    // verify token
    const secret = process.env.NEXTAUTH_SECRET + user.password
    let decoded
    try {
      decoded = jwt.verify(params.token, secret)
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          {
            msg: "Your password reset link has expired. Please request a new one.",
            error: err,
          },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { msg: "Invalid token", error: err },
          { status: 400 }
        )
      }
    }

    if (decoded.id !== params.user_id) {
      return NextResponse.json(
        { msg: "Invalid token. Token does not match user id." },
        { status: 400 }
      )
    }

    const updatedUserPassword = await updateUserPassword(
      params.user_id,
      password
    )

    if (!updatedUserPassword) {
      return NextResponse.json(
        {
          msg: "Something went wrong while updating your password. Please try again later.",
        },
        { status: 400 }
      )
    }

    const { data } = await api.post(origin + "/api/v1/auth/forget-password", {
      email: user.email,
    })

    if (!data?.result) {
      return NextResponse.json(
        { msg: "Something wrong when start generate magic link" },
        { status: 400 }
      )
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Password changed",
      html: render(
        PasswordChangedEmail({
          username: user.name,
          resetPasswordLink: data.result,
          code: "1234",
          updatedDate: new Date(),
        })
      ),
    }

    transporter.sendMail(mailOptions)

    return NextResponse.json(
      {
        msg: "Your password has been successfully updated. You can now use your new password to log in.",
        result: null,
      },
      { status: 200 }
    )
  } catch (err) {
    console.log("🚀 ~ file: route.ts:106 ~ POST ~ err:", err)
    return NextResponse.json(
      {
        // msg: "Something went wrong while updating your password. Please try again later.",
        msg: err.message,
        error: err,
      },
      { status: 500 }
    )
  }
}
