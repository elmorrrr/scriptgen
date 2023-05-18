"use client"
import { z } from "zod"
import { Input, Button } from "@components"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, forwardRef } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { SelectField } from "./SelectField"
import { redirect as next_redirect } from "next/navigation"

import getFormData from "@/lib/getFormData"
import api from "@/lib/axios"
import Link from "next/link"
import generateScript from "@/helpers/genScript"

interface FieldsProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
}

interface FormProps {
  name?: string
  title?: string
  header?: {
    logo?: any
    title: string
    description?: string
  }
  redirect?: string | boolean
  description?: string
  maxWidth?: string | number
  height?: string | number
  as?: "modal" | "form"
  fields: Array<FieldsProps>
  schema?: z.ZodObject<any>
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  endpoint?: string
  buttonText: string
  onSubmit?: (
    formData: FormData,
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  ) => Promise<void>
}

function Form(
  {
    name,
    title,
    description,
    height,
    fields,
    schema,
    endpoint,
    onSubmit,
    header,
    redirect,
    as = "form",
    maxWidth = "450px",
    buttonText,
    method = "POST",
  },
  ref: FormProps
) {
  const resolver = schema
    ? {
        resolver: zodResolver(schema),
      }
    : {}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>(resolver)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmitForm = async (data: FormData) => {
    console.log("🚀 ~ file: index.tsx:82 ~ handleSubmitForm ~ data:", data)
    // if (onSubmit) {
    //   await onSubmit(data, method, endpoint)
    // }

    if (!endpoint) {
      return
    }

    // try {
    //   setIsLoading(true)
    //   const apiMethod = api[method.toLowerCase()]
    //   const response = await apiMethod(endpoint, data)
    //   const { message, result } = response.data
    //   toast({ title: message })
    //   redirect && router.push(redirect as string)
    // } catch (error) {
    //   toast({ title: error.response.data.message, variant: "destructive" })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const modalRef = useRef()

  const open = () => {
    modalRef && modalRef?.current.showModal()
  }

  const close = () => {
    modalRef && modalRef?.current.close()
  }

  const Form = ({ ...props }) => {
    return (
      <form
        style={{
          maxWidth: maxWidth,
        }}
        method={method}
        action={endpoint}
        onSubmit={handleSubmit(handleSubmitForm)}
        className="grid gap-2"
        {...props}
      >
        <div className="mb-4 flex flex-col space-y-2 text-center">
          {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          )}
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          {fields.map((field) => {
            if (field.type === "select") {
              return (
                <select>
                  {field.options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>
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
        {as === "modal" ? (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              value="cancel"
              // type="reset"
              onClick={close}
              formMethod="dialog"
            >
              Cancel
            </Button>
            <Button isLoading={isLoading} disabled={isLoading}>
              Submit
            </Button>
          </div>
        ) : (
          <Button isLoading={isLoading} disabled={isLoading}>
            Submit
          </Button>
        )}
      </form>
    )
  }

  const FormWrapper = ({ children }) => {
    if (as === "modal") {
      return (
        <>
          <button onClick={open}>Show the dialog</button>
          <dialog style={{ maxWidth }} ref={ref || modalRef}>
            {children}
          </dialog>
        </>
      )
    }
    return children
  }

  return (
    <FormWrapper>
      <>
        {header && (
          <div className="flex flex-col space-y-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            {header.title && (
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
            )}
            {header.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your email or username to sign in to your account
              </p>
            )}
          </div>
        )}
        <form
          style={{
            maxWidth: maxWidth,
          }}
          method={method}
          action={endpoint}
          onSubmit={handleSubmit(handleSubmitForm)}
          className="grid gap-2"
        >
          <div className="mb-4 flex flex-col space-y-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            {fields.map((field) => {
              if (field.type === "select") {
                return (
                  <>
                    {field.label && <label>{field.label}</label>}
                  <select {...field} {...register(field.name)}>
                    {field.options.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
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
          {as === "modal" ? (
            <div className="flex justify-end gap-2">
              {/* <Button
                variant="outline"
                value="cancel"
                onClick={close}
                // formMethod="dialog"
              >
                Cancel
              </Button> */}
              <button value="cancel" formMethod="dialog">Cancel</button>
              <Button
                isLoading={isLoading}
                type="submit"
                formMethod="dialog"
                disabled={isLoading}
              >
                {buttonText || "Submit"}
              </Button>
            </div>
          ) : (
            <Button isLoading={isLoading} disabled={isLoading}>
              {buttonText || "Submit"}
            </Button>
          )}
        </form>
        {/* {footer && (
          <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/register"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Create account
            </Link>
          </p>
        )} */}
      </>
    </FormWrapper>
  )
}

export default forwardRef(Form)
