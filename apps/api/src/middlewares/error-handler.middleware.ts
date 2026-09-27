import type { ErrorRequestHandler } from "express";
import { logger } from "../utils/logger";

/**
 * Never leaks stack traces or internal details to the client — every error
 * response follows the friendly-error UX pattern from the product spec.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error({ err, path: req.path }, "Unhandled request error");
  if (res.headersSent) return;
  res.status(500).json({
    ok: false,
    error: "Something went wrong on my end. Please try again in a moment.",
  });
};
