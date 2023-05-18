// "use client"
// import { useRouter } from "next/navigation"
// import * as React from "react"
// import { useSearchParams } from "next/navigation"
// import { toast } from "@/hooks/use-toast"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { signIn } from "next-auth/react"
// import { useForm } from "react-hook-form"
// import * as z from "zod"

// import { cn } from "@/lib/utils"
// import { userAuthSchema } from "@/lib/validations/auth"
// import { Icons } from "@/components/icons"
// import { buttonVariants } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Button from "./elements/button"

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
//   type: string
// }

// type FormData = z.infer<typeof userAuthSchema>

// export function UserAuthForm({ type, className, ...props }: UserAuthFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(userAuthSchema),
//   })
//   const [isLoading, setIsLoading] = React.useState<boolean>(false)
//   const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
//   const [isEmailLoading, setIsEmailLoading] = React.useState<boolean>(false)
//   const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   async function onSubmit(data: FormData) {
//     // const signInResult = await signIn("email", {
//     //   email: data.email.toLowerCase(),
//     //   redirect: false,
//     //   callbackUrl: searchParams?.get("from") || "/dashboard",
//     // })
//     // return toast({
//     //   title: "Check your email",
//     //   description:
//     //     "We sent you a login link. Be sure to check your spam too.",
//     // })
//     try {
//       setIsEmailLoading(true)

//       const signInResult = await signIn("credentials", {
//         ...data,
//         redirect: false,
//       })

//       if (!signInResult?.ok) {
//         throw new Error(signInResult.error)
//       }
//       toast({
//         title: `Welcome back ${data.email.split("@")[0]}`,
//       })

//       router.push("/dashboard")
//     } catch (error) {
//       return toast({
//         title: error.message,
//         variant: "destructive",
//       })
//     } finally {
//       setIsEmailLoading(false)
//     }
//   }

//   return (
//     <div className={cn("grid gap-6", className)} {...props}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid gap-2">
//           <div className="grid gap-1">
//             <Input
//               id="email"
//               placeholder="name@example.com"
//               type="email"
//               autoCapitalize="none"
//               autoComplete="email"
//               autoCorrect="off"
//               disabled={isLoading}
//               required={true}
//               {...register("email")}
//             />
//             {errors?.email && (
//               <p className="px-1 text-xs text-red-600">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>
//           <div className="grid gap-1">
//             <Input
//               id="password"
//               placeholder="Enter your password"
//               type="password"
//               autoCapitalize="none"
//               autoComplete="password"
//               autoCorrect="off"
//               required={true}
//               disabled={isLoading}
//               {...register("password")}
//             />
//             {type === "register" && errors?.password && (
//               <p className="px-1 text-xs text-red-600">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>
//           <Button isLoading={isEmailLoading} disabled={isLoading}>
//             Sign In with Email
//           </Button>
//         </div>
//       </form>
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t border-slate-300" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-white px-2 text-slate-600">Or continue with</span>
//         </div>
//       </div>
//       {/* Auth Providers */}
//       <section className="grid gap-3">
//         <Button
//           icon={<Icons.gitHub className="mr-2 h-4 w-4" />}
//           type="button"
//           variant="outline"
//           onClick={() => {
//             setIsGitHubLoading(true)
//             setIsLoading(true)
//             signIn("github")
//           }}
//           isLoading={isGitHubLoading}
//           disabled={isLoading}
//         >
//           Github
//         </Button>
//         <Button
//           icon={<Icons.google className="mr-2 h-4 w-4" />}
//           type="button"
//           variant="outline"
//           onClick={() => {
//             setIsGoogleLoading(true)
//             signIn("google")
//           }}
//           isLoading={isGoogleLoading}
//           disabled={isLoading}
//         >
//           Google
//         </Button>
//       </section>
//     </div>
//   )
// }

