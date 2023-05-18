import { NextApiRequest, NextApiResponse } from "next"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import nextConnect from "next-connect"

const acceptedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]

cloudinary.config({
  cloud_name: "dsnmvf1en",
  api_key: "914143952628354",
  api_secret: "lLyqDtxJ1G9sxCZ58AbxwAxruxY",
})

const upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 2, // limit files to 2MB
  },
}).single("image")

async function handler(req: NextApiRequest, res: NextApiResponse) {
  //@ts-ignore
  const file = req.file
  console.log("🚀 ~ file: image.ts:25 ~ handler ~ file:", file)

  try {
    if (!file) {
      return res.status(400).json({
        error: `Please include file`,
      })
    }

    if (!acceptedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: `Invalid file type only type accepted is images: ${acceptedTypes.toString()}`,
      })
    }

    const uploadResult = await cloudinary.uploader.upload(file.path)
    return res.status(200).json({
      success: true,
      msg: "File uploaded",
      image: uploadResult.secure_url,
    })
  } catch (err) {
    console.log("🚀 ~ file: app.ts:157 ~ err:", err)
    return res.status(400).json({
      message: err.message,
      error: err,
    })
  }
}

export default handler
