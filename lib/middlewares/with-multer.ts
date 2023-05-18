import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import multer from "multer"

export function withMulter(uploadMiddleware: ReturnType<typeof multer>) {}
