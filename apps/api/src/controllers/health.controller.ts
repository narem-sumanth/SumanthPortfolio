import type { Request, Response } from "express";
import type { HealthResponse, ReadyResponse } from "@portfolio/types";
import { portfolioRepository } from "../repositories/portfolio.repository";

export function getHealth(_req: Request, res: Response) {
  const body: HealthResponse = { status: "ok", service: "api", timestamp: new Date().toISOString() };
  res.json(body);
}

export function getReadiness(_req: Request, res: Response) {
  let dataLoaded = false;
  try {
    dataLoaded = portfolioRepository.getProfile().name.length > 0;
  } catch {
    dataLoaded = false;
  }
  const body: ReadyResponse = { status: dataLoaded ? "ready" : "degraded", checks: { seedData: dataLoaded } };
  res.status(dataLoaded ? 200 : 503).json(body);
}
