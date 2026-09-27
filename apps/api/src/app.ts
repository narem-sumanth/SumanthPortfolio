import express from "express";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { requestContext } from "./middlewares/request-context.middleware";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestContext);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "50kb" }));

  app.use("/api", apiRouter);

  app.use((_req, res) => {
    res.status(404).json({ ok: false, error: "Not found" });
  });

  app.use(errorHandler);

  return app;
}
