"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import type { ExperienceEntry, Project } from "@portfolio/types";
import { formatDateRange } from "../lib/format";
import { ProjectGlyph } from "../lib/project-glyphs";
import { TEXT_BODY, TEXT_HEADING, TEXT_SMALL } from "../lib/type-scale";
import { Reveal } from "./reveal";

const KIND_BY_ID: Record<string, string> = {
  "proj-portfolio-ai": "RAG chat system",
  "proj-infant-health-risk": "ML decision support",
  "proj-bird-species": "Audio classifier",
};

function Timeline({ experience }: { experience: ExperienceEntry[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.3 });

  return (
    <div ref={ref} className="relative">
      {/* The track, then the real progress drawn over it as you scroll — not a looping
          decoration. A timeline connector, not a decorative divider. */}
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" aria-hidden="true" /> {/* taste-skill-ignore */}
      <motion.div
        className="absolute left-[5px] top-2 w-px origin-top bg-accent" /* taste-skill-ignore */
        style={{ scaleY, bottom: "0.5rem" }}
        aria-hidden="true"
      />
      <ul className="flex flex-col gap-10">
        {experience.map((entry, i) => (
          <Reveal key={entry.id} as="li" delay={Math.min(i * 0.08, 0.3)} className="relative pl-7">
            <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-accent bg-base" aria-hidden="true" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <span className={`${TEXT_BODY} text-foreground`}>
                {entry.company}, <span className="text-foreground-muted">{entry.title}</span>
              </span>
              <span className={`shrink-0 ${TEXT_SMALL} tabular-nums text-foreground-muted sm:text-right`}>
                {formatDateRange(entry.startDate, entry.endDate)}
              </span>
            </div>
            <p className={`mt-1 max-w-[60ch] ${TEXT_BODY} text-foreground-muted`}>{entry.summary}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function Work({ experience, projects }: { experience: ExperienceEntry[]; projects: Project[] }) {
  const [activeId, setActiveId] = React.useState<string | null>(projects[0]?.id ?? null);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  if (experience.length === 0 && projects.length === 0) return null;

  return (
    <section id="work" className="w-full pb-20 pt-14 md:pb-28 md:pt-16">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-10">
        {experience.length > 0 && (
          <div className="mb-14 md:mb-16">
            <Reveal>
              <h2 className={`mb-10 ${TEXT_HEADING} font-semibold text-foreground`}>Experience</h2>
            </Reveal>
            <Timeline experience={experience} />
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px] md:gap-16">
            <div>
              <Reveal>
                <h2 className={`mb-8 ${TEXT_HEADING} font-semibold text-foreground`}>Shipped</h2>
              </Reveal>
              {/* Separated by space alone, never a divider line. */}
              <ul className="flex flex-col gap-1">
                {projects.map((project, i) => (
                  <Reveal key={project.id} as="li" delay={Math.min(i * 0.06, 0.3)}>
                    <a
                      href={project.live ?? project.github ?? "#"}
                      target="_blank"
                      rel="noreferrer noopener"
                      onMouseEnter={() => setActiveId(project.id)}
                      onFocus={() => setActiveId(project.id)}
                      className="group flex items-baseline justify-between gap-6 py-3.5"
                    >
                      <span className={`${TEXT_BODY} text-foreground transition-colors group-hover:text-accent`}>
                        {project.name}
                        <span className={`ml-3 hidden ${TEXT_SMALL} text-foreground-muted sm:inline`}>
                          {KIND_BY_ID[project.id] ?? project.technologies[0]}
                        </span>
                      </span>
                      <span className={`shrink-0 ${TEXT_SMALL} text-foreground-muted`}>{project.technologies[0]}</span>
                    </a>
                  </Reveal>
                ))}
              </ul>
            </div>

            <Reveal as="div" className="hidden md:block">
              <div className="sticky top-24 aspect-[4/3] w-full rounded-md bg-elevated p-7">
                <AnimatePresence mode="wait">
                  {active && (
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex h-full w-full flex-col justify-between"
                    >
                      <ProjectGlyph project={active} className="h-14 w-14 text-accent" />
                      <p className={`${TEXT_SMALL} leading-relaxed text-foreground-muted`}>{active.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
