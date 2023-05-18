"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { User as NextAuthUser } from "next-auth"

interface User extends NextAuthUser {
  role: string
}

import { siteConfig } from "@/config/site"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email" | "role">
}

const menuItems = [
  { href: "/dashboard", label: "General" },
  { href: "/dashboard/scripts", label: "My generated scripts" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
]

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name!, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            {/* <p className="text-sm">@{user.username}</p> */}
            <p className="w-[200px] truncate text-sm text-slate-600">
              {user.email}
            </p>
            <p className="w-[200px] truncate text-sm text-slate-600">
              {user.role === "ADMIN" ? (
                <span className="rounded-md bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                  Admin
                </span>
              ) : (
                <span className="rounded-md bg-green-500 px-2 py-1 text-xs font-bold text-white">
                  {user.role}
                </span>
              )}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
