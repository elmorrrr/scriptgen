import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import generateUsernameFromEmail from "@/helpers/generateUsernameFromEmail"
import { userRegisterSchema } from "@/validation/zod"

async function generateUniqueUsername(username) {
  let newUsername = username
  let counter = 1
  while (await prisma.user.findUnique({ where: { username: newUsername } })) {
    counter++
    newUsername = `${username}${counter}`
  }
  return counter > 1 ? newUsername : username
}

export async function POST(request: Request, response: Response) {
  try {
    const { email, password } = userRegisterSchema.parse(await request.json())

    const username = generateUsernameFromEmail(email)
    const suggestedUsername = await generateUniqueUsername(username)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          message: `User with this email already exists`,
          result: null,
          code: 1,
        },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        // first_name,
        // last_name,
        // name: `${first_name} ${last_name}`,
        email,
        password: hashedPassword,
        username: suggestedUsername,
        name: username,
      },
    })

    return NextResponse.json(
      {
        message: `User created successfully`,
        result: user,
      },
      { status: 201 }
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
        { error: error, message: error.message },
        { status: 500 }
      )
    }
  }
}
