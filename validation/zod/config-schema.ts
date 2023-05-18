import { z } from "zod"
import formatInternetSpeed from "@/helpers/formatInternetSpeed"

// an array containing predefined speed values in bits per second (bps).
const speedValues = [
  512000, // 512 Kbps
  1024000, // 1 Mbps
  2048000, // 2 Mbps
  5120000, // 5 Mbps
  10240000, // 10 Mbps
  20480000, // 20 Mbps
  51200000, // 50 Mbps
  102400000, // 100 Mbps
  204800000, // 200 Mbps
]

export const options = [
  { label: "--Débit--", value: "" },
  ...speedValues.map((speed) => ({
    label: formatInternetSpeed(speed),
    value: speed,
  })),
]

export const configSchema = z.object({
  name: z
    .string({
      required_error: "Please enter your name",
    })
    .min(3, { message: "Name must be at least 3 characters" }),
  cin: z
    .string({
      required_error: "Please enter your CIN",
    })
    .regex(/^\d{8}$/, { message: "CIN must be 8 digits" }),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address cannot exceed 100 characters")
    .refine(
      (value) => {
        const lowerCaseValue = value.toLowerCase()
        // Check if the address contains repeated characters
        return !/(.)\1\1\1/.test(lowerCaseValue)
      },
      {
        message: "Address cannot have repeated characters",
      }
    ),
  // .refine(
  //   (value) => {
  //     const lowerCaseValue = value.toLowerCase();
  //     // Check if the address contains repeated characters
  //     const hasRepeatedChars = /(.).*\1/.test(lowerCaseValue);
  //     // Check if the address contains repeated characters greater than 3
  //     const hasRepeatedCharsGreaterThan3 = /(.).*\1\1\1/.test(lowerCaseValue);
  //     // Check if the address contains only alphanumeric characters and spaces
  //     const isValidFormat = /^[a-zA-Z0-9\s]+$/.test(value);

  //     return !hasRepeatedChars && !hasRepeatedCharsGreaterThan3 && isValidFormat;
  //   },
  //   {
  //     message: "Invalid address. Please check the format and characters used.",
  //   }
  // ),
  provider: z.enum(["globalnet", "topnet", "hexabyte"], {
    errorMap: (issue, ctx) => ({
      message: "Please select a provider",
    }),
  }),
  phone: z
    .string()
    .min(8, "Phone number must be 8 digits or more")
    .max(12)
    .optional(),
  speed: z.enum(
    speedValues.map((s) => String(s)),
    {
      errorMap: (issue, ctx) => ({ message: "Please select a speed value" }),
    }
  ),
  service: z.enum(["HSI", "VoIP"], {
    errorMap: (issue, ctx) => ({
      message: "Please select a service type HSI or VoIP.",
    }),
  }),
  serial_number: z
    .string()
    .regex(/^[\dA-Fa-f]{16}$/, {
      message: "Serial number must be 16 hexadecimal digits",
    })
    .optional(),
  status: z.enum(["pending", "validated", "rejected"]).optional(),
  payment_status: z
    .enum(["pending", "completed", "failed", "cancelled", "refunded"])
    .optional(),
})

export type Config = z.infer<typeof configSchema>
