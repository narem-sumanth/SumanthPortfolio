import type { Profile } from "@portfolio/types";
import { apiClient } from "./apiClient";

/**
 * Server-side data fetching with a safe fallback — if the API is briefly
 * unavailable during a build or request, pages still render instead of
 * throwing, matching the "never show an ugly error" UX principle.
 */
export async function getProfileSafe(): Promise<Profile | null> {
  try {
    return await apiClient.getProfile();
  } catch {
    return null;
  }
}
