import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

// get user with id
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const userId = url.pathname.split("/").pop()
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        address: true,
      },
    })
    if (!user) {
      return Response.json(
        {
          msg: `No user found with this id ${userId}`,
          result: null,
        },
        { status: 404 }
      )
    }
    return Response.json({ msg: "Get User by ID", result: user })
  } catch (error) {
    console.log(error)
    return Response.json({ msg: error.message }, { status: 500 })
  }
}

// update user info with id
export async function PATCH(request) {
  const url = new URL(request.url)
  const user_id = url.pathname.split("/").pop()
  const data = await request.json()
  try {
    const {
      hobbies = [],
      address,
      password,
      current_password,
      new_password,
      confirm_new_password,
      email_updates,
      ...restUserData
    } = data
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: { address: true },
    })

    if (!user) {
      return Response.json(
        {
          msg: `User with this id ${user_id} not found`,
          result: null,
        },
        { status: 404 }
      )
    }

    // this check if is user has address so update if not is create address object
    const address_method = user?.address ? "update" : "create"

    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: {
        ...restUserData,
        address: {
          [address_method]: address,
        },
      },
      select: {
        id: true,
        email: true,
      },
    })

    return Response.json({
      msg: "User updated",
      result: updatedUser,
    })
  } catch (error) {
    console.log("🚀 ~ file: route.ts:105 ~ PATCH ~ error:", error)
    return Response.json(
      {
        msg: error.message,
        error: error,
      },
      { status: 500 }
    )
  }
}
