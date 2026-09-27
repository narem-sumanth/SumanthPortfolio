import { Router } from "express";
import { contactRateLimit } from "../middlewares/rate-limit.middleware";
import { postContact } from "../controllers/contact.controller";

export const contactRouter = Router();

contactRouter.post("/contact", contactRateLimit, postContact);
