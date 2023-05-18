"use client"

import api from "@/lib/axios"
// import db from "@/lib/db"
import formatInternetSpeed from "@/helpers/formatInternetSpeed"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Script = {
  id: string
  service: string
  speed: number
  script: string
  serial_number: string
  email: string
  name: string
  created_at: string
  status: "pending" | "processing" | "success" | "failed"
  payment_status: string
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { downloadScript, copyScriptToClipboard } from "@/helpers/script"
import { Button } from "@/components"
import { MoreHorizontal } from "lucide-react"

export const columns: ColumnDef<Script>[] = [
  {
    accessorKey: "serial_number",
    header: "Serial number",
  },
  {
    accessorKey: "name",
    header: "Client name",
  },
  {
    accessorKey: "email",
    header: "Client email",
    cell: ({ row }) => {
      return (
        <a href={`mailto:${row.original.email}`} title="Click to send email">
          {row.original.email.slice(0, 15)}
        </a>
      )
    },
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  // {
  //   accessorKey: "service",
  //   header: "Type",
  // },
  {
    accessorKey: "speed",
    header: "Speed",
    cell: ({ row }) => formatInternetSpeed(row.original.speed),
  },
  {
    accessorKey: "status",
    header: "Validation",
    cell: ({ row }) => {
      const badgeClasses = `inline-block rounded-full px-2 text-xs font-semibold ${
        row.original.status === "validated"
          ? "text-green-800"
          : row.original.status === "pending"
          ? "text-gray-800"
          : "text-red-800"
      }`
      return (
        <select
          defaultValue={row.original.status}
          className={`${badgeClasses} focus:shadow-outline center block w-full appearance-none rounded border border-gray-400 bg-white p-2 leading-tight shadow hover:border-gray-500 focus:outline-none`}
          onChange={async (e) => {
            const newStatus = e.target.value
            const id = row.original.id
            try {
              await api.patch("/config", {
                id,
                status: newStatus,
              })
              return toast({ title: "Status updated" })
            } catch (error) {
              return toast({ title: "Something wrong", variant: "destructive" })
            }
          }}
        >
          <option value="pending">Pending</option>
          <option value="validated">Validated</option>
          <option value="rejected">Rejected</option>
        </select>
      )
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment",
    cell: ({ row }) => (
      <span
        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
          row.original.payment_status === "completed"
            ? "bg-green-200 text-green-800"
            : row.original.payment_status === "pending"
            ? "bg-yellow-200 text-yellow-800"
            : row.original.payment_status === "canceled"
            ? "bg-red-200 text-red-800"
            : "bg-gray-200 text-red-800"
        }`}
      >
        {row.original.payment_status}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button icon={<MoreHorizontal />} variant="outline" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              const script_page = "/admin/dashboard/scripts/" + row.original.id
              window.location.href = script_page
            }}
          >
            View script details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              downloadScript(row.original.script)
            }}
          >
            Download script
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              copyScriptToClipboard(row.original.script)
            }}
          >
            Copy script text
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={async () => {
              const id = row.original.id
              // Show a confirmation dialog to the user
              const result = confirm(
                "Are you sure you want to delete this record?"
              )

              if (result) {
                // If the user confirms, send a request to the server to delete the record
                try {
                  // await api.delete("/config", {
                  //   data: {
                  //     id,
                  //   },
                  // })

                  await api.delete(`/config/${id}`)
                  return toast({ title: "Script deleted" })
                } catch (error) {
                  return toast({
                    title: "Something wrong",
                    variant: "destructive",
                  })
                }
              } else {
                // If the user cancels, do nothing
                console.log("Delete operation canceled.")
              }
            }}
          >
            Remove script
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              copyScriptToClipboard(row.original.serial_number)
            }}
          >
            Copy serial number
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // window.location.href = "/admin/dashboard/users/" + row.original.id
            }}
          >
            View customer
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              var emailAddress = row.original.email
              var emailUrl = "mailto:" + encodeURIComponent(emailAddress)
              window.location.href = emailUrl
            }}
          >
            Send email
          </DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
