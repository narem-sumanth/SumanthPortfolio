import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

describe("POST /api/contact", () => {
  it("rejects an invalid email", async () => {
    const app = createApp();
    const res = await request(app).post("/api/contact").send({ name: "Jane", email: "not-an-email", message: "Hello there" });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("accepts a valid submission", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/contact")
      .send({ name: "Jane Doe", email: "jane@example.com", message: "I'd love to connect." });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.id).toBeTruthy();
  });

  it("silently accepts (but discards) honeypot-tripped submissions", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/contact")
      .send({ name: "Bot", email: "bot@example.com", message: "spam spam spam", company: "filled-by-bot" });
    expect(res.status).toBe(201);
  });
});
