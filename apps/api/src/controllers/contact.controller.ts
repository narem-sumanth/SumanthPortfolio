import type { Request, Response } from "express";
import type { ContactResponse } from "@portfolio/types";
import { createContactRequest, ContactValidationError } from "../services/contact/contact.service";

export async function postContact(req: Request, res: Response) {
  try {
    const { id } = await createContactRequest(req.body);
    const body: ContactResponse = { ok: true, id };
    res.status(201).json(body);
  } catch (err) {
    if (err instanceof ContactValidationError) {
      res.status(400).json({ ok: false, error: err.message });
      return;
    }
    res.status(500).json({ ok: false, error: "Couldn't send your message right now. Please try again." });
  }
}
