import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  message: z.string().trim().min(5, "Message is too short").max(4000),
  company: z.string().max(200).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Honeypot: a real visitor never sees or fills this field. */
export function isHoneypotTripped(input: ContactInput): boolean {
  return input.company.trim().length > 0;
}
