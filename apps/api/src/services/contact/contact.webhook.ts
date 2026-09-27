import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import type { ContactInput } from "./contact.validation";

/**
 * Notification hop after a contact submission is accepted. Never hard-codes
 * a destination — CONTACT_WEBHOOK_URL is the only configuration surface, and
 * an unset value degrades to a structured log instead of failing the request.
 */
export async function dispatchContactWebhook(submission: ContactInput & { id: string }): Promise<void> {
  if (!env.CONTACT_WEBHOOK_URL) {
    logger.info({ contactId: submission.id }, "CONTACT_WEBHOOK_URL not set — contact submission logged only");
    return;
  }

  try {
    await fetch(env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        message: submission.message,
        source: "portfolio-chat",
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    logger.error({ err, contactId: submission.id }, "Contact webhook dispatch failed");
  }
}
