import rateLimit from "express-rate-limit";

export const chatRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "You're sending messages too quickly. Please slow down." },
});

export const contactRateLimit = rateLimit({
  windowMs: 10 * 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many contact submissions. Please try again later." },
});
