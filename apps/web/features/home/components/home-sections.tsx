import type { ExperienceEntry, Profile, Project, Skill } from "@portfolio/types";
import { About } from "./about";
import { ContactBand } from "./contact-band";
import { Hero } from "./hero";
import { ScrollProgress } from "./scroll-progress";
import { SkillsList } from "./skills-list";
import { Work } from "./work";

export function HomeSections({
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
  return (
    <>
      <ScrollProgress />
      <Hero profile={profile} experience={experience} skills={skills} projects={projects} />
      <About profile={profile} />
      <Work experience={experience} projects={projects} />
      <SkillsList skills={skills} />
      <ContactBand profile={profile} />
    </>
  );
}
