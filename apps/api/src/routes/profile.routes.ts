import { Router } from "express";
import { getAchievements, getEducation, getExperience, getProfile, getSkills } from "../controllers/profile.controller";

export const profileRouter = Router();

profileRouter.get("/profile", getProfile);
profileRouter.get("/experience", getExperience);
profileRouter.get("/skills", getSkills);
profileRouter.get("/education", getEducation);
profileRouter.get("/achievements", getAchievements);
