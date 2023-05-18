"use client"
import Link from "next/link"
import { Source_Sans_Pro } from "next/font/google"
import { useRouter } from "next/navigation"
import { AiOutlineArrowLeft } from "react-icons/ai"
import { Button } from "@/components"

const sansPro = Source_Sans_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
})

export default function NotFoundCatchAll(params) {
  const router = useRouter()
  return (
    <div className={sansPro.className}>
      <main className="not-found bg">
        <span className="badge">404 error</span>
        <h1 className="title">We&apos;ve lost this page</h1>
        <p className="desc">
          Sorry, the page you are looking for () doesn&apos;t exist or has been
          moved.
        </p>
        <div className="btn-group">
          <Button
            icon={<AiOutlineArrowLeft />}
            color="dark"
            variant="outline"
            size="lg"
            onClick={router.back}
          >
            Go back
          </Button>
          <Link href="/">
            <Button size="lg"> Take me home</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
