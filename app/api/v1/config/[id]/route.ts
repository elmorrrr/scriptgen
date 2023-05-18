import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { getSession } from "@/lib/session"

export async function DELETE(req: Request, { params }) {
  try {
    const session = await getSession()
    if (!session || session?.user.role !== "ADMIN") throw new Error("Unauth")
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          message: "Please provide id for deletion",
        },
        { status: 400 }
      )
    }

    await db.config.delete({
      where: { id },
    })
    return NextResponse.json({
      message: "Script deleted successfully",
    })
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error.flatten(),
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { message: error.message, error: error },
        { status: 500 }
      )
    }
  }
}
