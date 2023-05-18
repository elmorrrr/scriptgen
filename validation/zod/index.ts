import { object, string, literal, union, z } from "zod"
import { USERNAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX } from "@/validation/regex"

export const passwordSchema = string({
  required_error: "Please enter a password",
  invalid_type_error: "Password must be a string",
})
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(20, { message: "Password must be 20 or fewer characters long" })
  .refine((value) => PASSWORD_REGEX.test(value), {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })

export const emailSchema = z
  .string({
    required_error: "Please enter a email",
    invalid_type_error: "Email must be a text",
  })
  .email({ message: "Please enter a valid email address" })

export const usernameSchema = string({
  required_error: "Please enter a username",
  invalid_type_error: "Username must be a text",
})
  .min(4, {
    message: "Username = must be at least 4 characters long",
  })
  .refine(
    (val) => {
      return USERNAME_REGEX.test(val) && val.length >= 4 && val.length <= 20
    },
    {
      message:
        "Username contains invalid characters or is not between 4 and 20 characters",
    }
  )

export const userRegisterSchema = object({
  email: emailSchema,
  password: passwordSchema,
})

export const userLoginSchema = object({
  username: string({
    required_error: "Please provide your email or username",
    invalid_type_error: "Email or username must be a text",
  })
    .nonempty({ message: "Please provide your email or username" })
    .refine(
      (val) => {
        return val.includes("@")
          ? EMAIL_REGEX.test(val)
          : USERNAME_REGEX.test(val)
      },
      {
        message: "Please provide your email or username",
      }
    ),
  password: string({
    required_error: "Please provide your password",
    invalid_type_error: "Password must be a string",
  }).nonempty({ message: "Please provide your password" }),
}).strict()

export const smsSchema = object({
  phone: string().min(10).max(20),
  method: z.enum(["sms", "call"]),
})

export const resetPasswordSchema = object({
  user_id: string().optional(),
  phone: string().optional(),
  email: string().optional(),
  new_password: passwordSchema,
  confirm_new_password: string(),
}).refine((data) => data.new_password === data.confirm_new_password, {
  path: ["new_password"],
  message: "Password don't match",
})

const selectOption = z.object({
  label: z.string(),
  value: z.string(),
})

export const scriptSchema = z.object({
  name: z.string().nonempty("Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+?[0-9]{8,}$/i, "Please enter a valid phone number"),
  address: z.string().nonempty("Please enter your address"),
  service_type: z.enum(["residential", "business"]).optional(),
  service_speed: z.enum(["100 Mbps", "500 Mbps", "1 Gbps"]).optional(),
  device_type: z.enum(["router", "switch"]).optional(),
  device_model: z.string().nonempty("Please enter your device model"),
  device_firmware_version: z
    .string()
    .nonempty("Please enter your device firmware version"),
  device_ip_address: z
    .string()
    .regex(
      /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i,
      "Please enter a valid IP address"
    ),
  subnet_mask: z
    .string()
    .regex(
      /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i,
      "Please enter a valid subnet mask"
    ),
  default_gateway: z
    .string()
    .regex(
      /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i,
      "Please enter a valid default gateway IP address"
    ),
  dns_server_1: z
    .string()
    .regex(
      /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i,
      "Please enter a valid DNS server 1 IP address"
    ),
  dns_server_2: z
    .string()
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i)
    .optional(),
  dhcp_server_ip_address: z
    .string()
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i)
    .optional(),
  status: z.string().nonempty(),
})

// const selectOptions = z.array(selectOption)

// export const formSchema = z.object({
//   ...fields,
// })

// export const formSchema = z.object({
//   fields,
//   "service-type-options": selectOptions.default([
//     { label: "--Please select--", value: "" },
//     { label: "Residential", value: "Residential" },
//     { label: "Business", value: "Business" },
//   ]),
//   "service-speed-options": selectOptions.default([
//     { label: "--Please select--", value: "" },
//     { label: "100 Mbps", value: "100 Mbps" },
//     { label: "500 Mbps", value: "500 Mbps" },
//     { label: "1 Gbps", value: "1 Gbps" },
//   ]),
//   "device-type-options": selectOptions.default([
//     { label: "--Please select--", value: "" },
//     { label: "Router", value: "Router" },
//     { label: "Switch", value: "Switch" },
//   ]),
// })
