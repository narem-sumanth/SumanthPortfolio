import { Router } from "express";
import { getProjects } from "../controllers/projects.controller";

export const projectsRouter = Router();

projectsRouter.get("/projects", getProjects);
