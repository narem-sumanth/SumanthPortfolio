/**
 * Analytics abstraction — no vendor wired up yet. Swap the implementation of
 * `track` for a real provider later without touching call sites.
 */
export type AnalyticsEvent =
  | "chat_started"
  | "question_submitted"
  | "project_opened"
  | "github_clicked"
  | "live_demo_clicked"
  | "contact_started"
  | "contact_submitted"
  | "portfolio_mode_opened";

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, properties ?? {});
  }
}
