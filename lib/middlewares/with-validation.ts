import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { z, ZodError } from "zod"
import type { ZodSchema } from "zod"
import { NextResponse } from "next/server"

// export function withValidation<T extends ZodSchema>(
//   schema: T,
//   handler: NextApiHandler
// ) {
//   return async function (req: NextApiRequest, res: NextApiResponse) {
//     try {
//       const body = req.body ? req.body : {}

//       await schema.parse(body)

//       return handler(req, res)
//     } catch (error) {
//       if (error instanceof ZodError) {
//         console.log("🚀 ~ file: with-validation.ts:18 ~ error:", error)
//       }
//     }
//   }
// }

export function withValidation<T extends ZodSchema>(
  handler: NextApiHandler,
  schema: T
) {
  return async (request: Request, response: NextApiResponse) => {
    try {
      schema.parse(await request.json())
      await handler(request, response)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            message: error.errors[0].message,
            error: error,
          },
          { status: 422 }
        )
      }
      if (error instanceof "PrismaError") {
        return NextResponse.json(
          {
            message: "Prisma",
            error: error,
          },
          { status: 422 }
        )
      } else {
        return NextResponse.json(
          {
            message: "Something went wrong",
            error: error,
          },
          { status: 500 }
        )
      }
    }
  }
}
