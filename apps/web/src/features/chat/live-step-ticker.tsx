"use client";

import * as React from "react";
import type { ActivityStep } from "@portfolio/ui";

/**
 * Single-line status ticker content (no border/background of its own - it's
 * meant to sit inside a StepsDisclosure's collapsed summary). Always shows
 * the most recent real step the backend has actually reported - it advances
 * only when a new status event arrives, never on a timer, so it can't cycle
 * back through steps that already finished (which would misread as the
 * pipeline going backward or stalling).
 */
export function LiveStepTicker({ steps }: { steps: ActivityStep[] }) {
  const current = steps[steps.length - 1];
  if (!current) return null;

  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-dot" />
      <span key={steps.length} className="animate-slide-up truncate">
        {current.label}
      </span>
    </span>
  );
}
