import { env } from "./config/env";
import { logger } from "./utils/logger";
import { createApp } from "./app";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, corsOrigins: env.CORS_ORIGINS }, "api listening");
});
