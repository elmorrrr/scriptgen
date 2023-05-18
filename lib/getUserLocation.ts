export default function getUserLocation() {
  const url = `https://api.ipdata.co/?api-key=${process.env.NEXT_PUBLIC_IPDATA_APY_KEY}`

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const { city, region, country_code, country_name, latitude, longitude } =
        data
      const addressParts = [city, region, country_name].filter(Boolean)
      const full_address = addressParts.join(", ")
      const location = {
        ...data,
        address: {
          name: full_address,
          country: country_name,
          city,
          region,
        },
        geo: {
          latitude,
          longitude,
        },
        country: {
          name: country_name,
          code: {
            alpha2: country_code.alpha2,
            alpha3: country_code.alpha3,
            numeric: country_code.numeric,
          },
        },
      }
      return location
    })
}
