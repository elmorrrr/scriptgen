import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { configSchema } from "@/validation/zod/config-schema"
import db from "@/lib/db"
import { getSession } from "@/lib/session"
import { generateHexCode, generateScript } from "@/helpers/script"
import transporter from "@/lib/nodemailer"
import { Config } from "@prisma/client"
import formatInternetSpeed from "@/helpers/formatInternetSpeed"

export async function GET(req: Request) {
  const session = getSession()
  try {
    if (!session || session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "Unauthorized request",
          result: null,
        },
        { status: 401 }
      )
    }
    if (session?.user?.role === "ADMIN") {
      const scripts = await db.script.findMany()
      return NextResponse.json({ message: "Scripts", result: scripts })
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, error })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) throw new Error("Unauth")
    const body = configSchema.parse(await req.json())
    const serial_number = generateHexCode()
    const script_text = generateScript({ ...body, serial_number })
    const config: Config = await db.config.create({
      data: {
        ...body,
        speed: Number(body.speed),
        email: session.user.email as string,
        serial_number,
        script: script_text,
      },
    })

    //send email

    const emailTemplate = `
    <html>
      <body>
        <h1>Script Creation Successful</h1>
        <p>Dear ${config.name},</p>
        <p>Your script has been created successfully. Here are the details:</p>
        <ul>
          <li>Client Name: ${config.name}</li>
          <li>Serial number: ${config.serial_number}</li>
          <li>Provider: ${config.provider}</li>
          <li>Speed: ${formatInternetSpeed(config.speed)}</li>
          <li>Date Created: ${config.created_at.toLocaleString()}</li>
        </ul>
        <p>Thank you for using our services!</p>
      </body>
    </html>
  `

    const emailOptions = {
      from: process.env.SMTP_FROM,
      to: config.email,
      subject: "Script Creation Successful",
      html: emailTemplate,
    }

    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        return NextResponse.json(
          {
            message: error.message,
            error: error,
          },
          { status: 400 }
        )
      } else {
        // console.log("Email sent: ", info.response)
      }
    })

    return NextResponse.json({
      message: "Script generated successfully",
      result: config,
    })
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error.flatten(),
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { message: error.message, error: error },
        { status: 500 }
      )
    }
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession()
    if (!session || session?.user.role !== "ADMIN") throw new Error("Unauth")
    const { id, ...rest } = await req.json()

    const newData = await db.config.update({
      where: { id },
      data: { ...rest },
    })
    return NextResponse.json({
      message: "Script updated successfully",
      result: newData,
    })
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error.flatten(),
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { message: error.message, error: error },
        { status: 500 }
      )
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession()
    if (!session || session?.user.role !== "ADMIN") throw new Error("Unauth")
    const { id } = await req.json()

    await db.config.delete({
      where: { id },
    })
    return NextResponse.json({
      message: "Script deleted successfully",
    })
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error.flatten(),
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { message: error.message, error: error },
        { status: 500 }
      )
    }
  }
}
