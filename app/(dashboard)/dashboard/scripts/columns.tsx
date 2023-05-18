"use client"

import { Button } from "@/components"
import formatInternetSpeed from "@/helpers/formatInternetSpeed"
import { toast } from "@/hooks/use-toast"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  service: string
  speed: string
  serial_number: string
  created_at: string
  status: "pending" | "processing" | "success" | "failed"
  payment_status: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "serial_number",
    header: "Serial number",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "service",
    header: "Service Type",
  },
  {
    accessorKey: "speed",
    header: "Service Speed",
    cell: ({ row }) => formatInternetSpeed(row.original.speed),
  },

  {
    accessorKey: "status",
    header: "Validation Status",
    cell: ({ row }) => (
      <span
        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
          row.original.status === "validated"
            ? "bg-green-200 text-green-800"
            : row.original.status === "pending"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-red-200 text-red-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    accessorKey: "payment_status",
    header: "Payment",
    cell: ({ row }) => {
      const payment_status = row.original.payment_status
      if (payment_status === "pending") {
        return (
          <Button
            onClick={async () => {
              const session = await fetch("/api/stripe/session", {
                method: "POST",
                body: JSON.stringify({
                  script_id: row.original.id,
                }),
              }).then((res) => res.json())

              if (!session?.session_url) {
                return toast({
                  title: "Something went wrong.",
                  description: "Please refresh the page and try again.",
                  variant: "destructive",
                })
              }

              if (session) {
                // toast({ title: "Payed successfully." })
                return (window.location.href = session.session_url)
              }
            }}
          >
            Click to pay
          </Button>
        )
      }
      return (
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
      )
    },
  },
]

// async function onSubmit(event) {
//   event.preventDefault()
//   setIsLoading(!isLoading)

//   // Get a Stripe session URL.
//   const session = await fetch("/api/stripe/session", {
//     method: "POST",
//     body: JSON.stringify({
//       user_id: "user_1234",
//       email: "a@a.com",
//     }),
//   }).then((res) => res.json())

//   if (!session?.session_url) {
//     return toast({
//       title: "Something went wrong.",
//       description: "Please refresh the page and try again.",
//       variant: "destructive",
//     })
//   }

//   // Redirect to the Stripe session.
//   // This could be a checkout page for initial upgrade.
//   // Or portal to manage existing subscription.
//   // const session = await response.json()
//   if (session) {
//     window.location.href = session.session_url
//   }
// }
