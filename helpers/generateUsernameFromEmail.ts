import { validateUsername } from "@/utils/validation"

export default function generateUsernameFromEmail(email: string): string {
  // Remove everything after the @ symbol
  const username = email.split("@")[0]

  // Replace all non-alphanumeric characters with underscores
  const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, "_")

  // Ensure username meets validation criteria
  let generatedUsername = sanitizedUsername.slice(0, 20)
  let suffix = 1
  while (
    !validateUsername(generatedUsername).valid ||
    generatedUsername.length < 4
  ) {
    generatedUsername =
      sanitizedUsername.slice(0, 20 - suffix.toString().length) +
      suffix.toString()
    suffix++
  }

  return generatedUsername
}
