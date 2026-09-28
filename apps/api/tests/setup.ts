// Force MockProvider in tests — no real API calls or network.
process.env.NVIDIA_API_KEY = "";
process.env.CONTACT_WEBHOOK_URL = "";
process.env.GITHUB_USERNAME = "";
process.env.CORS_ORIGINS = "http://localhost:3000";
