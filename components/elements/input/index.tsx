"use client"
import * as React from "react"
import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string
  label?: string
  title?: string
  error?: string
  mode?: "icon" | "checkbox"
}

interface RadioGroupProps {
  options: { label: string; value: string }[]
  defaultValue?: string
}

function RadioGroupDemo({ options, defaultValue, ...rest }: RadioGroupProps) {
  return (
    <RadioGroup {...rest} defaultValue={defaultValue}>
      {options.map(({ label, value }) => (
        <div key={value} className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={value} {...rest} />
          <Label htmlFor={value}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}

interface SelectProps {
  options: { label: string; value: string }[]
  placeholder?: string
  defaultValue?: string
}

const SelectDemo = React.forwardRef(
  ({ options, placeholder, defaultValue, ...props }: SelectProps, ref) => {
    return (
      <Select {...props} defaultValue={defaultValue} ref={ref}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent {...props}>
          {options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

const InputPro = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, title, type, text, error, mode, maxWidth, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputComponent =
      type === "textarea" ? (
        <Textarea title={title || text} ref={ref} {...props} />
      ) : type === "radio" ? (
        <RadioGroupDemo ref={ref} {...props} />
      ) : type === "checkbox" ? (
        <Checkbox {...props} />
      ) : type === "select" ? (
        <SelectDemo {...props} ref={ref} />
      ) : (
        <>
          <Input
            type={type === "password" && showPassword === true ? "text" : type}
            title={title || text || error}
            className={className}
            ref={ref}
            {...props}
          />
          {type === "password" && (
            <div
              style={{
                userSelect: "none",
              }}
              className="relative flex gap-2 text-sm"
            >
              {mode === "checkbox" ? (
                <>
                  <input
                    type="checkbox"
                    id="show_password"
                    name="show_password"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label htmlFor="show_password">Show password</label>
                </>
              ) : (
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "-42px",
                    padding: "10px",
                  }}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </div>
              )}
            </div>
          )}
        </>
      )

    return (
      <div
        style={{
          maxWidth: "inherit",
        }}
        className={`grid w-full items-center gap-1.5`}
      >
        {label && <Label htmlFor={props.id}>{label}</Label>}
        {inputComponent}
        {error && <p className="error-msg">{error}</p>}
        {text && <p className="text-sm text-slate-500">{text}</p>}
      </div>
    )
  }
)

InputPro.displayName = "InputPro"
export default InputPro
