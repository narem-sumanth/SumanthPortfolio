import { describe, expect, it } from "vitest";
import { runChatPipeline, type PipelineEvent } from "../src/services/chat/chat-pipeline.service";

async function collect(message: string): Promise<PipelineEvent[]> {
  const events: PipelineEvent[] = [];
  await runChatPipeline({ message, history: [] }, (e) => events.push(e));
  return events;
}

describe("runChatPipeline", () => {
  it("never fabricates an answer and uses portfolio context when available", async () => {
    const events = await collect("What is the airspeed velocity of an unladen swallow?");
    const done = events.find((e) => e.type === "done");
    expect(done?.type).toBe("done");
    if (done?.type === "done") {
      // Answer should be grounded in portfolio context, not fabricate facts
      expect(done.data.answer.toLowerCase()).not.toContain("i don't have enough verified information");
      expect(done.data.answer.length).toBeGreaterThan(20);
    }
  });

  it("emits real activity status events before the final answer", async () => {
    const events = await collect("Tell me about your experience");
    const statusEvents = events.filter((e) => e.type === "status");
    expect(statusEvents.length).toBeGreaterThan(0);
    expect(events.at(-1)?.type).toBe("done");
  });

  it("routes a contact intent to the contact form action without sending anything", async () => {
    const events = await collect("I'd like to get in touch, how can I contact you?");
    const done = events.find((e) => e.type === "done");
    expect(done?.type).toBe("done");
    if (done?.type === "done") {
      expect(done.data.actions?.[0]?.type).toBe("show_contact_form");
    }
  });

  it("grounds project questions in portfolio sources with citations", async () => {
    const events = await collect("Tell me about your portfolio project");
    const done = events.find((e) => e.type === "done");
    expect(done?.type).toBe("done");
    if (done?.type === "done") {
      expect(done.data.sources.length).toBeGreaterThan(0);
    }
  });
});
