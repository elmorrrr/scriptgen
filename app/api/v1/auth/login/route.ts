import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

import { userLoginSchema } from "@/validation/zod"
import { getUserById } from "@/lib/prisma/users"
import { NextResponse } from "next/server"

export async function POST(request, response) {
  try {
    const { username, password } = userLoginSchema.parse(await request.json())

    const cred = username.includes("@") ? "email" : "username"

    const user = await prisma.user.findUnique({
      where: {
        [cred]: username,
      },
    })

    if (!user) {
      return Response.json(
        {
          message: `Couldn't find account with this ${cred}`,
          result: null,
          code: 2,
        },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return Response.json(
        {
          message: `Wrong password`,
          result: null,
          code: 3,
        },
        { status: 401 }
      )
    }

    return Response.json(
      {
        message: `Welcome back ${user.username}`,
        result: user,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error,
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      )
    }
  }
}
