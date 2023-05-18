import cloudinary from "@/lib/cloudinary"

const acceptedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
const sizeInMB = 2
const maxSize = 1024 ** 2 * sizeInMB

export const PATCH = async (req: Request, res: Response) => {
  const formData = await req.formData()
  const file = formData.get("avatar")

  //try redireact
  try {
    if (!file) {
      return Response.json(
        {
          error: `Please include file`,
        },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return Response.json(
        {
          error: `File too large max is 2MB`,
        },
        { status: 400 }
      )
    }

    if (!acceptedTypes.includes(file.type)) {
      return Response.json(
        {
          error: `Invalid file type only type accepted is images: ${acceptedTypes.toString()}`,
        },
        { status: 400 }
      )
    }
    // Read the file data as a Buffer
    const fileBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(fileBuffer)
    // Convert the buffer to base64 encoding
    const base64 = buffer.toString("base64")
    const uploadResult = await cloudinary.uploader.upload(formData)
    console.log("🚀 ~ file: route.ts:53 ~ PATCH ~ uploadResult:", uploadResult)
    return Response.json(
      {
        success: true,
        msg: "File uploaded",
        result: uploadResult.secure_url,
      },
      { status: 200 }
    )
  } catch (err) {
    console.log("🚀 ~ file: app.ts:157 ~ err:", err)
    return Response.json(
      {
        msg: err.message,
        error: err,
      },
      { status: 500 }
    )
  }
}
