import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import UserRegisterForm from "@/components/user-register-form"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      {/* <Image src="images/network.jpg" width={300} height={300} /> */}

      <div className="hidden h-screen opacity-100 lg:block">
        <img
          src="./images/n2.jpg"
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </div>
      {/* <div className="hidden h-full bg-slate-100 lg:block" /> */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your email below to create your account
            </p>
          </div>
          <UserRegisterForm />
          <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/forget-password"
              className="hover:text-brand underline underline-offset-4"
            >
              Forget password?
            </Link>
          </p>
          <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/login"
              className="hover:text-brand underline underline-offset-4"
            >
              You have an account? Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
