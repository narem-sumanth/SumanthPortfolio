import pino from "pino";
import pretty from "pino-pretty";

const isProduction = process.env.NODE_ENV === "production";

/**
 * A worker-thread transport (pino's `transport` option) can only take
 * serializable config, so it can't run the conditional messageFormat below.
 * Using pino-pretty as an in-process stream instead trades that off for a
 * one-line "GET /api/profile 200 2ms" summary on request logs.
 */
const prettyStream = pretty({
  colorize: true,
  translateTime: "SYS:HH:MM:ss",
  ignore: "pid,hostname,req,res,responseTime",
  singleLine: true,
  messageFormat: (log, messageKey) => {
    const req = log.req as { method?: string; url?: string; id?: string } | undefined;
    const res = log.res as { statusCode?: number } | undefined;
    if (req && res) {
      return `${req.method} ${req.url} ${res.statusCode} ${log.responseTime}ms (${req.id})`;
    }
    return String(log[messageKey]);
  },
});

/**
 * Structured logging. Never pass secrets or raw contact message bodies —
 * redact paths cover the common accidental-leak shapes. Pretty-printed as a
 * single line outside production so local dev logs stay scannable;
 * production keeps raw JSON lines for log aggregation.
 */
export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
    redact: {
      paths: [
        "req.headers.authorization",
        "*.apiKey",
        "*.NVIDIA_API_KEY",
        "*.GITHUB_TOKEN",
        "*.email",
        "*.message",
      ],
      censor: "[redacted]",
    },
  },
  isProduction ? undefined : prettyStream,
);
