import * as React from "react"

import { Slot } from "radix-ui"

import { cva, type VariantProps }
from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  rounded-xl

  text-sm
  font-medium

  transition-all
  duration-300

  active:scale-[0.98]
  hover:scale-[1.03]

  focus-visible:outline-none
  focus-visible:ring-4
  focus-visible:ring-primary/25

  disabled:pointer-events-none
  disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        default:
          `
          bg-primary
          text-primary-foreground
          shadow-md

          hover:bg-primary/90
          hover:shadow-xl
          `,

        outline:
          `
          border
          border-border
          bg-background

          hover:bg-muted
          `,

        secondary:
          `
          bg-secondary
          text-secondary-foreground

          hover:bg-secondary/80
          `,

        ghost:
          `
          hover:bg-muted
          `,

        destructive:
          `
          bg-destructive
          text-white

          hover:bg-destructive/90
          `,

        link:
          `
          text-primary
          underline-offset-4
          hover:underline
          `,
      },

      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {

  const Comp = asChild
    ? Slot.Root
    : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  )
}

export {
  Button,
  buttonVariants,
}