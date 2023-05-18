import prisma from "@/lib/prisma"

/**
 * Validates a username according to the following rules:
 * - Must be between 4 and 20 characters long
 * - Can only contain letters, numbers, underscores, and dots
 * - Cannot start or end with an underscore or dot
 * - Cannot contain repeated characters
 *
 * @param {string} username - The username to validate
 * @returns {{valid: boolean, message?: string}} - An object with a boolean indicating whether the username is valid and an optional error message
 */
export function validateUsername(username: string): {
  valid: boolean
  message?: string
} {
  const USERNAME_REGEX = /^(?!.*[_.]{2})[a-zA-Z0-9_.]{4,20}$/

  if (!username) {
    return { valid: false, message: "Username is required" }
  }
  if (username.length < 4 || username.length > 20) {
    return {
      valid: false,
      message: "Username must be between 4 and 20 characters",
    }
  }
  if (!USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      message: "Username contains invalid characters or pattern",
    }
  }
  if (username.startsWith("_") || username.startsWith(".")) {
    return {
      valid: false,
      message: "Username cannot start with underscore or dot",
    }
  }
  if (username.endsWith("_") || username.endsWith(".")) {
    return {
      valid: false,
      message: "Username cannot end with underscore or dot",
    }
  }

  let repeatedChars = 0
  const charMap: { [key: string]: boolean } = {}
  for (let i = 0; i < username.length; i++) {
    const char = username[i]
    if (charMap[char]) {
      repeatedChars++
      if (repeatedChars > 2) {
        return {
          valid: false,
          message: "Username cannot contain more than two repeated characters",
        }
      }
    } else {
      repeatedChars = 0
      charMap[char] = true
    }
  }
  return { valid: true }
}

export async function generateUniqueUsername(username) {
  let newUsername = username
  let counter = 1
  while (await prisma.user.findUnique({ where: { username: newUsername } })) {
    counter++
    newUsername = `${username}${counter}`
  }
  return newUsername
}

const VALID_TLDS = ['com', 'net', 'org', 'edu', 'gov'] // Add more TLDs as needed

export function validateEmail(email: string): {
  valid: boolean
  message?: string
} {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { valid: false, message: "Email is required" }
  }
  if (email.length > 255) {
    return {
      valid: false,
      message: "Email length cannot exceed 255 characters",
    }
  }
  if (!EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      message: "Email format is invalid",
    }
  }
  if (email.startsWith(".") || email.endsWith(".")) {
    return {
      valid: false,
      message: "Email cannot start or end with a dot",
    }
  }
  if (email.indexOf("..") !== -1) {
    return {
      valid: false,
      message: "Email cannot contain consecutive dots",
    }
  }
  const emailParts = email.split("@")
  if (emailParts.length !== 2) {
    return {
      valid: false,
      message: "Email must contain a single @ character",
    }
  }
  const username = emailParts[0]
  const domain = emailParts[1]
  if (username.length < 1 || username.length > 64) {
    return {
      valid: false,
      message: "Email username length must be between 1 and 64 characters",
    }
  }
  if (domain.length < 1 || domain.length > 255) {
    return {
      valid: false,
      message: "Email domain length must be between 1 and 255 characters",
    }
  }
  if (domain.startsWith(".") || domain.endsWith(".")) {
    return {
      valid: false,
      message: "Email domain cannot start or end with a dot",
    }
  }
  if (domain.indexOf("..") !== -1) {
    return {
      valid: false,
      message: "Email domain cannot contain consecutive dots",
    }
  }
  const tld = domain.split('.').pop()?.toLowerCase()
  if (!tld || !VALID_TLDS.includes(tld)) {
    return {
      valid: false,
      message: "Email domain has an invalid TLD",
    }
  }

  return { valid: true }
}
