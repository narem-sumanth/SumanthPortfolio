"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import type { ExperienceEntry } from "@portfolio/types";
import { formatDateRange } from "../lib/format";
import { CONTAINER, DISPLAY_FACE, EASE_OUT, SECTION_SPACE, TEXT_BODY, TEXT_HEADING, TEXT_LEAD } from "../lib/type-scale";
import { Reveal } from "./reveal";
import { SplitWords } from "./split-words";

function Role({ entry, open, onToggle }: { entry: ExperienceEntry; open: boolean; onToggle: () => void }) {
  const reduceMotion = useReducedMotion();
  const panelId = `${entry.id}-details`;

  const toggleIcon = (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-out ${
        open ? "rotate-45 bg-accent text-accent-foreground" : "bg-base text-foreground"
      }`}
      aria-hidden="true"
    >
      <Plus className="h-5 w-5" />
    </span>
  );

  return (
    <div className={`rounded-3xl transition-colors duration-300 ${open ? "bg-raised" : "bg-elevated hover:bg-raised"}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full flex-col gap-4 px-6 py-7 text-left md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-9"
        >
          {/* Mobile: the toggle sits beside the company name, the usual accordion position —
              md:contents unwraps this row at desktop, where the toggle rejoins the meta block below
              instead (its own hidden/visible pair keeps only one instance on screen at a time). */}
          <div className="flex w-full items-start justify-between gap-3 md:contents">
            {/* Below md the name scales with the viewport: one long word ("Entrepreneurship") at the
                full heading size is wider than a phone card and would run under the toggle.
                From md up it takes the page's regular heading size (TEXT_HEADING, written out so
                Tailwind sees the md: variant). */}
            <span
              className={`min-w-0 ${DISPLAY_FACE} text-[clamp(1.5rem,7.5vw,2.5rem)] md:text-[clamp(2.5rem,1.4rem+4.6vw,5.5rem)] text-foreground transition-transform duration-500 ease-out group-hover:translate-x-3`}
            >
              {entry.company}
            </span>
            <span className="shrink-0 md:hidden">{toggleIcon}</span>
          </div>
          <span className={`flex shrink-0 items-center gap-6 ${TEXT_BODY}`}>
            <span className="flex flex-col md:items-end">
              <span className="font-semibold text-foreground">{entry.title}</span>
              <span className="tabular-nums text-foreground-muted">
                {formatDateRange(entry.startDate, entry.endDate)}
              </span>
            </span>
            <span className="ml-auto hidden md:block">{toggleIcon}</span>
          </span>
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-label={`${entry.company} details`}
        aria-hidden={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 px-6 pb-9 md:px-10 md:pb-12 lg:grid-cols-12">
          <p className={`${TEXT_LEAD} font-medium leading-[1.3] text-foreground lg:col-span-5`}>{entry.summary}</p>
          <div className="lg:col-span-7">
            <ul className={`flex flex-col gap-3 ${TEXT_BODY} text-foreground`}>
              {entry.highlights.map((highlight) => (
                <li key={highlight} className="flex items-baseline gap-3">
                  <span className="h-2 w-2 shrink-0 translate-y-[-1px] bg-accent" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
            {entry.technologies.length > 0 && (
              <p className={`mt-8 ${TEXT_BODY} text-foreground-muted`}>{entry.technologies.join(", ")}</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  // The current role starts open; the rest wait for a click.
  const [openId, setOpenId] = React.useState<string | null>(experience[0]?.id ?? null);

  if (experience.length === 0) return null;

  return (
    <section id="experience" data-field="white" className={`w-full bg-base text-foreground ${SECTION_SPACE}`}>
      <div className={CONTAINER}>
        <SplitWords lines={["Where it shipped."]} className={`${DISPLAY_FACE} ${TEXT_HEADING} text-foreground`} />

        <ul className="mt-14 flex flex-col gap-3">
          {experience.map((entry, i) => (
            <Reveal key={entry.id} as="li" delay={Math.min(i * 0.08, 0.3)}>
              <Role
                entry={entry}
                open={openId === entry.id}
                onToggle={() => setOpenId((current) => (current === entry.id ? null : entry.id))}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
