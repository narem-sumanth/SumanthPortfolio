import { createApiClient } from "@portfolio/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Single client instance for browser-side calls — see packages/api-client for the contract. */
export const apiClient = createApiClient({ baseUrl: API_URL });
