"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { Button, Input } from "@/components"
import { Icons } from "@/components/icons"
import { getCurrentUser } from "@/lib/session"
import getFormData from "@/lib/getFormData"
import api from "@/lib/axios"
import updateUserAvatar from "@/lib/updateUserAvatar"
import PhoneInput from "react-phone-input-2"
import fields from "./fields"
import "react-phone-input-2/lib/style.css"

// interface FormData extends z.infer<typeof phoneSchema> {
//   current_password?: string
//   new_password?: string
// }

interface UserFormProps {
  user: User
  position: [number, number]
  title: string
  subtitle?: string
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  error?: string
  type?: string
  defaultValue?: any
  required?: boolean
  autoComplete?: string
}

interface FormValues {
  current_password: string
  new_password: string
}

interface ApiError {
  response: {
    data: {
      msg: string
      error?: any
    }
  }
}

const passwordProps = {
  type: "password",
  autoComplete: "off",
  required: true,
  minLength: 8,
  maxLength: 50,
  // pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", // fixed pattern
  error:
    "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number.",
}

const getValue = (obj: Record<string, any>, key: string) => {
  if (!key) return
  try {
    let newKey: string | string[]
    newKey = key.includes(".") ? key.split(".") : key
    if (typeof newKey === "string")
      return newKey === "birthdate" ? obj[newKey].split("T")[0] : obj[newKey]
    return obj[newKey[0]] && obj[newKey[0]][newKey[1]]
  } catch (error) {
    console.error(error)
  }
}

//create function named Update User Avatar 2 handle input and valiate sizer file is here file type store image in cloudinary and return sucess or error make image prev

export default function CategoryForm({
  user,
  position,
  title,
  subtitle,
}: UserFormProps) {
  const [phone, setPhone] = useState<string | null>(null)
  const [isEnabledEditPassword, setIsEnabledEditPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarFilePreview, setAvatarFilePreview] = useState<string | null>(
    null
  )

  const router = useRouter()

  const reset = () => {
    setIsLoading(false)
    setIsEnabledEditPassword(false)
    setAvatarFile(null)
    setAvatarFilePreview(null)
  }

  const handleFileChange = (e) => {
    const currentFie = e.target.files[0]
    setAvatarFile(currentFie)
    setAvatarFilePreview(currentFie ? URL.createObjectURL(currentFie) : null)
  }

  useEffect(() => {
    if (user) {
      setPhone(user?.phone)
    }
  }, [user])

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formValues = getFormData(e.currentTarget) as any
    if (isEnabledEditPassword) {
      const { current_password, new_password } = formValues

      if (!current_password || !new_password) {
        return toast({
          title: "Please provide old and new password",
          variant: "destructive",
        })
      }
    }

    try {
      setIsLoading(true)
      if (avatarFile) {
        await updateUserAvatar(avatarFile, user.id)
      }

      const {
        data: { msg },
      } = await api.patch(`/users/${user.id}`, {
        ...formValues,
        phone,
      })

      toast({
        title: msg,
      })

      reset()
      router.refresh()
    } catch (err: any) {
      toast({
        title: err?.response?.data?.msg || "An error occurred",
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

            {avatarFilePreview && (
              <img width="100" height="100" src={avatarFilePreview} />
            )}

            <Input
              onChange={handleFileChange}
              disabled={isLoading}
              // name="avatar"
              type="file"
              accept="image/*"
            />

            <div className="password-container">
              <span
                className="edit-password"
                onClick={() => setIsEnabledEditPassword((prev) => !prev)}
              >
                {user.password === null && !isEnabledEditPassword
                  ? "Set password"
                  : !isEnabledEditPassword
                  ? "Change password"
                  : "Done changing 👌"}
              </span>
            </div>
            {isEnabledEditPassword ? (
              <>
                <Input
                  name="current_password"
                  label="Current password"
                  placeholder="Enter current password"
                  disabled={isLoading}
                  {...passwordProps}
                />
                <Input
                  name="new_password"
                  label="New password"
                  placeholder="Enter new password"
                  disabled={isLoading}
                  {...passwordProps}
                />
              </>
            ) : (
              <Input
                label="Password"
                defaultValue={isEnabledEditPassword ? "" : "*".repeat(12)}
                disabled={true}
              />
            )}
            <PhoneInput
              value={phone}
              onChange={(phoneValue) => setPhone(phoneValue)}
              country="tn"
              placeholder="+216 54466551"
            />
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
