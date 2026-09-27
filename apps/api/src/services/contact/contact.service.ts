import { randomUUID } from "node:crypto";
import { logger } from "../../utils/logger";
import { dispatchContactWebhook } from "./contact.webhook";
import { contactSchema, isHoneypotTripped, type ContactInput } from "./contact.validation";

export class ContactValidationError extends Error {}

/** Single implementation shared by the chat inline form and the landing page contact section. */
export async function createContactRequest(payload: unknown): Promise<{ id: string }> {
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ContactValidationError(parsed.error.issues[0]?.message ?? "Invalid submission");
  }

  const input: ContactInput = parsed.data;
  if (isHoneypotTripped(input)) {
    // Pretend success to the caller (a bot) without actually notifying anyone.
    logger.warn("Contact honeypot tripped — submission discarded silently");
    return { id: randomUUID() };
  }

  const id = randomUUID();
  await dispatchContactWebhook({ ...input, id });
  logger.info({ contactId: id }, "Contact request received");
  return { id };
}
