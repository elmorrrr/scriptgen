"use client"
import useClient from "@/hooks/useClient"

export default function MyComponent() {
  const clientData = useClient()

  if (!clientData) return null

  return (
    <div>
      <p>IP Address: {clientData.ip}</p>
      <p>Languages: {clientData.languages.join(", ")}</p>
      <p>Country: {clientData.country.name}</p>
      <p>Country Code: {clientData.country_code}</p>
      <p>
        Flag: <img src={clientData.flag} alt="Country Flag" />
      </p>
      <p>Emoji Flag: {clientData.emoji_flag}</p>
      <p>Latitude: {clientData.geo.latitude}</p>
      <p>Longitude: {clientData.geo.longitude}</p>
      <p>
        Currency: {clientData.currency.name} ({clientData.currency.code})
      </p>
      <p>Language: {clientData.language}</p>
      <p>User Agent: {clientData.userAgent}</p>
      <p>Is Online: {clientData.isOnline ? "Yes" : "No"}</p>
      <p>Is Mobile: {clientData.isMobile ? "Yes" : "No"}</p>
      <p>Platform: {clientData.platform}</p>
      <p>Is Active: {clientData.isActive ? "Yes" : "No"}</p>
      <p>Timezone: {clientData.timezone}</p>
    </div>
  )
}
