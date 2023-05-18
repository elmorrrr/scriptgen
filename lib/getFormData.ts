/**
 * Parses form data and returns it as a JSON object, FormData object or URL-encoded string.
 * @param form - The HTML form element to parse.
 * @param returnType - The type of data to return. Default is "json".
 * @param nullValues - Specifies how null or empty values should be handled. Default is "remove".
 * @returns The form data as a JSON object, FormData object or URL-encoded string, depending on the returnType parameter.
 */

type returnTypeProps = "json" | "object" | "string" | "formdata"
type nullValuesProps = "remove" | "keep" | "null" | "undefined" | "empty"

export const getFormData = (
  form: HTMLFormElement,
  returnType: returnTypeProps = "object",
  nullValues: nullValuesProps = "remove"
): Record<string, unknown> | FormData | string => {
  const formData = new FormData(form)
  const formValues: Record<string, any> = {}

  for (let [key, value] of formData) {
    // @ts-ignore
    if (value === null || value === undefined || /^\s*$/.test(value)) {
      if (nullValues === "remove") {
        continue
      } else if (nullValues === "null") {
        // @ts-ignore
        value = null
      } else if (nullValues === "undefined") {
        // @ts-ignore
        value = undefined
      } else if (nullValues === "empty") {
        value = ""
      }
    } else if (typeof value === "string") {
      value = value.trim()
    }

    const element = form.elements.namedItem(key) as HTMLInputElement | null

    if (element?.type === "tel") {
      // @ts-ignore
      formValues[key] = value.replace(/[- .]/g, "")
    } else if (element?.type === "checkbox") {
      formValues[key] = element.checked
    } else if (element?.type === "date") {
      formValues[key] = new Date(value.toString())
    } else if (
      element?.type === "number" &&
      element?.getAttribute("as") !== "string"
    ) {
      formValues[key] = Number(value)
    } else if (key.includes(".")) {
      // handle nested properties
      const keys = key.split(".")
      let obj = formValues
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i]
        obj[currentKey] = obj[currentKey] || {}
        obj = obj[currentKey]
      }
      obj[keys[keys.length - 1]] = value
    } else if (
      key.endsWith("[]")
      // ||
      // (element && element?.getAttribute("multiple") !== null)
    ) {
      // err element?.getAttribute("multiple") !== null
      // handle multi-select options
      const newKey = key.endsWith("[]") ? key.slice(0, -2) : key
      formValues[newKey] = formValues[newKey] || []
      formValues[newKey].push(value)
    } else {
      formValues[key] = value
    }
  }

  for (const [key, file] of formData.entries()) {
    if (file instanceof File) {
      formData.set(key, file, file.name)
    }
  }

  if (returnType === "json") {
    return JSON.parse(JSON.stringify(formValues))
  } else if (returnType === "string") {
    return Object.entries(formValues)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")
  } else if (returnType === "object") {
    return formValues
  } else {
    return formData
  }
}

// export const submitFormData = async (
//   form: HTMLFormElement,
//   endpoint: string,
//   nullValues: nullValuesProps = "remove"
// ) => {
//   const json = JSON.stringify(getFormData(form, "json", nullValues))

//   try {
//     const response = await fetch(endpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: json,
//     })

//     const { ok, statusText, status, url } = response

//     const data = await response.json()
//     return {
//       ...data,
//       ok,
//       status,
//       info: status + " " + statusText,
//       url,
//       isError: !ok,
//     }
//   } catch (error: any) {
//     console.error(error)
//     return { msg: error.message, error }
//   }
// }

export const submitFormData = async (
  form: HTMLFormElement,
  endpoint: string,
  nullValues: nullValuesProps = "remove"
) => {
  const formData = new FormData()

  // Append each form field to the FormData object
  const formValues = getFormData(form, "object", nullValues)
  Object.keys(formValues).forEach((key) => {
    const value = formValues[key]

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item))
    } else {
      formData.append(key, value)
    }
  })

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    const { ok, statusText, status, url } = response

    const data = await response.json()
    return {
      ...data,
      ok,
      status,
      info: status + " " + statusText,
      url,
      isError: !ok,
    }
  } catch (error: any) {
    console.error(error)
    return { msg: error.message, error }
  }
}

export default getFormData
