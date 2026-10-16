// Public API of the shell feature — app-wide chrome and infrastructure
// (theme, command palette, the typed API client, analytics).
// command-palette-provider is internal, used only by app-chrome. The theme
// toggle itself lives in features/home/components/hero.tsx — the hero is the
// page's only nav-like chrome, so it owns the one theme control too.
export { AppChrome } from "./components/app-chrome";
export { ThemeProvider } from "./components/theme-provider";
export { ApiProvider, useApiClient } from "./components/api-provider";
export { track, type AnalyticsEvent } from "./lib/analytics";
