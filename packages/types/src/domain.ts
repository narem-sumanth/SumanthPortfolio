/**
 * Domain types describing Sumanth's portfolio content. These mirror the
 * shape of the seed data under `data/*` and are the contract both backend
 * implementations (Express, FastAPI) must produce.
 */

export type SourceKind = "portfolio" | "github" | "web" | "resume";

export interface SourceReference {
  id: string;
  kind: SourceKind;
  label: string;
  url?: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location?: string;
  availability?: string;
  currentlyLearning?: string[];
  socials: SocialLink[];
  resumeUrl?: string;
  avatarUrl?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  credential: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export type SkillCategory =
  | "language"
  | "frontend"
  | "backend"
  | "devops"
  | "cloud"
  | "ai"
  | "database"
  | "tool";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  relatedTo?: string[];
  proficiency?: "learning" | "familiar" | "proficient" | "expert";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  topics: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  /** Populated at retrieval time from the GitHub connector; absent for manual-only entries. */
  githubMeta?: GithubRepoMeta;
}

export interface GithubRepoMeta {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  archived: boolean;
  defaultBranch: string;
}
