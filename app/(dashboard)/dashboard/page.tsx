import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import fields from "../shared-props/fields"
import { Card } from "@/components/ui/card"
import ConfigForm from "../components/config-form"

export const metadata = {
  title: "General",
  description: "Manage..",
}

export default async function GenerateScriptPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  fields.map((f) => {
    if (f.name === "email" || f.name === "name" || f.name === "phone") {
      f.value = user[f.name]
      f.disabled = true
    }
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome ${user.name} to General Page`}
        text="This page provides general information about our services and features."
      />
      <div className="grid gap-10">
        <Card>
          <Card.Header>
            <Card.Title>Script generation</Card.Title>
          </Card.Header>
          <Card.Content className="grid gap-1 space-y-4 pb-6 text-sm">
            <p>
              In order to install and configure your fiber optic service, you
              will need to generate a script based on your contract details.
              Please click the button below to generate your script. Once
              generated, you can follow the instructions in the script to
              complete the installation and configuration process.
            </p>
            <ConfigForm />
          </Card.Content>
        </Card>
      </div>
    </DashboardShell>
  )
}
