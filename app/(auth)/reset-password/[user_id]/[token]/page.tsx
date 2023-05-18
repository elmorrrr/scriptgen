"use client"
import api from "@/lib/axios"

// export default function ResetPassword({ params }) {
//   const [error, setError] = useState<string | null>(null)
//   const handleResetPassword = async (e: any) => {
//     e.preventDefault()
//     const formData = getFormData(e.target)

//     if (formData["password"] !== formData["confirm_password"]) {
//       alert("Passcode not eq")
//       return setError("Password not match")
//       // set error notif
//     }

//     try {
//       const res = await api.post(
//         `/auth/reset-password/${params.user_id}/${params.token}`,
//         formData
//       )
//       console.log("🚀 ~ file: page.tsx:23 ~ handleResetPassword ~ res:", res)
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   return (
//     <form onSubmit={handleResetPassword}>
//       <h1>set new password {JSON.stringify(params)}</h1>
//       {error && <p>{error}</p>}
//       <input type="text" name="password" placeholder="enter passcode" />
//       <input
//         type="text"
//         name="confirm_password"
//         placeholder="enter new passcode"
//       />
//       <button>Submit</button>
//     </form>
//   )
// }

import Link from "next/link"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { userAuthSchema } from "@/lib/validations/auth"
import { Button, Input } from "@components"

export default function ResetPasswordPage({ params }) {
  console.log("🚀 ~ file: page.tsx:56 ~ ResetPasswordPage ~ params:", params)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [helper, setHelper] = useState<{
    msg: string
    isError: boolean
    href?: string
    field?: string
  } | null>(null)
  const router = useRouter()

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast({
        title: "Passwords not match",
        variant: "destructive",
      })
    }

    try {
      setIsLoading(true)
      const {
        data: { msg },
      } = await api.post(
        `/auth/reset-password/${params.user_id}/${params.token}`,
        {
          password,
          confirm_password: confirmPassword,
        }
      )
      toast({
        title: msg,
      })
    } catch (err) {
      const { msg, error } = err.response.data
      if (error?.name === "TokenExpiredError") {
        setHelper({
          msg: msg + " Request rest password",
          href: "forget-password",
          isError: true,
        })
      }
      if (error?.name === "JsonWebTokenError") {
        toast({
          title: msg,
          variant: "destructive",
        })
        return router.push("/")
      }
      return toast({
        title: msg,
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
            Reset Your Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please enter a new password for your account.
          </p>

          {helper && (
            <Link
              href={helper.href || ""}
              className={`px-1 text-xs text-red-600 underline`}
            >
              {helper.msg}
            </Link>
          )}
        </div>
        <form onSubmit={handleResetPassword}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Input
                name="password"
                label="New Password"
                type="password"
                placeholder="Enter new password"
                autoComplete="password"
                required={true}
                disabled={isLoading}
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
                // {...register("email")}
              />
              {/* {errors?.email && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )} */}

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
            <div className="grid gap-1">
              <Input
                label="Confirm New Password"
                type="password"
                id="confirm-password"
                name="confirm_password"
                required
                placeholder="Re-enter new password"
                disabled={isLoading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // {...register("email")}
              />
              {/* {errors?.email && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )} */}
            </div>
            <Button isLoading={isLoading}>Reset Password</Button>
          </div>
        </form>
        <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
