import bcrypt from "bcrypt"
import prisma from "@/lib/db"

const updateUserPassword = async (user_id: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  })

  if (!user) {
    throw new Error("User with id not registred")
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  return await prisma.user.update({
    where: { id: user_id },
    data: {
      password: hashedPassword,
    },
  })
}

export default updateUserPassword
