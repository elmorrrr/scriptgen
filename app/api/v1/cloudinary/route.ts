// import cloudinary from "@/lib/cloudinary"

import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: "dsnmvf1en",
  api_key: "914143952628354",
  api_secret: "lLyqDtxJ1G9sxCZ58AbxwAxruxY",
})

const uploadOptions = {
  folder: "users/avatars", // optional folder name to upload the file to
  public_id: "your_file_public_id", // optional public_id to use for the file
  resource_type: "image", // automatically detect the file type
}

export const POST = async (req: Request, res: Response) => {
  //   const form = new FormData()
  //   const blob = new Blob(["text"], { type: "text/plain" })
  //   console.log(blob)
  //ml_default
  const formData = await req.formData()

  cloudinary.uploader
    .upload("./public/images/hero.png", uploadOptions)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  return new Response("Hello")
}
