import { config } from "dotenv";
import { join } from "node:path";
import { z } from "zod";

config({ path: join(__dirname, "../../../../.env") });

/**
 * Validated at process startup — fails fast with a readable message instead
 * of surfacing confusing errors deep inside a request handler later.
 */
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((value) => value.split(",").map((origin) => origin.trim())),

  NVIDIA_API_KEY: z.string().optional(),
  NVIDIA_BASE_URL: z.string().url().default("https://integrate.api.nvidia.com/v1"),
  NVIDIA_MODEL: z.string().default("nvidia/nemotron-3-super-120b-a12b"),

  GITHUB_TOKEN: z.string().optional(),
  GITHUB_USERNAME: z.string().optional(),

  GOOGLE_SEARCH_API_KEY: z.string().optional(),
  GOOGLE_SEARCH_ENGINE_ID: z.string().optional(),

  CONTACT_WEBHOOK_URL: z.string().url().optional().or(z.literal("")),

  COMMIT_SHA: z.string().optional(),
});

export type Env = ReturnType<typeof loadEnv>;

export function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
