import type { Request, Response } from "express";
import { portfolioRepository } from "../repositories/portfolio.repository";
import { githubSource } from "../services/retrieval/github.source";

/** Manually-catalogued projects, enriched with live GitHub metadata where a matching repo exists. */
export async function getProjects(_req: Request, res: Response) {
  const projects = portfolioRepository.getProjects();
  const repos = await githubSource.fetchRepos();
  const repoByName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

  const enriched = projects.map((project) => {
    const repo = project.github ? repoByName.get(project.github.split("/").pop()?.toLowerCase() ?? "") : undefined;
    return repo ? { ...project, githubMeta: repo } : project;
  });

  res.json(enriched);
}
