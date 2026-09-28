import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env vars from monorepo root — same role as env.ts in apps/api.
// process.loadEnvFile is Node 20+ built-in, no dotenv dependency needed.
process.loadEnvFile(path.join(__dirname, "../../.env"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@portfolio/ui", "@portfolio/design-system", "@portfolio/types", "@portfolio/api-client"],
  // Produces .next/standalone — a self-contained server with only the
  // production deps this app actually traces, so the Docker runtime image
  // doesn't need to carry the full monorepo node_modules. See
  // infra/docker/Dockerfile.web and https://nextjs.org/docs/pages/api-reference/next-config-js/output
  output: "standalone",
  // In a pnpm workspace, file tracing must be rooted at the monorepo root
  // (not this app's own directory) so it correctly follows pnpm's
  // symlinked node_modules out to the real packages on disk.
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
