import prisma from "@/lib/prisma"

export default async function getUserById(user_id: string) {
  return await prisma.user.findUnique({
    where: { id: user_id },
  })
}
