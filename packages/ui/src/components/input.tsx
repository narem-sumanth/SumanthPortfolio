import * as React from "react";
import { cn } from "../lib/cn";

/** Flat control: a filled well told apart by fill and border, not a shadow. */
const inputBase =
  "w-full rounded-md border border-border bg-inset px-3 py-2 text-sm text-foreground " +
  "placeholder:text-foreground-subtle transition-colors duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(inputBase, className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(inputBase, "min-h-[96px] resize-y", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
