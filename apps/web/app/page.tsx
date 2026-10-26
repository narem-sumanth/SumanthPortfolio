import type { Skill, SkillCategory } from "@portfolio/types";
import {
  getAchievementsSafe,
  getEducationSafe,
  getExperienceSafe,
  getProfileSafe,
  getProjectsSafe,
  getSkillsSafe,
} from "@/features/portfolio";
import { ProjectCarousel, ServicesSection } from "@/features/portfolio";
import { ScrollReveal } from "@/features/shell";
import { OpenChatButton } from "@/features/chat";

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

const TICKER_ITEMS = [
  "Next.js", "TypeScript", "React", "Node.js", "Docker",
  "Kubernetes", "AWS", "Terraform", "PostgreSQL", "Redis",
  "GraphQL", "NVIDIA Nemotron", "LangChain", "RAG", "CI/CD",
];

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
  const realEducation = education.filter((e) => !isPlaceholder(e.institution) && !isPlaceholder(e.credential));
  const realAchievements = achievements.filter((e) => !isPlaceholder(e.title) && !isPlaceholder(e.description));
  const socials = (profile?.socials ?? []).filter((s) => !isPlaceholder(s.url));
  const hasBio = !isPlaceholder(profile?.bio);
  const firstName = profile?.name?.split(" ")[0] ?? "Sumanth";
  const lastName = profile?.name?.split(" ").slice(1).join(" ") ?? "Narem";

  return (
    <>
      {/* ─── Hero ─── */}
      <section
        id="hero"
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-28 sm:px-8"
      >
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-accent/8 blur-[120px] animate-float" />
          <div className="absolute -bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/6 blur-[100px] animate-float-alt" />
          <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/4 blur-[160px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative mx-auto max-w-5xl w-full text-center">
          <div className="animate-hero-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-foreground-subtle backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
              {profile?.availability ?? "Available for Work"}
            </span>
          </div>

          <h1 className="mt-8 font-display">
            <span className="animate-hero-2 block text-7xl font-extrabold leading-[0.9] tracking-tight lg:text-8xl xl:text-9xl">
              <span className="gradient-text">{firstName}</span>
            </span>
            <span className="animate-hero-3 block text-7xl font-extrabold leading-[0.9] tracking-tight text-foreground lg:text-8xl xl:text-9xl">
              {lastName}
            </span>
          </h1>

          <p className="animate-hero-4 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground-muted lg:text-xl">
            {profile?.tagline ?? "Building across full-stack, DevOps, cloud, and AI."}
          </p>

          <div className="animate-hero-5 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <OpenChatButton />
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-md border border-border px-7 py-3.5 text-sm font-medium text-foreground-muted transition-all duration-200 hover:border-border-strong hover:bg-raised hover:text-foreground"
            >
              See the work
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow opacity-40" aria-hidden="true">
          <svg className="h-6 w-6 text-foreground-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── Tech Ticker ─── */}
      <div className="relative overflow-hidden border-y border-border bg-elevated/40 py-4" aria-hidden="true">
        <div className="flex animate-marquee gap-8 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex-shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-foreground-subtle"
            >
              {item}
              <span className="mx-4 text-border-strong">·</span>
            </span>
          ))}
        </div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base to-transparent" />
      </div>

      {/* ─── Work / Projects ─── */}
      <section id="work" className="py-24 lg:py-36" aria-labelledby="work-heading">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 lg:mb-20">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                Selected Work
              </p>
              <h2 id="work-heading" className="text-4xl font-extrabold tracking-tight text-foreground font-display lg:text-5xl">
                Projects
              </h2>
              <p className="mt-3 max-w-xl text-base text-foreground-muted">
                A curated selection of things I&rsquo;ve built — from AI-powered products to cloud infrastructure.
              </p>
            </div>
          </ScrollReveal>
          <ProjectCarousel projects={projects} />
        </div>
      </section>

      {/* ─── About ─── */}
      {(experience.length > 0 || hasBio) && (
        <section id="about" className="py-24 lg:py-36" aria-labelledby="about-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <ScrollReveal>
              <div className="mb-14 lg:mb-20">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                  About me
                </p>
                <h2 id="about-heading" className="text-4xl font-extrabold tracking-tight text-foreground font-display lg:text-5xl">
                  Background
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Bio + socials */}
              <div className="flex flex-col gap-8">
                {hasBio && (
                  <ScrollReveal delay={100}>
                    <p className="text-base leading-relaxed text-foreground-muted lg:text-lg">
                      {profile?.bio}
                    </p>
                  </ScrollReveal>
                )}

                {profile?.currentlyLearning?.length && (
                  <ScrollReveal delay={200}>
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
                        Currently learning
                      </h3>
                      <ul className="flex flex-wrap gap-2">
                        {profile.currentlyLearning.map((item) => (
                          <li
                            key={item}
                            className="rounded-md border border-border bg-elevated px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                )}

                {socials.length > 0 && (
                  <ScrollReveal delay={300}>
                    <div className="flex flex-wrap gap-3 border-t border-border pt-6">
                      {socials.map((social) => (
                        <a
                          key={social.url}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground-muted transition-all hover:border-accent/40 hover:text-foreground"
                        >
                          {social.label}
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </ScrollReveal>
                )}
              </div>

              {/* Experience timeline */}
              <div className="space-y-0">
                {experience.map((entry, index) => (
                  <ScrollReveal key={entry.id} delay={Math.min(index * 100, 400) as 0 | 100 | 200 | 300 | 400}>
                    <article className="relative flex gap-5 pb-10 last:pb-0">
                      {/* Timeline line */}
                      <div className="relative flex flex-col items-center">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border bg-elevated text-xs font-bold text-accent ring-4 ring-base">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        {index < experience.length - 1 && (
                          <div className="mt-2 w-px flex-1 bg-gradient-to-b from-border to-transparent" aria-hidden="true" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pb-2 pt-1">
                        <div className="mb-2 flex flex-wrap items-baseline gap-3">
                          <h3 className="text-base font-semibold tracking-tight text-foreground font-display">
                            {entry.title}
                          </h3>
                          <span className="text-sm font-medium text-accent">{entry.company}</span>
                        </div>
                        <time className="mb-3 block text-xs font-medium uppercase tracking-wider text-foreground-subtle" dateTime={entry.startDate}>
                          {new Date(entry.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          {entry.endDate
                            ? ` – ${new Date(entry.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                            : " – Present"}
                        </time>
                        <p className="mb-3 text-sm leading-relaxed text-foreground-muted">{entry.summary}</p>
                        {entry.highlights.length > 0 && (
                          <ul className="mb-3 space-y-1.5">
                            {entry.highlights.slice(0, 3).map((h, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-foreground-muted">
                                <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex flex-wrap gap-1.5" aria-label="Technologies">
                          {entry.technologies?.slice(0, 6).map((tech) => (
                            <span
                              key={tech}
                              className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Services ─── */}
      <section id="services" className="relative overflow-hidden py-24 lg:py-36" aria-labelledby="services-heading">
        <div className="pointer-events-none absolute inset-0 bg-elevated/30" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 lg:mb-20">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                What I do
              </p>
              <h2 id="services-heading" className="text-4xl font-extrabold tracking-tight text-foreground font-display lg:text-5xl">
                Services
              </h2>
            </div>
          </ScrollReveal>
          <ServicesSection />
        </div>
      </section>

      {/* ─── Skills ─── */}
      {skillGroups.length > 0 && (
        <section id="skills" className="py-24 lg:py-36" aria-labelledby="skills-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <ScrollReveal>
              <div className="mb-14 lg:mb-20">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                  Tech Stack
                </p>
                <h2 id="skills-heading" className="text-4xl font-extrabold tracking-tight text-foreground font-display lg:text-5xl">
                  Skills
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {skillGroups.map(([category, items], gi) => (
                <ScrollReveal key={category} delay={Math.min(gi * 100, 400) as 0 | 100 | 200 | 300 | 400}>
                  <div className="card-hover group flex flex-col gap-4 rounded-lg border border-border bg-elevated p-5 transition-colors hover:border-accent/30 hover:bg-elevated">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-foreground-subtle group-hover:text-accent transition-colors">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span
                          key={skill.id}
                          className={`rounded px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-colors ${
                            skill.proficiency === "expert" || skill.proficiency === "proficient"
                              ? "border border-accent/40 bg-accent/10 text-accent"
                              : "border border-border bg-base text-foreground-muted hover:border-border-strong hover:text-foreground"
                          }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Education & Achievements ─── */}
      {(realEducation.length > 0 || realAchievements.length > 0) && (
        <section id="credentials" className="relative overflow-hidden py-24 lg:py-36" aria-labelledby="credentials-heading">
          <div className="pointer-events-none absolute inset-0 bg-elevated/20" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              {realEducation.length > 0 && (
                <div>
                  <ScrollReveal>
                    <div className="mb-10">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Education</p>
                      <h2 id="credentials-heading" className="text-3xl font-extrabold tracking-tight text-foreground font-display lg:text-4xl">
                        Education
                      </h2>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-4">
                    {realEducation.map((entry, i) => (
                      <ScrollReveal key={entry.id} delay={Math.min(i * 100, 300) as 0 | 100 | 200 | 300}>
                        <article className="card-hover rounded-lg border border-border bg-elevated p-6 hover:border-accent/30">
                          <p className="font-semibold text-foreground">{entry.credential}</p>
                          <p className="mt-1 text-sm text-foreground-muted">{entry.institution}</p>
                          <p className="mt-2 text-xs text-foreground-subtle">
                            {new Date(entry.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            {entry.endDate
                              ? ` – ${new Date(entry.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                              : " – Present"}
                          </p>
                          {entry.notes && !isPlaceholder(entry.notes) && (
                            <p className="mt-3 text-sm text-foreground-muted">{entry.notes}</p>
                          )}
                        </article>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {realAchievements.length > 0 && (
                <div>
                  <ScrollReveal delay={100}>
                    <div className="mb-10">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Recognition</p>
                      <h2 id="achievements-heading" className="text-3xl font-extrabold tracking-tight text-foreground font-display lg:text-4xl">
                        Achievements
                      </h2>
                    </div>
                  </ScrollReveal>
                  <ul className="space-y-4">
                    {realAchievements.map((entry, i) => (
                      <ScrollReveal key={entry.id} delay={Math.min(i * 100 + 100, 400) as 0 | 100 | 200 | 300 | 400}>
                        <li className="card-hover rounded-lg border border-border bg-elevated p-6 hover:border-accent/30">
                          <p className="font-medium text-foreground">{entry.title}</p>
                          <p className="mt-1 text-sm text-foreground-muted">{entry.description}</p>
                          {entry.date && (
                            <time className="mt-2 block text-xs text-foreground-subtle" dateTime={entry.date}>
                              {new Date(entry.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </time>
                          )}
                        </li>
                      </ScrollReveal>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Contact / CTA ─── */}
      <section id="contact" className="relative overflow-hidden py-32 lg:py-48" aria-labelledby="contact-heading">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/8 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-violet-500/5 blur-[100px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
          <ScrollReveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent">Get in touch</p>
            <h2 id="contact-heading" className="text-4xl font-extrabold tracking-tight font-display lg:text-6xl">
              <span className="gradient-text">Got something</span>
              <br />
              <span className="text-foreground">in mind?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
              I&rsquo;m always open to discussing new projects, collaborations, or interesting problems to solve.
              My AI twin is available 24/7 and can answer most questions instantly.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <OpenChatButton label="Chat with my AI twin" />
              {socials.find((s) => s.label.toLowerCase().includes("email") || s.url.includes("mailto")) && (
                <a
                  href={socials.find((s) => s.label.toLowerCase().includes("email") || s.url.includes("mailto"))!.url}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-7 py-3.5 text-sm font-medium text-foreground-muted transition-all hover:border-border-strong hover:bg-raised hover:text-foreground"
                >
                  Send an email
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-base py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-bold tracking-tight text-foreground font-display">
                {profile?.name ?? "Sumanth Narem"}
              </p>
              <p className="mt-1 text-sm text-foreground-muted">
                {profile?.tagline ?? "Software Engineer"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {profile?.socials?.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs text-foreground-subtle">
              © {new Date().getFullYear()} {profile?.name ?? "Sumanth Narem"}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-foreground-subtle">
              <a href="/privacy" className="transition-colors hover:text-foreground">Privacy</a>
              <span aria-hidden="true">/</span>
              <a href="/cookies" className="transition-colors hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
