import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-coaching-primary text-coaching-background shadow-coaching-button hover:bg-coaching-primary/90 hover:shadow-neon",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-coaching-primary text-coaching-primary hover:bg-coaching-primary hover:text-coaching-background shadow-xs hover:shadow-neon dark:border-coaching-primary dark:text-coaching-primary",
        secondary:
          "bg-coaching-secondary text-white shadow-xs hover:bg-coaching-secondary/90 hover:shadow-blue",
        accent:
          "bg-coaching-accent text-white shadow-xs hover:bg-coaching-accent/90 hover:shadow-pink",
        ghost:
          "text-coaching-primary hover:bg-coaching-primary/10 hover:text-coaching-primary hover:shadow-neon/50",
        link: "text-coaching-primary underline-offset-4 hover:underline",
        gradient:
          "bg-coaching-gradient text-white shadow-coaching-button hover:shadow-neon animate-neon-pulse",
        neon:
          "bg-coaching-primary text-coaching-background shadow-neon hover:shadow-neon animate-glow border border-coaching-primary/30",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
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
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
