import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(request, response) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, password, name } = body

    if (!email?.trim() || !password?.trim()) {
      return Response.json(
        {
          msg: "Please enter required fields",
        },
        {
          status: 401,
        }
      )
    }

    // body.name = `${first_name} ${last_name}`
    body.username = email.split("@")[0]
    body.name = email.split("@")[0]

    const isUserExist = await prisma.user.findUnique({
      where: { email },
    })

    if (isUserExist) {
      return Response.json(
        {
          msg: `User with this email ${email} already exists`,
          result: null,
        },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    body.password = hashedPassword
    const user = await prisma.user.create({
      data: body,
    })

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
