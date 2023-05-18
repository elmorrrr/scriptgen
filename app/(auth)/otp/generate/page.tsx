import { Button } from "@/components"
import getSession from "@/lib/session"
import axios from "axios"
import Link from "next/link"
import { redirect } from "next/navigation"
// import axios from "@/lib/axios"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import Clip from "./Clip"

type Props = {}

export default async function Page({}: Props) {
  const session = await getSession()

  if (!session?.user) {
    return redirect("/login")
  }

  const { result: user } = await fetch(
    `http://localhost:3000/api/v1/users/${session.user.id}`,
    {
      method: "GET",
    }
  ).then((res) => res.json())

  const { result, message } = await fetch(
    "http://localhost:3000/api/v1/auth/otp/generate",
    {
      method: "POST",
      body: JSON.stringify({
        // type: "message",
        phone: user.phone || "+21656441174",
        type: "qr_code",
        email: user.email,
        user_id: user.id,
      }),
    }
  ).then((res) => res.json())

  if (!result) {
    toast({
      title: message,
      variant: "destructive",
    })
    return <div>err {message}</div>
  }

  toast({
    title: message,
  })

  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="center w-max-lg grid max-w-lg gap-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Scan QR Code to Setup Two-Factor Authentication
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          To setup two-factor authentication, please scan the QR code below
          using an authenticator app such as Google Authenticator. Once scanned,
          the app will automatically generate a One-Time Password (OTP) that you
          can use for verification purposes.
        </p>
        <Clip secret={result.secret} />
        <Image
          width={200}
          height={200}
          alt="ScriptGen QR Code"
          src={result.qrCodeUrl}
        />
        <Link href="/otp/verify">
          <Button icon={<Icons.chevronRight className="mr-2 h-4 w-4" />}>
            QR Scanned?, Next
          </Button>
        </Link>
        <Link href="/otp/verify">
          <Button
            icon={<Icons.chevronRight className="mr-2 h-4 w-4" />}
            className={cn("absolute right-4 top-4 md:right-8 md:top-8")}
          >
            Next
          </Button>
        </Link>
      </div>
    </div>
  )
}
