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
export default function validateUsername(username: string): {
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
  const charMap: { [key: string]: boolean } = {}
  for (let i = 0; i < username.length; i++) {
    const char = username[i]
    if (charMap[char]) {
      return {
        valid: false,
        message: "Username cannot contain repeated characters",
      }
    }
    charMap[char] = true
  }
  return { valid: true }
}
