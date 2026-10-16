import type { Skill } from "@portfolio/types";
import { CATEGORY_LABELS, groupSkillsByCategory } from "../lib/skills";
import { DISPLAY_FACE, TEXT_BODY, TEXT_DISPLAY, TEXT_SMALL } from "../lib/type-scale";
import { Reveal } from "./reveal";

export function SkillsList({ skills }: { skills: Skill[] }) {
  const groups = groupSkillsByCategory(skills);
  if (groups.length === 0) return null;

  return (
    <section id="skills" className="w-full py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-6 sm:px-10">
        {groups.map(([category, items], i) => (
          // Separated by space alone, never a divider line (house rule: no hairlines).
          <Reveal key={category} delay={Math.min(i * 0.04, 0.3)} as="div" className={`group ${i === 0 ? "" : "mt-8"}`}>
            <div className="flex items-baseline justify-between gap-6">
              <h2 className={`${TEXT_DISPLAY} ${DISPLAY_FACE} text-foreground transition-colors group-hover:text-accent`}>
                {CATEGORY_LABELS[category]}
              </h2>
              <span className={`shrink-0 ${TEXT_SMALL} tabular-nums text-foreground-muted`}>{items.length}</span>
            </div>
            <p className={`mt-2 max-w-[72ch] ${TEXT_BODY} text-foreground`}>
              {items.map((skill) => skill.name).join(", ")}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
