import { env } from "./config/env";
import { logger } from "./utils/logger";
import { createApp } from "./app";

const app = createApp();

// Vercel serverless: import this file and invoke the default export.
export default app;

// Local dev: only listen when run directly, not when imported by Vercel.
if (require.main === module) {
  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, corsOrigins: env.CORS_ORIGINS }, "api listening");
  });
}
