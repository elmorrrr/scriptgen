import * as z from "zod"

function validatePassword(password: string) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return regex.test(password)
}

export const userAuthSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string(),
})

export const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot be longer than 50 characters.")
    .refine(
      validatePassword,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    ),
})

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})
