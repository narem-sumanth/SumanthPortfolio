"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/** Flat button: told apart by fill, a hairline border, and (filled variants) a soft shadow that deepens on hover. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " +
    "cursor-pointer transition duration-300 ease-out select-none disabled:cursor-not-allowed disabled:opacity-45 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-base",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground shadow-button not-disabled:hover:bg-accent/90 not-disabled:hover:shadow-floating not-disabled:active:bg-accent/80",
        secondary:
          "bg-elevated text-foreground shadow-button not-disabled:hover:border-border-strong not-disabled:hover:shadow-floating not-disabled:active:bg-inset",
        ghost: "text-foreground-muted not-disabled:hover:bg-elevated not-disabled:hover:text-foreground",
        outline: "text-foreground not-disabled:hover:bg-elevated not-disabled:active:bg-inset",
        danger:
          "bg-danger text-white shadow-button not-disabled:hover:bg-danger/90 not-disabled:hover:shadow-floating not-disabled:active:bg-danger/80",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "ghost", ...props }, ref) => (
    <Button ref={ref} variant={variant} size="icon" className={cn("rounded-full", className)} {...props} />
  ),
);
IconButton.displayName = "IconButton";
