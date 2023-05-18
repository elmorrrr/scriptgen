import { User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/icons"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

type SiteConfig = {
  name: string
  title: string
  description: string
  type: string
  url: string
  logo: string
  technologies: string[]
  keywords: string[]
  creator: string
  publisher: string
  authors: { name: string; url: string }[]
  category: string
  locale: string
  theme_color: { media: string; color: string }[]
  color_scheme: string
  ogImage: string
  links: { twitter: string; github: string }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }

import React from "react"

export type Color =
  | "primary"
  | "secondary"
  | "tiffany"
  | "purple"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "muted"
  | "light"
  | "gradient"
  | "dark"

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "full"
export type Radius = Size | "none"
export type Font = "thin" | "regular" | "heavy"
export type Role = "admin" | "user"
export type Shape = "square" | "rectangle" | "circle"

export interface Circle {
  shape: "circle"
  radius: number
}

export interface Square {
  shape: "square"
  width: number
}

export interface Rectangle {
  shape: "rectangle"
  width: number
  height: number
}

export type Drawer = {
  nama: string
} & (Circle | Square | Rectangle)

export interface User {
  id?: string | number
  name: {
    firstName: string
    lastName: string
    displayName: string
    username: string
  }
  password: string
  email: string
  avatar: string
  uri?: string
  type?: string
  role: Role
  location: object
  popularity?: number
  adress?: {
    city: string
    country: string
    street: string
    zipcode: number
  }
}

export interface Component {
  id?: string | number
  title: string
  description: string
  avatar: string
  uri?: string
  type?: string
  style?: React.CSSProperties
  height?: string | number
  width?: string | number
  radius?: Radius
  bg?: string
  text?: string
  fontSize?: string | number
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  href?: string
  loading?: boolean
  disabled?: boolean
  className?: string
}
