import * as React from "react";
import type { ExperienceEntry } from "@portfolio/types";
import { cn } from "../lib/cn";
import { Panel } from "./card";
import { Badge } from "./badge";

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatRange(startDate: string, endDate?: string | null) {
  return `${formatMonth(startDate)} – ${endDate ? formatMonth(endDate) : "Present"}`;
}

export interface ExperienceTimelineProps {
  entries: ExperienceEntry[];
  className?: string;
  /**
   * Denser, border-free rows meant to sit inside a chat message bubble
   * (bg-elevated) rather than as a standalone page section (bg-base) —
   * the hole-punch dot ring color and highlight/tech counts are trimmed
   * to match that context.
   */
  compact?: boolean;
}

export function ExperienceTimeline({ entries, className, compact }: ExperienceTimelineProps) {
  if (entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  if (compact) {
    return (
      <ol className={cn("relative flex flex-col gap-6 border-l border-border pl-4", className)}>
        {sorted.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              className="absolute -left-4.25 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-elevated bg-accent ring-4 ring-accent/25"
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <h4 className="text-sm font-semibold text-foreground">
                {entry.title} <span className="font-normal text-foreground-muted">· {entry.company}</span>
              </h4>
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">
                {formatRange(entry.startDate, entry.endDate)}
              </span>
            </div>

            <p className="mt-1 text-sm text-foreground-muted">{entry.summary}</p>

            {entry.highlights.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1 list-disc pl-5 marker:text-foreground-subtle">
                {entry.highlights.slice(0, 3).map((point) => (
                  <li key={point} className="text-[14px] text-foreground-muted">
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {entry.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {entry.technologies.slice(0, 6).map((tech) => (
                  <Badge key={tech} variant="default" className="px-1.5 py-0 text-[10px]">
                    {tech}
                  </Badge>
                ))}
                {entry.technologies.length > 6 && (
                  <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                    +{entry.technologies.length - 6}
                  </Badge>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={cn("relative flex flex-col gap-8 border-l border-border pl-6 sm:pl-8", className)}>
      {sorted.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            className="absolute -left-7.75 top-1.5 h-3 w-3 rounded-full border-2 border-base bg-accent sm:-left-9.75"
            aria-hidden
          />
          <Panel surface="raised" padding="md" className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{entry.title}</h4>
                <p className="text-sm text-foreground-muted">
                  {entry.company}
                  {entry.location ? ` · ${entry.location}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-foreground-subtle">
                {formatRange(entry.startDate, entry.endDate)}
              </span>
            </div>

            <p className="text-sm text-foreground-muted">{entry.summary}</p>

            {entry.highlights.length > 0 && (
              <ul className="flex flex-col gap-1.5 list-disc pl-5 marker:text-foreground-subtle">
                {entry.highlights.map((point) => (
                  <li key={point} className="text-[14px] text-foreground-muted">
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {entry.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entry.technologies.map((tech) => (
                  <Badge key={tech} variant="default">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </Panel>
        </li>
      ))}
    </ol>
  );
}
