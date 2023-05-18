import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import UserCategoryForm from "./CategoryForm"
import ContactInfo from "./contactInfo"

import MyComponent from "./Client"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function SettingsPage() {
  // Get the current user
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />

      <div className="forms">
        {user && (
          <>
            <UserCategoryForm
              title="Basisc info"
              subtitle="Some info may be visible to other people."
              user={user}
              position={[0, 4]}
            />
            <ContactInfo title="Contact info" user={user} position={[4, 6]} />
            <UserCategoryForm
              title="Addresses"
              subtitle="Your home and work addresses are used to personalize your experiences. Only you can see these addresses."
              user={user}
              position={[6, 10]}
            />
            <UserCategoryForm
              title="Others info"
              user={user}
              position={[10, 14]}
            />
          </>
        )}
      </div>
    </DashboardShell>
  )
}
