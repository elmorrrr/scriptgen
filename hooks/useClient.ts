"use client"
import { useState, useEffect } from "react"
import getUserLocation from "@/lib/getUserLocation"

export default function useClient() {
  const [clientData, setClientData] = useState(null)

  useEffect(() => {
    const fetchClientData = async () => {
      const {
        languages,
        language,
        onLine,
        userActivation,
        userAgent,
        userAgentData,
      } = navigator

      const userLocation = await getUserLocation()

      console.log(userLocation)

      const {
        address,
        country,
        currency,
        country_code,
        ip,
        flag,
        emoji_flag,
        emoji_unicode,
        geo,
      } = userLocation

      setClientData({
        languages,
        country_code,
        address,
        ip,
        emoji_flag,
        flag,
        emoji_unicode,
        geo,
        currency,
        country,
        language,
        userAgent,
        isOnline: onLine,
        isMobile: userAgentData?.mobile,
        platform: userAgentData?.platform,
        isActive: userActivation?.isActive,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    }

    fetchClientData()
  }, [])

  return clientData
}
