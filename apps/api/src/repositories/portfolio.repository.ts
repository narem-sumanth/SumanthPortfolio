import { readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { Achievement, EducationEntry, ExperienceEntry, Profile, Project, Skill } from "@portfolio/types";

const DATA_ROOT = join(__dirname, "../../../../data");

function readJson<T>(relativePath: string): T {
  const raw = readFileSync(join(DATA_ROOT, relativePath), "utf-8");
  return JSON.parse(raw) as T;
}

function readMarkdown(relativePath: string): string {
  const raw = readFileSync(join(DATA_ROOT, relativePath), "utf-8");
  return matter(raw).content.trim();
}

/**
 * Seed data is small and static per process lifetime, so we read it once and
 * cache in memory rather than reaching for a database — see docs/architecture.md.
 */
let cache: {
  profile: Profile;
  bioLongForm: string;
  experience: ExperienceEntry[];
  projects: Project[];
  skills: Skill[];
  education: EducationEntry[];
  achievements: Achievement[];
} | null = null;

function load() {
  if (cache) return cache;
  cache = {
    profile: readJson<Profile>("profile/profile.json"),
    bioLongForm: readMarkdown("profile/bio.md"),
    experience: readJson<ExperienceEntry[]>("experience/experience.json"),
    projects: readJson<Project[]>("projects/projects.json"),
    skills: readJson<Skill[]>("skills/skills.json"),
    education: readJson<EducationEntry[]>("education/education.json"),
    achievements: readJson<Achievement[]>("achievements/achievements.json"),
  };
  return cache;
}

export const portfolioRepository = {
  getProfile: () => load().profile,
  getBioLongForm: () => load().bioLongForm,
  getExperience: () => load().experience,
  getProjects: () => load().projects,
  getSkills: () => load().skills,
  getEducation: () => load().education,
  getAchievements: () => load().achievements,
};
