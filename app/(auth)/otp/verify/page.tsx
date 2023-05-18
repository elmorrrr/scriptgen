import getSession from "@/lib/session"
import { redirect } from "next/navigation"
import VerifyToken from "./verify-code"

type Props = {}

export default async function Page({}: Props) {
  const session = await getSession()

  if (!session || !session?.user) {
    redirect("/login")
  }

  return (
    <div className="center grid h-screen w-full place-items-center">
      <VerifyToken user_id={session.user.id} />
    </div>
  )
}
