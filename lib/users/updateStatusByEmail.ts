import prisma from "@/lib/db"

async function updateStatusByEmail(email: string, newStatus: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error(`User with email ${email} not found`)
  }

  return prisma.user.update({
    where: { id: user.id },
    data: { status: newStatus },
  })
}
