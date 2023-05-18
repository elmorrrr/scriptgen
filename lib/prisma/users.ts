import { User } from "@prisma/client"
import prisma from "."
import bcrypt from "bcrypt"

export async function getAllUsers() {
  try {
    // @ts-ignore
    const users: User = await prisma.user.findMany()
    return users
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function createUser(user: any) {
  const { hobbies = [], address, email_updates, ...restUserData } = user
  const userFromDB = await prisma.user.create({
    data: {
      ...restUserData,
      hobbies: {
        set: hobbies,
      },
      address: {
        create: address,
      },
      // preference: {
      //   create: email_updates,
      // },
    },
  })
  return userFromDB
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { address: true },
    })
    return user
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function login({ email, username, password }) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: email || username }, { username }],
    },
  })

  if (!user) throw new Error("User not found")

  const isCorrectPassword = await bcrypt.compare(password, user.password)

  if (!isCorrectPassword) {
    throw new Error("Password wrong")
  }

  return user
}
