import React from "react"
import { Color, Font, Size } from "@/types"

type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"]

type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

type ComponentProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<
    C,
    {
      size?: Size
      color?: Color
      bg?: string
      text?: string
      fontSize?: string | number
      fontWeight?: Font
      radius?: Size | "full"
      variant?: "filed" | "outlined"
      leftIcon?: React.ReactElement
      rightIcon?: React.ReactElement
      href?: string
      target?: string
      loading?: boolean
      disabled?: boolean
      className?: string
    }
  >

type ButtonComponent = <C extends React.ElementType = "button">(
  props: ComponentProps<C>
) => React.ReactElement | null

// eslint-disable-next-line react/display-name
const Button: ButtonComponent = <C extends React.ElementType = "button">({
  as,
  children,
  variant,
  size = "md",
  color = "primary",
  radius = "sm",
  text,
  bg,
  fontSize,
  leftIcon,
  style,
  rightIcon,
  className,
  ...restProps
}: // loading = false,
ComponentProps<C>) => {
  let Component = as || "button"

  const classes = `${
    className +
    ` btn btn-${color}-${size}${
      variant ? "-" + variant : ""
    } br-${radius} rounded-${radius}`
  }`

  const styles = {
    style: {
      backgroundColor: bg,
      color: text,
      fontSize,
      ...style,
    },
  }

  return (
    <Component className={classes} {...restProps} {...styles}>
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
    </Component>
  )
}

export default Button
