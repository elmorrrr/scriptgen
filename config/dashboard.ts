import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Admin",
      href: "/admin/dashboard",
    },
    {
      title: "About",
      href: "/about",
      disabled: true,
    },
    {
      title: "Contact",
      href: "/contact",
      disabled: true,
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "General",
      href: "/dashboard",
      icon: "user",
    },
    {
      title: "My generated scripts",
      href: "/dashboard/scripts",
      icon: "code",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}

export const adminDashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Admin",
      href: "/admin/dashboard",
    },
    {
      title: "About",
      href: "/about",
      disabled: true,
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: "settings",
    },
    {
      title: "Clients Generated scripts",
      href: "/admin/dashboard/scripts",
      icon: "code",
    },
  ],
}
