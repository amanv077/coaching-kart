import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, variant, ...props }: React.ComponentProps<"div"> & { 
  variant?: "default" | "premium" | "gradient"
}) {
  const baseStyles = "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6";
  
  const variantStyles = {
    default: "shadow-sm hover:shadow-md transition-all duration-300",
    premium: "border-[hsl(205_100%_85%)] shadow-[0_4px_12px_-2px_hsl(205_100%_50%/0.15)] hover:shadow-[0_8px_20px_-4px_hsl(205_100%_50%/0.25)] transition-all duration-300 hover:border-[hsl(205_100%_70%)]",
    gradient: "bg-gradient-to-br from-[hsl(205_100%_98%)] to-[hsl(220_100%_96%)] dark:from-[hsl(205_100%_20%)] dark:to-[hsl(220_100%_15%)] border-[hsl(205_100%_80%)] dark:border-[hsl(205_100%_30%)]",
  };
  
  return (
    <div
      data-slot="card"
      className={cn(
        baseStyles,
        variant && variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
