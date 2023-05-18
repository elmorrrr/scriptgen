// import cors from 'cors';
// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';

// cloudinary.config({
//   cloud_name: "dsnmvf1en",
//   api_key: "914143952628354",
//   api_secret: "lLyqDtxJ1G9sxCZ58AbxwAxruxY",
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "DEV",
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     files: 1,
//     fileSize: 1024 * 1024 * 2, // limit files to 2MB
//   },
// });

// const handler = async (req, res) => {
//   const acceptedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
//   const file = req.file;

//   try {
//     if (!file) {
//       return res.status(400).json({
//         error: `Please include file`,
//       });
//     }

//     if (!acceptedTypes.includes(file.mimetype)) {
//       return res.status(400).json({
//         error: `Invalid file type only type accepted is images: ${acceptedTypes.toString()}`,
//       });
//     }
//     return res.json({ avatar: req.file.path });
//   } catch (err) {
//     console.log("🚀 ~ file: app.ts:157 ~ err:", err);
//     return res.status(400).json({
//       message: err.message,
//       error: err,
//     });
//   }
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default cors()(upload.single("avatar")(handler));

import { NextApiRequest, NextApiResponse } from "next"

import { withCurrentUser } from "@/lib/api-middlewares/with-current-user"
import { withMethods } from "@/lib/api-middlewares/with-methods"

async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("TEST")
    res.status(200).json({msg :"HEy"})
    
}

export default withMethods(["GET" , "POST"], withCurrentUser(handler))


