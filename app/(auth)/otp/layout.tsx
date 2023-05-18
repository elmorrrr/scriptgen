"use client"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import { Button } from "@components"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children, params }: AuthLayoutProps) {
  console.log(params, "params")
  const r = useRouter()
  return (
    <div className="min-h-screen">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Button
          iconPosition="left"
          icon={<Icons.chevronLeft className="mr-2 h-4 w-4" />}
          onClick={() => r.back()}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8"
          )}
          variant="ghost"
        >
          Back
        </Button>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
          {children}
        </div>
      </div>
    </div>
  )
}
