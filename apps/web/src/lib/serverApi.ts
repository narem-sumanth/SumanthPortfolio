import { createApiClient } from "@portfolio/api-client";
import type { Profile } from "@portfolio/types";

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
