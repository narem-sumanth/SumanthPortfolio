import { HomeSections } from "@/features/home";
import {
  getExperienceSafe,
  getProfileSafe,
  getProjectsSafe,
  getSkillsSafe,
} from "@/features/portfolio";

export default async function HomePage() {
  const [profile, experience, skills, projects] = await Promise.all([
    getProfileSafe(),
    getExperienceSafe(),
    getSkillsSafe(),
    getProjectsSafe(),
  ]);

  return <HomeSections profile={profile} experience={experience} skills={skills} projects={projects} />;
}
