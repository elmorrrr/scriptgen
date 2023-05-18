"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userNameSchema } from "@/lib/validations/user"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import getFormData from "@/lib/getFormData"
import { Button, Input } from "@/components"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import axios from "axios"
import fields from "./fields"
import { User } from "@prisma/client"

import PhoneInput from "react-phone-input-2"
import "./form.css"
import "react-phone-input-2/lib/style.css"

const getValue = (obj, key) => {
  if (!key) return
  try {
    key = key.includes(".") ? key.split(".") : key
    if (typeof key === "string")
      return key === "birthdate" ? obj[key].split("T")[0] : obj[key]
    return obj[key[0]] && obj[key[0]][key[1]]
  } catch (error) {
    console.log(error)
  }
}

interface UserFormProps {
  user: User
  position: [number, number]
  title: string
  subtitle?: string
}

type FormData = z.infer<typeof userNameSchema>

export default function CategoryForm({
  user,
  position,
  title,
  subtitle,
}: UserFormProps) {
  const [phone, setPhone] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (user) {
      setPhone(user?.phone)
    }
  }, [user])

  const submitForm = async (e: any) => {
    e.preventDefault()
    const formValues = getFormData(e.currentTarget)

    try {
      setIsLoading(true)
      const res = await axios.patch(`/api/v2/users/${user.id}`, {
        ...formValues,
        phone,
      })

      if (!res.status === 200) {
        return toast({
          title: "Something went wrong.",
          description: "Your name was not updated. Please try again.",
          variant: "destructive",
        })
      }
      toast({
        title: "User updated successfully.",
      })
      router.refresh()
      return
    } catch (err) {
      return toast({
        title: err.response.data.msg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return

  return (
    <form onSubmit={submitForm}>
      <Card>
        <Card.Header>
          <Card.Title>{title}</Card.Title>
          {subtitle && <Card.Description>{subtitle}</Card.Description>}
        </Card.Header>
        <Card.Content>
          <div className="card-inputs">
            {fields.slice(...position).map((input) => {
              return (
                <Input
                  disabled={isLoading}
                  defaultValue={getValue(user, input.name)}
                  {...input}
                />
              )
            })}
          </div>
        </Card.Content>
        <Card.Footer>
          <Button type="submit" isLoading={isLoading}>
            Save {title?.toLocaleLowerCase()}
          </Button>
        </Card.Footer>
      </Card>
    </form>
  )
}
