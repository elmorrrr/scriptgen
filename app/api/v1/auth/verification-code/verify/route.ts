import prisma from "@/lib/prisma"
import speakeasy from "speakeasy"
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
  const { otp_code, user_id } = await req.json()

  if (!otp_code || !user_id) {
    return NextResponse.json(
      { message: "otp_code and user_id required" },
      { status: 400 }
    )
  }

  try {
    // Find the OTP record in the database
    const otpRecord = await prisma.otp.findFirst({
      where: { user_id },
      orderBy: { createdAt: "desc" },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { message: "OTP record not found" },
        { status: 400 }
      )
    }

    // Verify the OTP code
    const isMatch = speakeasy.totp.verify({
      secret: otpRecord.secret,
      encoding: "base32",
      token: otp_code,
    })

    if (isMatch) {
      // Mark the OTP record as used
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { counter: otpRecord.counter + 1 },
      })

      await prisma.user.update({
        where: { id: user_id },
        data: {
          otp_enabled: true,
        },
      })

      return NextResponse.json({ message: "OTP code verified successfully" })
    }
    return NextResponse.json({ message: "Invalid OTP code" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to verify OTP code" })
  }
}

// updated user phone_verified to date if user is verified
