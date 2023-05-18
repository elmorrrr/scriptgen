"use client"
import Link from "next/link"
import { Icons } from "@/components/icons"
import api from "@/lib/axios"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@components"
import { FiSend, FiCheckCircle } from "react-icons/fi"
// import { FiCheckCircle } from "react-icons/fi"

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
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot Your Password?
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please enter the email address associated with your account to
            receive a password reset link.
          </p>
        </div>
        <form onSubmit={handleResetPassword}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter email or username"
                autoComplete="email"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
                autoFocus={true}
                // {...register("email")}
              />
              {/* {errors?.email && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )} */}

              {error && <p className={"px-1 text-xs text-red-600"}>{error}</p>}

              {helper && helper.field === "email" && (
                <Link
                  href={helper?.href || ""}
                  className={`px-1 text-xs underline ${
                    helper.isError ? "text-red-600" : ""
                  }`}
                >
                  {helper.msg}
                </Link>
              )}
            </div>

            <>
              {status === "sleep" && (
                <Button isLoading={isLoading} icon={<FiSend />}>
                  {(isLoading && "Sending...") || "Send Reset Link"}
                </Button>
              )}

              {status === "pending" && (
                <Button
                  isLoading={isLoading}
                  variant="success"
                  icon={
                    <FiCheckCircle style={{ color: "white" }} color="green" />
                  }
                >
                  {(isLoading && "Sending...") || "Send Another Reset Link"}
                </Button>
              )}
            </>
            {status === "pending" && (
              <>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We sent you a login link. Be sure to check your spam too.
                </p>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-600">
                      Open email 📧
                    </span>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openEmailInBrowser}
                  >
                    browser
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openEmailInSystem}
                  >
                    system
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
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
