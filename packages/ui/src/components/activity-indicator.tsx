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
    <ul className={cn("flex flex-col gap-2", className)}>
      {steps.map((step) => (
        <li
          key={step.label}
          className={cn(
            "flex items-center gap-2.5 text-xs transition-colors",
            step.status === "active" ? "text-foreground" : "text-foreground-subtle",
          )}
        >
          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            {step.status === "done" ? (
              <Check className="h-3 w-3" strokeWidth={2.5} />
            ) : step.status === "active" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
            )}
          </span>
          <span>{step.label}</span>
        </li>
      ))}
    </ul>
  );
}
