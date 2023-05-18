import { notFound } from "next/navigation"

import { dashboardConfig, adminDashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { PermissionDeniedError } from "@/lib/exceptions"
import { getSession } from "@/lib/session"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getSession()

  if (!session || session?.user?.role !== "ADMIN") {
    throw new PermissionDeniedError()
  }

  return (
    <div className="mx-auto flex flex-col space-y-6">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <MainNav items={adminDashboardConfig.mainNav} />
          <UserAccountNav user={session.user} />
        </div>
      </header>
      <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={adminDashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
