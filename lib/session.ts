import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

import { authOptions } from "@/lib/auth"

export async function getSession() {
  const session = await getServerSession(authOptions)
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user?.id) return null
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    return user
  } catch (error) {
    return null
  }
}

export default getSession
