import { Router } from "express";
import { chatRateLimit } from "../middlewares/rate-limit.middleware";
import { postChat } from "../controllers/chat.controller";

export const chatRouter = Router();

chatRouter.post("/chat", chatRateLimit, postChat);
