import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import db from "@/lib/db"
import { notFound } from "next/navigation"
import formatInternetSpeed from "@/helpers/formatInternetSpeed"
import Editor from "./editor"
import moment from "moment"

type Props = {
  params: {
    id: string
  }
}

export default async function Script({ params }: Props) {
  const getScript = await db.config.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!getScript) {
    return notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Script details"
        text={`Script serial number is: ${
          getScript?.serial_number
        } created by ${getScript?.name} ${moment(
          getScript.created_at
        ).fromNow()}
        `}
      />
      <div className="grid gap-4">
        <ul>
          <li>
            <strong>ID:</strong> {getScript.id}
          </li>
          <li>
            <strong>Serial N:</strong> {getScript.serial_number}
          </li>
          <li>
            <strong>Name:</strong> {getScript.name}
          </li>
          <li>
            <strong>Email:</strong> {getScript.email}
          </li>
          <li>
            <strong>CIN:</strong> {getScript.cin}
          </li>
          <li>
            <strong>Address:</strong> {getScript.address}
          </li>
          <li>
            <strong>Phone:</strong> {getScript.phone}
          </li>
          <li>
            <strong>Provider:</strong> {getScript.provider}
          </li>
          <li>
            <strong>Service:</strong> {getScript.service}
          </li>
          <li>
            <strong>Speed:</strong> {formatInternetSpeed(getScript.speed)} (
            {getScript.speed})
          </li>
          <li>
            <strong>Payment status:</strong> {getScript.payment_status}
          </li>
          <li>
            <strong>Validate status:</strong> {getScript.status}
          </li>
          <li>
            <strong>Created at:</strong>{" "}
            {new Date(getScript.created_at).toLocaleString()}
          </li>
        </ul>

        <Editor script={getScript.script} />
      </div>
    </DashboardShell>
  )
}
