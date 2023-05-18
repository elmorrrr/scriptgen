import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import db from "@/lib/db"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import ConfigForm from "../../components/config-form"

export const metadata = {
  title: "Scripts",
  description: "Manage Scripts",
}

export default async function BillingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const list = await db.config.findMany({
    where: {
      email: user.email,
    },
    orderBy: {
      created_at: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Generated Scripts History"
        text="View the history of all the scripts that have been generated"
      />
      <ConfigForm />
      <div className="grid gap-10">
        <DataTable columns={columns} data={list} />
      </div>
    </DashboardShell>
  )
}
