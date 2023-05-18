"use client"
import { useState } from "react"
import axios from "@/lib/axios"
import { Button, OTPInput } from "@components"
import { toast } from "@/hooks/use-toast"
import { redirect, useRouter } from "next/navigation"

type Props = {
  user_id: string
}

export default function VerifyToken({ user_id }: Props) {
  const [otpCode, setOtpCode] = useState("")
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()
  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (!otpCode) {
      return toast({
        title: "OTP field is required to complete this process.",
        variant: "destructive",
      })
    }

    if (otpCode?.length !== 6) {
      return toast({
        title: "OTP must be 6 digits",
        variant: "destructive",
      })
    }

    try {
      setLoading(true)
      const {
        data: { message },
      } = await axios.post("/auth/otp/verify", {
        user_id,
        otp_code: otpCode,
      })
      toast({
        title: message,
      })
      router.push("/dashboard")
    } catch (error) {
      return toast({
        title: error.response.data.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleVerifyOtp}
      className="center grid w-full max-w-lg place-items-center gap-5"
    >
      <h1 className="text-2xl font-semibold tracking-tight">
        QR Code Verification
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Please enter the verification code from the authentication app into the
        OTP input field below.
      </p>
      <OTPInput value={otpCode} onChange={(value) => setOtpCode(value)} />
      <Button isLoading={isLoading}>Verify with OTP</Button>
    </form>
  )
}
