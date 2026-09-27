"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { ActivityIndicator, cn, type ActivityStep } from "@portfolio/ui";

export interface StepsDisclosureProps {
  steps: ActivityStep[];
  /** The always-visible collapsed summary (a static "Worked through N steps", or a live ticker). */
  label: React.ReactNode;
}

/**
 * A collapsed step summary - no border or background while just sitting
 * there - that only gains a border and a subtle background once the visitor
 * clicks it open to reveal the full step checklist.
 */
export function StepsDisclosure({ steps, label }: StepsDisclosureProps) {
  const [expanded, setExpanded] = React.useState(false);
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-fit cursor-pointer items-center gap-1.5 text-xs text-foreground-subtle transition-colors hover:text-foreground"
      >
        {label}
        <ChevronRight className={cn("h-3 w-3 shrink-0 transition-transform", expanded && "rotate-90")} />
      </button>
      {expanded && (
        <div className="rounded-lg border border-border/70 bg-inset px-4 py-3">
          <ActivityIndicator steps={steps} />
        </div>
      )}
    </div>
  );
}
