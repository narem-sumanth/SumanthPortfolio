import { Badge, Button, ExperienceTimeline, ProjectGrid } from "@portfolio/ui";
import type { Skill, SkillCategory } from "@portfolio/types";
import { AskAiButton } from "@/features/chat";
import {
  getAchievementsSafe,
  getEducationSafe,
  getExperienceSafe,
  getProfileSafe,
  getProjectsSafe,
  getSkillsSafe,
} from "@/features/portfolio";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  language: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI",
  devops: "DevOps",
  cloud: "Cloud",
  database: "Databases",
  tool: "Tools",
};

const CATEGORY_ORDER: SkillCategory[] = Object.keys(CATEGORY_LABELS) as SkillCategory[];

function isPlaceholder(value?: string | null) {
  return !value || value.includes("PLACEHOLDER");
}

function groupSkillsByCategory(skills: Skill[]) {
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

export default async function HomePage() {
  const [profile, experience, skills, projects, education, achievements] = await Promise.all([
    getProfileSafe(),
    getExperienceSafe(),
    getSkillsSafe(),
    getProjectsSafe(),
    getEducationSafe(),
    getAchievementsSafe(),
  ]);

  const skillGroups = groupSkillsByCategory(skills);
  const realEducation = education.filter((entry) => !isPlaceholder(entry.institution) && !isPlaceholder(entry.credential));
  const realAchievements = achievements.filter((entry) => !isPlaceholder(entry.title) && !isPlaceholder(entry.description));
  const socials = (profile?.socials ?? []).filter((social) => !isPlaceholder(social.url));
  const hasBio = !isPlaceholder(profile?.bio);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-4 border-b border-border pb-10">
        <span className="w-fit rounded-full border border-border bg-inset px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">
          {profile?.availability ?? "Portfolio"}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {profile?.name ?? "Sumanth Narem"}
        </h1>
        {profile?.tagline && <p className="max-w-xl text-sm text-foreground-muted sm:text-base">{profile.tagline}</p>}
        {hasBio && <p className="max-w-2xl text-sm text-foreground-muted">{profile?.bio}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {socials.map((social) => (
            <Button key={social.url} asChild variant="outline" size="sm">
              <a href={social.url} target="_blank" rel="noreferrer noopener">
                {social.label}
              </a>
            </Button>
          ))}
          <AskAiButton className="ml-auto" />
        </div>
      </section>

      {experience.length > 0 && (
        <section className="py-10">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Experience</h2>
          <ExperienceTimeline entries={experience} />
        </section>
      )}

      {skillGroups.length > 0 && (
        <section className="border-t border-border py-10">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Skills</h2>
          <div className="flex flex-col gap-5">
            {skillGroups.map(([category, items]) => (
              <div key={category} className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <h3 className="w-28 shrink-0 pt-1 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant={skill.proficiency === "expert" || skill.proficiency === "proficient" ? "accent" : "default"}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="border-t border-border py-10">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Projects</h2>
          <ProjectGrid projects={projects} />
        </section>
      )}

      {realEducation.length > 0 && (
        <section className="border-t border-border py-10">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Education</h2>
          <div className="flex flex-col gap-4">
            {realEducation.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{entry.credential}</p>
                <p className="text-sm text-foreground-muted">{entry.institution}</p>
                {entry.notes && !isPlaceholder(entry.notes) && (
                  <p className="text-sm text-foreground-subtle">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {realAchievements.length > 0 && (
        <section className="border-t border-border py-10">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Achievements</h2>
          <ul className="flex flex-col gap-2">
            {realAchievements.map((entry) => (
              <li key={entry.id} className="text-sm text-foreground-muted">
                <span className="font-medium text-foreground">{entry.title}</span>: {entry.description}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
