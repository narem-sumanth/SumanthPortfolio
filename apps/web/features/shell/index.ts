// Public API of the shell feature — app-wide chrome and infrastructure
// (header, theme, command palette, the typed API client, analytics).
// theme-toggle and command-palette-provider are internal, used only by app-chrome.
export { AppChrome } from "./components/app-chrome";
export { ThemeProvider } from "./components/theme-provider";
export { ApiProvider, useApiClient } from "./components/api-provider";
export { ScrollReveal } from "./components/scroll-reveal";
export { track, type AnalyticsEvent } from "./lib/analytics";
