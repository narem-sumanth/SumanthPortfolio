"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import type { Project } from "@portfolio/types";
import { track } from "@/features/shell";
import { ProjectGlyph } from "../lib/project-glyphs";
import { CONTAINER, DISPLAY_FACE, SECTION_SPACE, TEXT_BODY, TEXT_HEADING, TEXT_LEAD } from "../lib/type-scale";
import { Magnetic } from "./magnetic";
import { SplitWords } from "./split-words";

/** Panels alternate green and white, so the stack reads as separate sheets. */
const PANEL_FIELDS = [undefined, "white"] as const;

function ProjectLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Magnetic strength={0.2}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        onClick={onClick}
        className={`group flex items-center gap-2 rounded-full bg-accent px-5 py-3 ${TEXT_BODY} font-semibold text-accent-foreground`}
      >
        {label}
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </a>
    </Magnetic>
  );
}

function ProjectPanel({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  // As later panels slide over, earlier ones settle back a step — a real stack, driven by scroll.
  const settled = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [index / total, 1], [1, settled]);
  const field = PANEL_FIELDS[index % PANEL_FIELDS.length];
  const stars = project.githubMeta?.stars ?? 0;

  return (
    // Sticky only from md up: on a phone the panels are taller than the screen and simply scroll.
    <li className="md:sticky" style={{ top: `calc(5.5rem + ${index * 1.5}rem)` }}>
      <motion.article
        data-field={field}
        style={reduceMotion ? undefined : { scale }}
        className={`grid origin-top grid-cols-1 overflow-hidden rounded-3xl text-foreground md:min-h-[min(34rem,68vh)] md:grid-cols-12 ${
          field ? "bg-base" : "bg-raised"
        }`}
      >
        <div className="flex flex-col justify-between gap-10 p-6 md:col-span-7 md:p-12">
          <div>
            <h3 className={`${DISPLAY_FACE} ${TEXT_HEADING} text-balance`}>{project.name}</h3>
            <p className={`mt-6 max-w-[58ch] ${TEXT_BODY} leading-relaxed`}>{project.description}</p>
          </div>

          <div>
            <p className={`${TEXT_BODY} text-foreground-muted`}>{project.technologies.join(", ")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.github && (
                <ProjectLink
                  href={project.github}
                  label="Source on GitHub"
                  onClick={() => track("github_clicked", { project: project.id })}
                />
              )}
              {project.live && (
                <ProjectLink
                  href={project.live}
                  label="Live site"
                  onClick={() => track("live_demo_clicked", { project: project.id })}
                />
              )}
              {stars > 0 && (
                <span className={`flex items-center gap-1.5 px-2 ${TEXT_BODY} tabular-nums`}>
                  <Star className="h-4 w-4" aria-hidden="true" />
                  {stars} {stars === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Drawn-in-code glyph of what the project does — there are no honest screenshots to show. */}
        <div className="flex min-h-56 items-center justify-center bg-elevated p-10 md:col-span-5">
          <motion.div
            initial={reduceMotion ? false : { scale: 0.7, rotate: -8, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
          >
            <ProjectGlyph project={project} className="h-40 w-40 text-foreground md:h-64 md:w-64" />
          </motion.div>
        </div>
      </motion.article>
    </li>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const ref = React.useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  if (projects.length === 0) return null;

  return (
    <section id="projects" className={`w-full ${SECTION_SPACE}`}>
      <div className={CONTAINER}>
        <SplitWords lines={["Built in the open."]} className={`${DISPLAY_FACE} ${TEXT_HEADING} text-foreground`} />
        <p className={`mt-6 max-w-[40ch] ${TEXT_LEAD} font-medium leading-[1.3] text-foreground`}>
          Side projects with the source public, this site included.
        </p>

        <ul ref={ref} className="mt-14 flex flex-col gap-6 md:gap-10">
          {projects.map((project, i) => (
            <ProjectPanel
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
