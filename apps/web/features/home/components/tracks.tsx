"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Skill } from "@portfolio/types";
import { CONTAINER, DISPLAY_FACE, EASE_OUT, SECTION_SPACE, TEXT_BODY, TEXT_HEADING, TEXT_LEAD } from "../lib/type-scale";
import { Reveal } from "./reveal";
import { SplitWords } from "./split-words";

type Level = NonNullable<Skill["proficiency"]>;

// Size and weight compound into one hierarchy: the deepest experience reads as
// the biggest, boldest words; newer ground sits small and light. All sizes come
// from the page's own five-size scale.
const SIZE: Record<Level, string> = {
  expert: TEXT_HEADING,
  proficient: TEXT_LEAD,
  familiar: TEXT_BODY,
  learning: TEXT_BODY,
};
const WEIGHT: Record<Level, string> = {
  expert: "font-extrabold",
  proficient: "font-semibold",
  familiar: "font-normal",
  learning: "font-normal",
};

/** Skill links run both ways: if Helm lists Kubernetes, Kubernetes lights up Helm too. */
function buildRelations(skills: Skill[]): Map<string, Set<string>> {
  const relations = new Map<string, Set<string>>(skills.map((skill) => [skill.id, new Set<string>()]));
  for (const skill of skills) {
    for (const other of skill.relatedTo ?? []) {
      if (!relations.has(other)) continue;
      relations.get(skill.id)!.add(other);
      relations.get(other)!.add(skill.id);
    }
  }
  return relations;
}

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

const word = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

export function Tracks({ skills }: { skills: Skill[] }) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const relations = React.useMemo(() => buildRelations(skills), [skills]);
  const byId = React.useMemo(() => new Map(skills.map((skill) => [skill.id, skill])), [skills]);

  if (skills.length === 0) return null;

  const active = activeId ? byId.get(activeId) : undefined;
  const related = activeId ? relations.get(activeId) : undefined;

  let caption = "Point at a skill, or tap it, to see what it works alongside.";
  if (active) {
    const names = [...(related ?? [])].map((id) => byId.get(id)?.name).filter(Boolean);
    caption =
      names.length > 0
        ? `${active.name} works alongside ${names.join(", ")}.`
        : `${active.name} runs underneath everything else here.`;
  }

  function toneFor(skill: Skill): string {
    if (!activeId) return "opacity-100";
    if (skill.id === activeId || related?.has(skill.id)) return "opacity-100";
    return "opacity-25";
  }

  return (
    <section id="skills" className={`w-full bg-base text-foreground ${SECTION_SPACE}`}>
      <div className={CONTAINER}>
        {/* Heading on the left, the live caption on the right, so the caption sits right above the words it describes. */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
          <SplitWords
            lines={["Two tracks,", "one engineer."]}
            className={`${DISPLAY_FACE} ${TEXT_HEADING} text-foreground lg:col-span-7`}
          />
          <Reveal className="lg:col-span-5">
            <p className={`min-h-[3.2em] ${TEXT_BODY} font-semibold text-foreground`} aria-live="polite">
              {caption}
            </p>
          </Reveal>
        </div>

        {/* The whole stack as one flowing mass of words, full width. */}
        <motion.ul
          className="mt-16 flex flex-wrap items-baseline gap-x-6 gap-y-3 md:mt-24"
          variants={reduceMotion ? undefined : list}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
        >
          {skills.map((skill) => {
            const level = skill.proficiency ?? "proficient";
            return (
              <motion.li key={skill.id} data-reveal variants={reduceMotion ? undefined : word}>
                <button
                  type="button"
                  aria-pressed={skill.id === activeId}
                  onMouseEnter={() => setActiveId(skill.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(skill.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => setActiveId((current) => (current === skill.id ? null : skill.id))}
                  className={`rounded-md text-left leading-none text-foreground transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${SIZE[level]} ${WEIGHT[level]} ${toneFor(skill)}`}
                >
                  {skill.name}
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
