import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {    variants: {      variant: {
        default:
          "bg-[hsl(205_100%_50%)] text-white font-medium shadow-blue hover:bg-[hsl(205_100%_45%)] hover:shadow-blue dark:bg-[hsl(205_100%_50%)] dark:text-white",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-[hsl(205_100%_50%)] text-[hsl(205_100%_50%)] hover:bg-[hsl(205_100%_50%)] hover:text-white shadow-xs hover:shadow-blue dark:border-[hsl(205_100%_50%)] dark:text-[hsl(205_100%_50%)] dark:hover:text-white",        secondary:
          "bg-[hsl(220_100%_45%)] text-white shadow-xs hover:bg-[hsl(220_100%_40%)] hover:shadow-neon dark:bg-[hsl(220_100%_50%)] dark:text-white",
        accent:
          "bg-coaching-accent text-white shadow-xs hover:bg-coaching-accent/90 hover:shadow-pink dark:text-white",
        ghost:
          "text-[hsl(205_100%_50%)] hover:bg-[hsl(205_100%_95%)] hover:text-[hsl(205_100%_40%)] dark:hover:bg-[hsl(205_100%_20%)]",
        link: "text-[hsl(205_100%_50%)] underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-[hsl(205_100%_50%)] to-[hsl(220_100%_45%)] text-white font-medium shadow-blue hover:shadow-blue/80 dark:text-white",
        neon:
          "bg-[hsl(205_100%_50%)] text-white shadow-blue hover:shadow-blue animate-glow border border-[hsl(205_100%_50%)/30] dark:text-white",
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
