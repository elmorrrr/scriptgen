import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Card } from "@/components/ui/card"
import db from "@/lib/db"
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components"
import { Icons } from "@/components/icons"
import Link from "next/link"

export const metadata = {
  title: "Scripts",
  description: "Manage Scripts",
}

export const revalidate = 60

export default async function BillingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const list = await db.config.findMany({
    orderBy: {
      created_at: "desc",
    },
  })

  //TODO: Exports data

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Network Configuration Scripts"
        text="Here, you can view, download, and manage the client scripts."
      />
      <div className="grid gap-10">
        <DataTable columns={columns} data={list} />
      </div>
    </DashboardShell>
  )
}
