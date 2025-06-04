import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(205_100%_50%)] text-white [a&]:hover:bg-[hsl(205_100%_45%)]",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-input text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground dark:text-foreground dark:border-muted",
        premium:
          "border border-[hsl(205_100%_85%)] bg-[hsl(205_100%_98%)] text-[hsl(205_100%_40%)] dark:bg-[hsl(205_100%_20%)] dark:text-[hsl(205_100%_80%)] dark:border-[hsl(205_100%_30%)] shadow-sm",
        verified:
          "border-transparent bg-[hsl(205_100%_90%)] text-[hsl(205_100%_40%)] dark:bg-[hsl(205_100%_20%)] dark:text-[hsl(205_100%_80%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
