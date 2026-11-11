import type { ExperienceEntry, Profile, Project, Skill } from "@portfolio/types";
import { splitLeadSentence } from "../lib/format";
import { CONTAINER, DISPLAY_FACE, SECTION_SPACE, TEXT_BODY, TEXT_HEADING, TEXT_LEAD } from "../lib/type-scale";
import { AnimatedCounter } from "./animated-counter";
import { Reveal } from "./reveal";
import { ScrollWords } from "./scroll-words";
import { SplitWords } from "./split-words";

export function About({
  profile,
  experience,
  skills,
  projects,
}: {
  profile: Profile | null;
  experience: ExperienceEntry[];
  skills: Skill[];
  projects: Project[];
}) {
  if (!profile) return null;

  const { lead, rest } = splitLeadSentence(profile.bio);
  // The hero already carries the opening sentence; the story continues here.
  const story = rest || lead;

  // Every figure is counted from the portfolio's own data — nothing typed in by hand.
  const figures = [
    { value: experience.length, label: experience.length === 1 ? "team shipped with" : "teams shipped with" },
    { value: skills.length, label: "technologies in regular use" },
    { value: projects.length, label: projects.length === 1 ? "project in the open" : "projects in the open" },
  ].filter((figure) => figure.value > 0);

  return (
    <section id="about" data-field="white" className={`w-full bg-base ${SECTION_SPACE}`}>
      <div className={`${CONTAINER} grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12`}>
        <SplitWords
          lines={["Code first.", "Ops always."]}
          className={`${DISPLAY_FACE} ${TEXT_HEADING} text-foreground lg:sticky lg:top-28 lg:col-span-5 lg:self-start`}
        />

        <div className="lg:col-span-7">
          <ScrollWords text={story} className={`${TEXT_LEAD} font-medium leading-[1.35] text-foreground`} />

          {figures.length > 0 && (
            <dl className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
              {figures.map((figure, i) => (
                <Reveal key={figure.label} delay={i * 0.08} className="flex items-start flex-col-reverse gap-3">
                  <dt className={`${TEXT_BODY} text-foreground-muted`}>{figure.label}</dt>
                  <dd className={`${DISPLAY_FACE} ${TEXT_HEADING} text-accent`}>
                    <AnimatedCounter value={figure.value} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
