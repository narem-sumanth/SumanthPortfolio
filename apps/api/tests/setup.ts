// Force the deterministic MockProvider in tests — never hit the real NVIDIA
// API or depend on network access to verify behavior. Must run before any
// source module imports process.env (dotenv.config in src/env.ts respects
// already-set variables, so this wins).
process.env.NVIDIA_API_KEY = "";
process.env.CONTACT_WEBHOOK_URL = "";
process.env.GITHUB_USERNAME = "";
process.env.CORS_ORIGINS = "http://localhost:3000";
