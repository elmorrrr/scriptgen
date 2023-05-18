import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import { getAllUsers, createUser, getUserById } from "@/lib/prisma/users"

// get All users
export async function GET(request) {
  try {
    const users = await getAllUsers()
    return Response.json({ msg: "Get Users", result: users })
  } catch (error) {
    return Response.json({ msg: error.message }, { status: 500 })
  }
}

// create user
export async function POST(request, response) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (
      !email.trim() ||
      !first_name.trim() ||
      !last_name.trim() ||
      !password.trim()
    ) {
      return Response.json(
        {
          msg: "Please enter required fields",
        },
        {
          status: 401,
        }
      )
    }

    body.name = `${first_name} ${last_name}`
    body.username = email.split("@")[0]

    const user = await createUser(body)
    return Response.json(
      {
        msg: `User created successfully`,
        result: user,
      },
      { status: 201 }
    )
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
