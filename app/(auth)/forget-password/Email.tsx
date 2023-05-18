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

  const handleResetPassword = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await api.post("/auth/forget-password", { email, method: "email" })
      toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam too.",
      })
      setError(null)
      return setStatus(Status.Pending)
    } catch (err) {
      setError(err.response.data.message)
      return toast({
        title: err.response.data.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
              icon={<FiCheckCircle style={{ color: "white" }} color="green" />}
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
  )
}
