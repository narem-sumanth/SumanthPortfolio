import { createApiClient } from "@portfolio/api-client";
import type { Achievement, EducationEntry, ExperienceEntry, Profile, Project, Skill } from "@portfolio/types";

function getClient() {
  return createApiClient({ baseUrl: process.env.API_URL ?? "" });
}

export async function getProfileSafe(): Promise<Profile | null> {
  try {
    return await getClient().getProfile();
  } catch {
    return null;
  }
}

export async function getExperienceSafe(): Promise<ExperienceEntry[]> {
  try {
    return await getClient().getExperience();
  } catch {
    return [];
  }
}

export async function getSkillsSafe(): Promise<Skill[]> {
  try {
    return await getClient().getSkills();
  } catch {
    return [];
  }
}

export async function getProjectsSafe(): Promise<Project[]> {
  try {
    return await getClient().getProjects();
  } catch {
    return [];
  }
}

export async function getEducationSafe(): Promise<EducationEntry[]> {
  try {
    return await getClient().getEducation();
  } catch {
    return [];
  }
}

export async function getAchievementsSafe(): Promise<Achievement[]> {
  try {
    return await getClient().getAchievements();
  } catch {
    return [];
  }
}
