"use client"
import {useEffect ,useCallback , useState} from "react"
import Link from "next/link"
import { Icons } from "@/components/icons"
import api from "@/lib/axios"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@components"
import { FiSend, FiCheckCircle } from "react-icons/fi"
// import { FiCheckCircle } from "react-icons/fi"

import EmailForm from "./Email"
import PhoneForm from "./Phone"
import { useSearchParams , useRouter , usePathname } from 'next/navigation';
enum Status {
  Pending = "pending",
  Completed = "completed",
  Sleep = "sleep",
}

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<Status>(Status.Sleep)
  const [email, setEmail] = useState<string>(
    typeof window !== "undefined"
      ? (window?.localStorage.getItem("email") as string)
      : ""
  )
  const [error, setError] = useState(null)
  const [helper, setHelper] = useState<{
    msg: string
    isError: boolean
    href?: string
    field: string
  } | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams();
  const [isEmail, setIsEmail] = useState<boolean>(searchParams.get("method") === "phone" ? false:  true); // set isEmail to true by default

  const openEmailInBrowser = () => {
    const domain = email.split("@")[1]
    if (!domain) return alert("Please provide email address")
    if (domain === "gmail.com") {
      window.open("https://mail.google.com/mail", "_blank")
    } else if (domain === "yahoo.com") {
      window.open("https://mail.yahoo.com", "_blank")
    } else if (
      domain === "outlook.com" ||
      domain === "hotmail.com" ||
      domain === "live.com"
    ) {
      window.open("https://outlook.live.com/mail/0/inbox", "_blank")
    } else {
      // Open the email provider's website in a new tab
      window.open("https://" + domain, "_blank")
    }
  }

  const openEmailInSystem = () => {
    window.location.href = "mailto"
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await api.post("/auth/forget-password", { email })
      toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam too.",
      })
      setError(null)
      return setStatus(Status.Pending)
    } catch (err) {
      setError(err.response.data.msg)
      return toast({
        title: err.response.data.msg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/login">
        <Button
          icon={<Icons.chevronLeft className="mr-2 h-4 w-4" />}
          variant="ghost"
          className={"absolute right-4 top-4 md:right-8 md:top-8"}
        >
          Login
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {isEmail ? <EmailForm /> : <PhoneForm />}
        <p
          onClick={() => setIsEmail(!isEmail)}
          className="text-sm text-slate-500 dark:text-slate-400 underline"
        >
         {!isEmail ? "Do you want resive reset password link via email?" : "Do you want resive reset password code via phone?"}
        </p>
        <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Do you have an account? Login
          </Link>
        </p>
      </div>
    </div>
  )
}
