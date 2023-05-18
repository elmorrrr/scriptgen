"use client"
import { useState } from "react"
import {
  AuthRequiredError,
  BadRequestError,
  PermissionDeniedError,
  DatabaseError,
} from "@/lib/exceptions"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FaUser, FaGlobe, FaCog } from "react-icons/fa"
import { IoIosRocket } from "react-icons/io"
const Lab = () => {
  const [state, setState] = useState("")

  if (state) {
    if (state === "AuthRequiredError") {
      throw new AuthRequiredError()
    }

    if (state === "BadRequestError") {
      throw new BadRequestError()
    }

    if (state === "PermissionDeniedError") {
      throw new PermissionDeniedError()
    }

    if (state === "DatabaseError") {
      throw new DatabaseError()
    }
  }

  const handle = (e) => {
    const v = e.target.innerHTML
    setState(v)
  }

  const router = useRouter()

  const handleNavigateToPage = (page) => {
    router.push(page)
  }

  const renderTestErrorButton = (error) => {
    return (
      <button
        className={styles.errorButton}
        onClick={() => handleTestError(error)}
      >
        Test {error} Error
      </button>
    )
  }

  const renderPageLink = (page, title) => {
    return (
      <li>
        <Link href={page}>{title}</Link>
      </li>
    )
  }

  return (
    <>
      <section className="container grid justify-center gap-6 py-8 md:py-12 lg:py-20">
        <div className="mx-auto flex flex-col gap-4 md:max-w-[60rem]">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
            Lab
          </h2>
          <p className="max-w-[85%] leading-normal text-slate-700 sm:text-lg sm:leading-7">
            This project is an experiment to see how a modern app, with features
            like auth, subscriptions, API routes, and static pages would work in
            Next.js 13 app dir. This lab contains all component examples for
            testing and showcase.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">All App Routes</h2>
          <ul className="list-outside pl-8">
            <li>
              <span className="font-bold">Routes</span>
              <ul className="list-disc pl-4">
                {renderPageLink("/", "Home")}
                {renderPageLink("/welcome", "Welcome")}
                {renderPageLink("/docs", "Documentation")}
                {renderPageLink("/search?q=elon", "Search page")}
                {renderPageLink("/lab/non-existent-page", "Not Found")}
              </ul>
            </li>
            <li className="mt-8">
              <span className="font-bold">User Routes</span>
              <ul className="list-disc pl-4">
                {renderPageLink("/users", "Users")}
                {renderPageLink("/users/64330a6c4e69ba207cf63a11", "User page")}
                {renderPageLink("/users/add", "Add User")}
              </ul>
            </li>
            <li className="mt-8">
              <span className="font-bold">Auth Routes</span>
              <ul className="list-disc pl-4">
                {renderPageLink("/register", "Register")}
                {renderPageLink("/login", "Login")}
              </ul>
            </li>
            <li className="mt-8">
              <span className="font-bold">Marketing Routes</span>
              <ul className="list-disc pl-4">
                {renderPageLink("/about", "About")}
                {renderPageLink("/blog", "Blog")}
                {renderPageLink("/contact", "Contact")}
              </ul>
            </li>
            <li className="mt-8">
              <span className="font-bold">Dashboard Routes</span>
              <ul className="list-disc pl-4">
                {renderPageLink("/dashboard", "Dashboard")}
                {renderPageLink("/dashboard/analytics", "Analytics")}
                {renderPageLink("/dashboard/settings", "Settings")}
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold">Test Errors</h2>
          <ul className="list-disc pl-8">
            <li
              className="text-primary mb-2 cursor-pointer"
              onClick={() => handleNavigateToPage("/lab/non-existent-page")}
            >
              Test Not Found Error
            </li>
            <li className="mb-2 cursor-pointer text-red-500" onClick={handle}>
              AuthRequiredError
            </li>
            <li className="mb-2 cursor-pointer text-red-500" onClick={handle}>
              BadRequestError
            </li>
            <li className="mb-2 cursor-pointer text-red-700" onClick={handle}>
              PermissionDeniedError
            </li>
            <li className="mb-2 cursor-pointer text-red-700" onClick={handle}>
              DatabaseError
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}

export default Lab
