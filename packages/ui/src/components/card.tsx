import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const panelVariants = cva("rounded-lg border transition-colors", {
  variants: {
    surface: {
      raised: "bg-elevated border-border",
      elevated: "bg-elevated border-border",
      inset: "bg-inset border-border",
      floating: "bg-floating border-border shadow-floating",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-5",
      lg: "p-8",
    },
  },
  defaultVariants: {
    surface: "raised",
    padding: "md",
  },
});

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof panelVariants> {}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, surface, padding, ...props }, ref) => (
    <div ref={ref} className={cn(panelVariants({ surface, padding }), className)} {...props} />
  ),
);
Panel.displayName = "Panel";

/** Semantic alias — a Card is a Panel used as a discrete content unit. */
export const Card = Panel;
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-3 flex flex-col gap-1", className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-sm font-semibold tracking-tight text-foreground", className)} {...props} />
);
export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-foreground-muted", className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-sm text-foreground-muted", className)} {...props} />
);
export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-4 flex items-center gap-2", className)} {...props} />
);
