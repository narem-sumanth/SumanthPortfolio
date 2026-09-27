import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

describe("GET /api/health", () => {
  it("returns ok status", async () => {
    const app = createApp();
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/ready", () => {
  it("reports seed data loaded", async () => {
    const app = createApp();
    const res = await request(app).get("/api/ready");
    expect(res.status).toBe(200);
    expect(res.body.checks.seedData).toBe(true);
  });
});

describe("GET /api/profile", () => {
  it("returns the seeded profile", async () => {
    const app = createApp();
    const res = await request(app).get("/api/profile");
    expect(res.status).toBe(200);
    expect(res.body.name).toBeTruthy();
  });
});
