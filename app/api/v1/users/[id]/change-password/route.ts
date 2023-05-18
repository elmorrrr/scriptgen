import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import getUserById from "@/lib/users/getUserById"
import { NextResponse } from "next/server"

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 20
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,20}$/

// update user info with id
export async function PATCH(request, { params }) {
  const user_id = params.id
  const { current_password, new_password, confirm_password } =
    await request.json()
  try {
    const user = await getUserById(user_id)

    if (!user) {
      return Response.json(
        {
          msg: `User with this id ${user_id} not found`,
          result: null,
        },
        { status: 404 }
      )
    }

    // set password
    if (!new_password || !confirm_password) {
      return Response.json(
        {
          msg: "new_password & confirm_password are required fields",
        },
        { status: 401 }
      )
    }

    if (new_password !== confirm_password) {
      return Response.json(
        {
          msg: "new_password & confirm_password do not match",
        },
        { status: 401 }
      )
    }

    if (
      new_password.length < MIN_PASSWORD_LENGTH ||
      new_password.length > MAX_PASSWORD_LENGTH ||
      !PASSWORD_REGEX.test(new_password)
    ) {
      return Response.json(
        {
          msg: "Password must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, and one number",
        },
        { status: 401 }
      )
    }

    let hashedPassword = null

    if (user.password === null) {
      hashedPassword = await bcrypt.hash(new_password, 12)
    } else {
      const isCorrectPassword = await bcrypt.compare(
        current_password,
        user.password
      )
      if (!isCorrectPassword) {
        return Response.json(
          {
            msg: "Incorrect password",
          },
          { status: 401 }
        )
      }

      hashedPassword = await bcrypt.hash(new_password, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: {
        password: hashedPassword,
      },
      select: {
        username: true,
      },
    })

    return Response.json({
      msg: `User password has been ${
        user.password === null ? "set" : "changed"
      } successfully`,
      result: updatedUser,
    })
  } catch (error) {
    console.log("🚀 ~ file: route.ts:105 ~ PATCH ~ error:", error)
    return Response.json(
      {
        msg: `Failed to update user with id ${user_id}`,
        error: error,
      },
      { status: 500 }
    )
  }
}
