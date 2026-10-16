import type { Skill, SkillCategory } from "@portfolio/types";

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  language: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI",
  devops: "DevOps",
  cloud: "Cloud",
  database: "Databases",
  tool: "Tools",
};

export const CATEGORY_ORDER: SkillCategory[] = Object.keys(CATEGORY_LABELS) as SkillCategory[];

export function groupSkillsByCategory(skills: Skill[]) {
  const groups = new Map<SkillCategory, Skill[]>();
  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return CATEGORY_ORDER.filter((category) => groups.has(category)).map(
    (category) => [category, groups.get(category)!] as const,
  );
}
