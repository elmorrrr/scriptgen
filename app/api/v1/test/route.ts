
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  redirect("http://localhost:3000/")
}

