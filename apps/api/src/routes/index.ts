import { Router } from "express";
import { healthRouter } from "./health.routes";
import { profileRouter } from "./profile.routes";
import { projectsRouter } from "./projects.routes";
import { contactRouter } from "./contact.routes";
import { chatRouter } from "./chat.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(profileRouter);
apiRouter.use(projectsRouter);
apiRouter.use(contactRouter);
apiRouter.use(chatRouter);
