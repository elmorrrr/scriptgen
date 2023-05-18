import React, { ButtonHTMLAttributes } from "react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
  className?: string
  variant?:
    | "outline"
    | "default"
    | "destructive"
    | "subtle"
    | "ghost"
    | "success"
    | "link"
  icon?: any
  styles?: any
  disabled?: boolean
  size?: string
  iconPosition?: "left" | "right"
  width?: string | number
}

const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  className,
  variant = "default",
  size = "default",
  icon,
  children,
  styles,
  disabled,
  width,
  iconPosition = "right",
  ...rest
}) => {
  const classesStyles = cn(
    buttonVariants({
      variant,
      size,
    })
  )

  const customStyles = {
    ...styles,
    cursor: isLoading ? "progress" : disabled ? "disabled" : "pointer",
    display: "flex",
    gap: "7px",
    width: width || undefined,
    // pointerEvents: isLoading && "auto",
  }

  const renderIcon = () => {
    if (isLoading) {
      return <Icons.spinner className="h-4 w-4 animate-spin" />
    }

    return icon
  }

  return (
    <button
      className={cn(className, classesStyles)}
      disabled={disabled || isLoading}
      style={customStyles}
      {...rest}
    >
      {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
      {iconPosition === "left" && !isLoading && icon}
      {children}
      {iconPosition === "right" && !isLoading && icon}
    </button>
  )
}

export default Button
