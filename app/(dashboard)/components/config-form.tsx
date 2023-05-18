"use client"
import { Input, Button } from "@components"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { configSchema, Config } from "@/validation/zod/config-schema"

import api from "@/lib/axios"
import fields from "../shared-props/fields"
import { Icons } from "@/components/icons"

export default function Form() {
  const resolver = configSchema
    ? {
        resolver: zodResolver(configSchema),
      }
    : {}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>(resolver)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const modalRef = useRef(null)

  const handleSubmitForm = async (data: FormData) => {
    try {
      setIsLoading(true)
      const response = await api.post("/config", data)
      const { message, result } = response.data
      toast({ title: message })
      modalRef?.current.close()
      router.push("/dashboard/scripts")
    } catch (error) {
      toast({ title: error.response.data.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        icon={<Icons.code />}
        width="200px"
        onClick={() => modalRef.current.showModal()}
      >
        Generate Script
      </Button>
      <dialog ref={modalRef}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          method="dialog"
          className="grid gap-2"
        >
          <div className="mb-4 flex flex-col space-y-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <h1 className="text-2xl font-semibold tracking-tight">
              Fiber Script Generation Request
            </h1>
          </div>
          <div className="grid gap-2">
            {fields.map((field) => {
              if (field.type === "select") {
                return (
                  <>
                    {field.label && (
                      <label htmlFor={field.name}>{field.label}</label>
                    )}
                    <select
                      className="w-full
                       rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset
                       ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                      id={field.name}
                      {...register(field.name)}
                    >
                      {field.options.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors[field.name] && (
                      <p className="px-1 text-xs text-red-600">
                        {errors[field.name].message}
                      </p>
                    )}
                  </>
                )
              }
              return (
                <div className="grid gap-1">
                  <Input
                    // maxWidth="inherit"
                    {...field}
                    disabled={isLoading}
                    {...register(field.name)}
                  />
                  {errors[field.name] && (
                    <p className="px-1 text-xs text-red-600">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => modalRef.current.close()}
            >
              Cancel
            </Button>
            <Button isLoading={isLoading} disabled={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </dialog>
    </>
  )
}
