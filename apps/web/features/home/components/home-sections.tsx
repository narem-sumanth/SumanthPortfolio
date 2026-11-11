import type { ExperienceEntry, Profile, Project, Skill } from "@portfolio/types";
import { About } from "./about";
import { Contact } from "./contact";
import { Experience } from "./experience";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { IntroProvider } from "./intro-provider";
import { Navbar } from "./navbar";
import { Preloader } from "./preloader";
import { Projects } from "./projects";
import { ScrollProgress } from "./scroll-progress";
import { StackMarquee } from "./stack-marquee";
import { Tracks } from "./tracks";

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
  const name = profile?.name ?? "Sumanth Narem";
  const role = profile?.role ?? "Senior Software Developer & Junior DevOps Engineer";

  return (
    <IntroProvider>
      <Preloader name={name} role={role} />
      <ScrollProgress />
      <Navbar name={name} />

      <Hero profile={profile} />
      <StackMarquee skills={skills} />
      <About profile={profile} experience={experience} skills={skills} projects={projects} />
      <Tracks skills={skills} />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </IntroProvider>
  );
}
