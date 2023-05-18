import { toast } from "@/hooks/use-toast"
import api from "@/lib/axios"
import axios from "axios"

const updateUserAvatar = async (avatarFile: File, user_id: string) => {
  try {
    const fileData = new FormData()
    fileData.append("file", avatarFile)
    fileData.append("upload_preset", "ml_default")
    const { data: imageData } = await axios.post(
      "https://api.cloudinary.com/v1_1/ml_default/image/upload?api_key=914143952628354",
      fileData
    )

    const { data } = await api.patch(`/users/${user_id}`, {
      //   avatar: imageData.secure_url,
      image: imageData.secure_url,
    })
    toast({
      title: "User avatar image updated",
    })
    return data
  } catch (error) {
    console.error(
      "🚀 ~ file: updateUserAvatar.ts:24 ~ updateUserAvatar ~ error:",
      error
    )
    toast({
      title: "Something wrong user image not updated",
      variant: "destructive",
    })
  }
}

export default updateUserAvatar
