"use client"

import React from "react"
import { Form } from "@components"
import { userLoginSchema } from "@/validation/zod"

const fields = [
  {
    name: "username",
    type: "text",
    required: true,
    placeholder: "Enter your username",
    label: "Username",
  },
  { name: "password", type: "password", placeholder: "Enter your password" },
]

function handleSubmit(data, end, method) {
  // Handle form submission
  console.log("Form submitted:", data, end, method)
}

function App() {
  return (
    <div>
      <h1>Login</h1>
      <Form
        name="loginForm"
        title="Login"
        description="Please enter your credentials"
        // maxWidth={400}
        fields={fields}
        method="POST"
        schema={userLoginSchema}
        endpoint="/auth/login"
        // as="modal"
        // onSubmit={handleSubmit}
      />
    </div>
  )
}

export default App
