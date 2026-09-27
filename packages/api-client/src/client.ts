import type {
  Achievement,
  ChatRequest,
  ChatStreamEvent,
  ContactRequest,
  ContactResponse,
  EducationEntry,
  ExperienceEntry,
  HealthResponse,
  Profile,
  Project,
  Skill,
} from "@portfolio/types";

export interface PortfolioApiClientOptions {
  baseUrl: string;
}

/**
 * Thin typed client over the API contract in packages/types. Deliberately
 * unaware of which backend implementation is serving requests — only the
 * base URL differs between environments (NEXT_PUBLIC_API_URL).
 */
export function createApiClient({ baseUrl }: PortfolioApiClientOptions) {
  const url = (path: string) => `${baseUrl.replace(/\/$/, "")}${path}`;

  async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(url(path));
    if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`);
    return (await res.json()) as T;
  }

  return {
    health: () => getJson<HealthResponse>("/api/health"),
    getProfile: () => getJson<Profile>("/api/profile"),
    getProjects: () => getJson<Project[]>("/api/projects"),
    getExperience: () => getJson<ExperienceEntry[]>("/api/experience"),
    getSkills: () => getJson<Skill[]>("/api/skills"),
    getEducation: () => getJson<EducationEntry[]>("/api/education"),
    getAchievements: () => getJson<Achievement[]>("/api/achievements"),

    async submitContact(payload: ContactRequest): Promise<ContactResponse> {
      const res = await fetch(url("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Failed to send message.");
      return body as ContactResponse;
    },

    /**
     * Streams a chat turn over SSE, invoking `onEvent` for each parsed event.
     * Returns a function to abort the underlying request.
     */
    streamChat(request: ChatRequest, onEvent: (event: ChatStreamEvent) => void): () => void {
      const controller = new AbortController();

      const doFetch = () =>
        fetch(url("/api/chat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

      (async () => {
        try {
          let res: Response;
          try {
            res = await doFetch();
          } catch {
            if (controller.signal.aborted) return;
            // A momentarily unreachable server (e.g. a fresh dev/cold start still
            // finishing its boot) surfaces as a bare network-level failure —
            // retry once after a short delay before treating it as a real outage.
            await new Promise((resolve) => setTimeout(resolve, 800));
            if (controller.signal.aborted) return;
            res = await doFetch();
          }

          if (!res.ok || !res.body) {
            const body = await res.json().catch(() => ({}));
            onEvent({ type: "error", message: body?.error ?? "The chat service is unavailable right now." });
            return;
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const parts = buffer.split("\n\n");
            buffer = parts.pop() ?? "";
            for (const part of parts) {
              const line = part.split("\n").find((l) => l.startsWith("data:"));
              if (!line) continue;
              const json = line.slice(5).trim();
              if (!json) continue;
              try {
                onEvent(JSON.parse(json) as ChatStreamEvent);
              } catch {
                // Ignore malformed frames rather than breaking the stream.
              }
            }
          }
        } catch (err) {
          if (controller.signal.aborted) return;
          // A raw fetch-level failure (TypeError) has a technical, unfriendly
          // message like "Failed to fetch" — never show that verbatim.
          const message =
            err instanceof TypeError
              ? "Lost connection to the AI service. Please try again."
              : err instanceof Error
                ? err.message
                : "Lost connection to the AI service.";
          onEvent({ type: "error", message });
        }
      })();

      return () => controller.abort();
    },
  };
}

export type PortfolioApiClient = ReturnType<typeof createApiClient>;
