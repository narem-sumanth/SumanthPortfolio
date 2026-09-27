import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface ActivityStep {
  label: string;
  status: "pending" | "active" | "done";
}

/**
 * Renders the real, in-progress pipeline steps of a chat turn (see
 * apps/api/src/services/chat/chat-pipeline.service.ts) — never a fake "Thinking..." spinner.
 */
export function ActivityIndicator({ steps, className }: { steps: ActivityStep[]; className?: string }) {
  if (steps.length === 0) return null;
  return (
    <ul className={cn("flex flex-col gap-1.5", className)}>
      {steps.map((step) => (
        <li key={step.label} className="flex items-center gap-2 text-xs text-foreground-muted">
          <span
            className={cn(
              "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
              step.status === "done" && "border-success/40 bg-success/15 text-success",
              step.status === "active" && "border-accent/50 bg-accent-soft text-accent",
              step.status === "pending" && "border-border bg-inset",
            )}
          >
            {step.status === "done" ? (
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            ) : (
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-current",
                  step.status === "active" && "animate-pulse-dot",
                )}
              />
            )}
          </span>
          <span className={cn(step.status === "active" && "text-foreground")}>{step.label}</span>
        </li>
      ))}
    </ul>
  );
}
