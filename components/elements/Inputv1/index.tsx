"use client"
import { useState, useEffect, useRef } from "react"
import {
  nameValidations,
  emailValidations,
  passwordValidations,
} from "../../../validations/inputs"
import styles from "./input.module.scss"

interface inputProps {
  name: string
  type?: string
  title?: string
  placeholder?: string
  errMsg?: string
  label?: string
  value?: string | number
  onChange?: any
  autoFocus?: boolean
  required?: boolean
  focused?: any
}

const Input = ({
  name,
  type = name,
  label,
  value,
  onChange,
  placeholder,
  errMsg,
  ...input
}: inputProps) => {
  const [focused, setFocused] = useState(false)
  const [inputValidations, setInputValidations] = useState<any | null>({})
  const [values, setValues] = useState<any | null>({})

  const clientRef = useRef()
  const errRef = useRef()

  // @set Input Validations
  useEffect(() => {
    // @set Input Error Message
    switch (name) {
      case "name":
        return setInputValidations(nameValidations)
      case "email":
        return setInputValidations(emailValidations)
      case "password":
        return setInputValidations(passwordValidations)
      default:
        return
    }
  }, [name, focused])

  // @set focus When component Load
  useEffect(() => {
    // clientRef?.current?.focus()
  }, [type])

  return (
    <div className={styles.input_container}>
      {label && <label htmlFor={name}>{label}</label>}
      {name === "search" && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      )}
      <input
        className={styles.input}
        name={name}
        type={type || name}
        placeholder={placeholder || `Enter ${name}...`}
        onChange={onChange}
        onFocus={() => setFocused(false)}
        onBlur={() => setFocused(true)}
        focused={focused.toString()}
        {...inputValidations}
        {...input}
      />
      <span className={styles.error_message}>
        {errMsg || inputValidations.errMsg}
      </span>
    </div>
  )
}

export default Input
