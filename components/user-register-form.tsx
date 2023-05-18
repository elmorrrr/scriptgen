"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userRegisterSchema } from "@/validation/zod"
import { Icons } from "@/components/icons"
import { Input } from "@components"
import Button from "./elements/button"
import getFormData from "@/lib/getFormData"
import api from "@/lib/axios"
import Link from "next/link"

type FormData = z.infer<typeof userRegisterSchema>

interface Helper {
  message: string
  isError: boolean
  href?: string
  field: string
}

export default function UserAuthForm({ className, ...props }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userRegisterSchema),
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false)
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [error, setError] = useState(null)
  const [errors2, setErrors] = useState(null)
  const [helper, setHelper] = useState<Helper | null>(null)
  const [serverErrors, setServerErrors] = useState<any>(new Map())
  const router = useRouter()

  async function onSubmit(data: FormData) {
    // localStorage.setItem("email", data?.email || data?.username || "")

    try {
      setIsEmailLoading(true)
      const {
        data: { message, result },
      } = await api.post(`/auth/register`, data)
      await signIn("credentials", {
        email: result.email,
        password: result.password,
        redirect: false,
      })
      toast({
        title: `${message}`,
      })

      router.push("/dashboard")
    } catch ({ response: { data } }) {
      const { message, error, code } = data

      if (error?.name === "ZodError") {
        const errorsMap = new Map(
          error.issues.map(({ path, ...rest }) => [path[0], rest])
        )

        setServerErrors(errorsMap)
      }

      if (code === 1 || code === 2) {
        const goTo = code === 1 ? "login" : code === 2 ? "register" : ""
        setHelper({
          message: message + ", " + goTo,
          isError: true,
          href: goTo,
          field: "email",
        })
      }

      if (code === 3) {
        setHelper({
          message: message + ", Forget password?",
          href: "forget-password",
          field: "password",
          isError: true,
        })
      }

      toast({
        title: message,
        variant: "destructive",
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHelper(null)
    }, 20000)

    return () => clearTimeout(timeout)
  }, [error, helper])

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <form onSubmit={onSubmit}> */}
        <div className="grid gap-2">
          <div className="grid gap-1">
            <>
              <Input
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isLoading}
                autoFocus
                {...register("email")}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
              {serverErrors.get("email") && (
                <p className={"px-1 text-xs text-red-600"}>
                  {serverErrors.get("email").message}
                </p>
              )}
            </>
            {helper && helper.field === "email" && (
              <Link
                href={helper?.href || ""}
                className={`px-1 text-xs underline ${
                  helper.isError ? "text-red-600" : ""
                }`}
              >
                {helper.message}
              </Link>
            )}
          </div>
          <div className="grid gap-1">
            <Input
              placeholder="Enter your password"
              type="password"
              autoComplete="password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
            {serverErrors.get("password") && (
              <p className={"px-1 text-xs text-red-600"}>
                {serverErrors.get("password").message}
              </p>
            )}
            {helper && helper.field === "password" && (
              <Link
                href={helper?.href || ""}
                className={`px-1 text-xs underline ${
                  helper.isError ? "text-red-600" : ""
                }`}
              >
                {helper.message}
              </Link>
            )}
          </div>
          <Button isLoading={isEmailLoading} disabled={isLoading}>
            Register with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-600">Or continue with</span>
        </div>
      </div>
      {/* Auth Providers */}
      <section className="grid gap-3">
        <Button
          icon={<Icons.facebook className="mr-2 h-4 w-4" />}
          type="button"
          variant="outline"
          iconPosition="left"
          onClick={() => {
            setIsFacebookLoading(true)
            setIsLoading(true)
            signIn("facebook")
          }}
          isLoading={isFacebookLoading}
          disabled={isEmailLoading}
        >
          Facebook
        </Button>
        <Button
          icon={<Icons.google className="mr-2 h-4 w-4" />}
          type="button"
          variant="outline"
          iconPosition="left"
          onClick={() => {
            setIsGoogleLoading(true)
            signIn("google")
          }}
          isLoading={isGoogleLoading}
          disabled={isEmailLoading}
        >
          Google
        </Button>
      </section>
    </div>
  )
}
