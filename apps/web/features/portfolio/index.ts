// Public API of the portfolio feature — safe (never-throwing) fetchers for
// the portfolio dataset served by apps/api, consumed by the home route.
export {
  getProfileSafe,
  getExperienceSafe,
  getSkillsSafe,
  getProjectsSafe,
  getEducationSafe,
  getAchievementsSafe,
} from "./lib/serverApi";

// Portfolio feature components
export { HeroSection, ProjectCarousel, ServicesSection } from "./components";