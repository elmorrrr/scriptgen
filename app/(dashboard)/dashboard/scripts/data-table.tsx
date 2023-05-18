"use client"
import React from "react"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components"
import { downloadScript, copyScriptToClipboard } from "@/helpers/old-script"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import Link from "next/link"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
  })

  const l_script = data.at(1)

  return (
    <div className="rounded-md border">
      {/* {data.length && l_script ? (
        <Card>
          <Card.Header>
            <Card.Title>
              Your latest latest script serial number: {l_script.serial_number}{" "}
              generated at {new Date(l_script.created_at).toDateString()}
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4 pb-6 text-sm">
            <div className="flex gap-2">
              <Button
                variant="outline"
                icon={<Icons.copy />}
                onClick={() => copyScriptToClipboard(l_script.script)}
              >
                Copy as text
              </Button>
              <Button
                variant="outline"
                icon={<Icons.download />}
                onClick={() => downloadScript(l_script.script)}
              >
                Download as text
              </Button>
            </div>
          </Card.Content>
        </Card>
      ) : undefined} */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