"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import Button from "./elements/button"
import getFormData from "@/lib/getFormData"
import api from "axios"
import Link from "next/link"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "login" | "register"
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({
  type = "login",
  className,
  ...props
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false)
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [error, setError] = useState(null)
  const [errors2, setErrors] = useState(null)
  const [helper, setHelper] = useState<{
    message: string
    isError: boolean
    href?: string
    field: string
  } | null>(null)
  const [serverErrors, setServerErrors] = useState<any>(new Map())
  const searchParams = useSearchParams()
  const router = useRouter()
  async function onSubmit(e: any) {
    // const signInResult = await signIn("email", {
    //   email: data.email.toLowerCase(),
    //   redirect: false,
    //   callbackUrl: searchParams?.get("from") || "/dashboard",
    // })
    // return toast({
    //   title: "Check your email",
    //   description:
    //     "We sent you a login link. Be sure to check your spam too.",
    // })
    e.preventDefault()
    const formData = getFormData(e.target)
    // set latest user email
    localStorage.setItem("email", formData?.email || formData?.username || "")

    try {
      setIsEmailLoading(true)
      const {
        data: { message },
      } = await api.post(`api/v1/auth/${type}`, formData)

      toast({
        title: `${message}`,
      })

      // router.push("/dashboard")
    } catch (error) {
      // this is a helper
      const {
        message,
        error: { issues },
        code,
      } = error.response.data

      const errorsMap = new Map(
        issues.map(({ path, ...rest }) => [path[0], rest])
      )
      console.log(
        "🚀 ~ file: user-auth-form.tsx:253 ~ onSubmit ~ errorsMap:",
        errorsMap
      )

      setServerErrors(errorsMap)

      // console.log(errorMap, " errorMap")
      // go to login page if use exists
      if (code === 1 || code === 2) {
        const goTo = code === 1 ? "login" : code === 2 ? "register" : ""
        // @ts-ignore
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

      return toast({
        title: message,
        variant: "destructive",
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  useEffect(() => {
    // Set a timeout to clear the error and helper message
    const timeout = setTimeout(() => {
      // Clear the error and helper message
      setHelper(null)
    }, 20000)

    // Return a cleanup function to clear the timeout
    return () => clearTimeout(timeout)
  }, [error, helper])

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            {type === "login" ? (
              <>
                <Input
                  id="username"
                  placeholder="Enter email or username"
                  type="text"
                  autoComplete="email"
                  disabled={isLoading}
                  required
                  autoFocus
                  {...register("username")}
                />
                {errors?.username && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.username.message}
                  </p>
                )}
                {serverErrors.get("email") && (
                  <p className={"px-1 text-xs text-red-600"}>
                    {serverErrors.get("email").message}
                  </p>
                )}
              </>
            ) : (
              <>
                <Input
                  id="email"
                  placeholder="Enter email or username"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  required
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
            )}
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
              id="password"
              placeholder="Enter your password"
              type="password"
              autoComplete="password"
              autoCorrect="off"
              required={true}
              disabled={isLoading}
              {...register("password")}
            />
            {serverErrors.get("password") && (
              <p className={"px-1 text-xs text-red-600"}>
                {serverErrors.get("password").message}
              </p>
            )}
            {type === "register" && errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
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
            {type === "register" ? "Register" : "Login"} with Email
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
          icon={<Icons.gitHub className="mr-2 h-4 w-4" />}
          type="button"
          variant="outline"
          onClick={() => {
            setIsGitHubLoading(true)
            setIsLoading(true)
            signIn("github")
          }}
          isLoading={isGitHubLoading}
          disabled={isLoading}
        >
          Github
        </Button>
        <Button
          icon={<Icons.google className="mr-2 h-4 w-4" />}
          type="button"
          variant="outline"
          onClick={() => {
            setIsGoogleLoading(true)
            signIn("google")
          }}
          isLoading={isGoogleLoading}
          disabled={isLoading}
        >
          Google
        </Button>
      </section>
    </div>
  )
}
