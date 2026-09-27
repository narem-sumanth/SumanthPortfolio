import type { Request, Response } from "express";
import { portfolioRepository } from "../repositories/portfolio.repository";

export function getProfile(_req: Request, res: Response) {
  res.json(portfolioRepository.getProfile());
}

export function getExperience(_req: Request, res: Response) {
  res.json(portfolioRepository.getExperience());
}

export function getSkills(_req: Request, res: Response) {
  res.json(portfolioRepository.getSkills());
}

export function getEducation(_req: Request, res: Response) {
  res.json(portfolioRepository.getEducation());
}

export function getAchievements(_req: Request, res: Response) {
  res.json(portfolioRepository.getAchievements());
}
