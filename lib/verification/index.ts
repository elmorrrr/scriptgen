import prisma from "@/lib/prisma"

export async function createVerificationCode(
  contact: string,
  code?: string,
  expiration?: Date
) {
  if (!code) {
    // Generate random 6-digit code
    code = String(Math.floor(100000 + Math.random() * 900000))
  }

  if (!expiration) {
    // Set expiration to 15 minutes from now
    expiration = new Date(Date.now() + 5 * 60 * 1000)
  }

  const result = await prisma.verificationCode.create({
    data: {
      code,
      expiration,
      contact,
    },
  })

  return result
}

export async function getVerificationCodeById(id: string) {
  const result = await prisma.verificationCode.findUnique({
    where: { id },
  })

  return result
}

export async function getVerificationCodeByPhone(phone: string) {
  const result = await prisma.verificationCode.findFirst({
    where: { phone },
    createdAt: {},
  })

  return result
}

export async function verifyCode(id: string, code: string) {
  const verificationCode = await getVerificationCodeById(id)

  if (!verificationCode) {
    // The verification code doesn't exist
    throw new Error("The verification code doesn't exist")
  }

  if (verificationCode.code !== code) {
    // The verification code doesn't match
    throw new Error("The verification code doesn't match")
  }

  if (verificationCode.expiration < new Date()) {
    // The verification code has expired
    throw new Error("The verification code has expired")
  }

  // The verification code is valid
  return verificationCode
}
