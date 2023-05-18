export default function getCredential(provider: string): {
  id: string
  secret: string
} {
  if (!provider) {
    throw new Error("PROVIDER NOT FOUND")
  }
  provider = provider.trim().toLocaleUpperCase()
  const id = process.env[`${provider}_CLIENT_ID`]
  const secret = process.env[`${provider}_CLIENT_SECRET`]

  if (!id || id.length === 0) {
    throw new Error(`Missing ${provider}_CLIENT_ID`)
  }
  if (!secret || secret.length === 0) {
    throw new Error(`Missing ${provider}_CLIENT_SECRET`)
  }

  return { id, secret }
}
