import type { Request, Response } from "express";
import { z } from "zod";
import { runChatPipeline, type PipelineEvent } from "../services/chat/chat-pipeline.service";
import { logger } from "../utils/logger";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  // The pipeline only ever grounds on the last 6 turns (see chat-pipeline.service.ts), and
  // the frontend now windows what it sends to the last 12 - this cap is just a defense-in-
  // depth ceiling against an abusive payload, not something a normal conversation should
  // ever approach. It must stay comfortably above what the frontend actually sends, or every
  // message in a long-running conversation starts hard-failing even though it's perfectly valid.
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(100)
    .optional()
    .default([]),
  sources: z.array(z.enum(["portfolio", "google", "github"])).max(3).optional(),
});

export async function postChat(req: Request, res: Response) {
  const parsed = chatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues.some((issue) => issue.path[0] === "message")
      ? "Please provide a message to send."
      : "That message couldn't be sent - please try again.";
    res.status(400).json({ ok: false, error: message });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event: PipelineEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15_000);
  req.on("close", () => clearInterval(heartbeat));

  try {
    await runChatPipeline(
      {
        message: parsed.data.message,
        history: parsed.data.history.map((m) => ({ role: m.role, content: m.content })),
        sources: parsed.data.sources,
      },
      send,
    );
  } catch (err) {
    logger.error({ err }, "Chat pipeline crashed");
    send({ type: "error", message: "Something interrupted my response. Please try asking again." });
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
}
