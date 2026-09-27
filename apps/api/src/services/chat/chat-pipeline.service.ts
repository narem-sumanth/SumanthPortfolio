import type { ChatResponse, ChatSourceOption, SourceReference } from "@portfolio/types";
import { portfolioRepository } from "../../repositories/portfolio.repository";
import type { RetrievedDocument } from "../retrieval/types";
import { logger } from "../../utils/logger";
import { llmProvider, type LLMMessage } from "./providers";
import { buildSystemPrompt } from "./system-prompt";
import {
  getExperience,
  getProject,
  getProjects,
  getSkills,
  searchGitHub,
  searchPortfolio,
  searchWeb,
  toSourceReference,
} from "./chat-tools.service";

const DEFAULT_SOURCES: ChatSourceOption[] = ["portfolio", "github"];

export type ActivityEvent = { type: "status"; label: string };
export type TokenEvent = { type: "token"; value: string };
export type DoneEvent = { type: "done"; data: ChatResponse };
export type ErrorEvent = { type: "error"; message: string };
export type PipelineEvent = ActivityEvent | TokenEvent | DoneEvent | ErrorEvent;

type Intent = "project" | "github" | "experience" | "skills" | "contact" | "chitchat" | "general";

function detectIntent(message: string): Intent {
  const text = message.toLowerCase().trim();
  if (/\b(contact|reach out|get in touch|email me|message (you|sumanth)|hire me to)\b/.test(text) &&
    /\b(contact|reach out|touch|message)\b/.test(text)) {
    return "contact";
  }
  // A short acknowledgment/greeting needs no retrieval — the model can reply
  // from conversational continuity alone, so skip the search/fetch theater.
  if (/^(ok(ay)?|k+|thanks?( you)?|thx|cool|nice|great|got it|sure|alright|yep|yes|no|hi|hello|hey|sounds good)[.!?]*$/.test(text)) {
    return "chitchat";
  }
  if (/\b(github|repo|repositor(y|ies))\b/.test(text)) return "github";
  if (/\b(project|projects|built|built with|built using|kubernetes|docker|terraform|deploy(ed|ment)?)\b/.test(text)) {
    return "project";
  }
  if (/\b(experience|work(ed)?|compan(y|ies)|career|job|role)\b/.test(text)) return "experience";
  if (/\b(skill|technolog|stack|proficient|expert|know)\b/.test(text)) return "skills";
  return "general";
}

// A few honest, varied phrasings per stage — picked at random each turn so
// the ticker doesn't read identically every time. Each is only emitted right
// before the real work it describes actually starts, never on a timer.
const QUESTION_EXTRACTOR_LABELS = ["Understanding your question", "Reading your message", "Parsing what you're asking"];
const PREPARING_RESPONSE_LABELS = ["Preparing your answer", "Putting the response together", "Finalizing the answer"];

const SOURCE_TAGS: Record<ChatSourceOption, string> = {
  portfolio: "Portfolio",
  github: "GitHub",
  google: "Google",
};

function pick(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)] as string;
}

/** Only names the sources actually enabled for this turn — never claims to search a disabled one. */
function findingSourcesLabel(selectedSources: ChatSourceOption[]): string {
  const tags = selectedSources.map((s) => SOURCE_TAGS[s]).filter(Boolean);
  if (tags.length === 0) return "Finding sources";
  if (tags.length === 1) return `Searching ${tags[0]}`;
  if (tags.length === 2) return `Searching ${tags[0]} and ${tags[1]}`;
  return `Searching ${tags.slice(0, -1).join(", ")}, and ${tags.at(-1)}`;
}

function extractFollowUps(answer: string): { answer: string; followUps: string[] } {
  const match = answer.match(/__FOLLOWUPS__\[(.+?)\]/);
  if (!match) return { answer, followUps: [] };
  try {
    const followUps = JSON.parse(`[${match[1]}]`);
    const cleanAnswer = answer.replace(/__FOLLOWUPS__\[.+?\]/, "").trim();
    return { answer: cleanAnswer, followUps };
  } catch {
    return { answer, followUps: [] };
  }
}

export interface PipelineRequest {
  message: string;
  history: LLMMessage[];
  /** Sources the visitor opted into (see the chat input's source picker). Defaults to portfolio-only. */
  sources?: ChatSourceOption[];
}

/**
 * Orchestrates one chat turn: intent detection → tool calls → activity
 * events → grounded LLM generation → structured response. This is the seam
 * a future FastAPI (or any other) backend implementation must replicate.
 */
export async function runChatPipeline(request: PipelineRequest, emit: (event: PipelineEvent) => void): Promise<void> {
  const intent = detectIntent(request.message);
  const selectedSources = request.sources && request.sources.length > 0 ? request.sources : DEFAULT_SOURCES;
  const usePortfolio = selectedSources.includes("portfolio");
  const useGoogle = selectedSources.includes("google");
  const useGithub = selectedSources.includes("github");

  // Every status below is emitted immediately before the real work it names -
  // never on a fixed timer, and never for a stage that isn't actually happening
  // (e.g. no "searching" status when an intent only needs a direct, synchronous
  // portfolio lookup with nothing to search).
  emit({ type: "status", label: pick(QUESTION_EXTRACTOR_LABELS) });

  if (intent === "contact") {
    emit({ type: "status", label: pick(PREPARING_RESPONSE_LABELS) });
    const data: ChatResponse = {
      answer: "Sure - you can leave your name, email, and message right here and I'll make sure Sumanth receives it.",
      sources: [],
      actions: [{ type: "show_contact_form", label: "Contact Sumanth" }],
    };
    emit({ type: "done", data });
    return;
  }

  let documents: RetrievedDocument[] = [];

  try {
    if (intent === "chitchat") {
      // Nothing to search - reply from conversational continuity alone.
    } else if (intent === "github") {
      if (useGithub) {
        emit({ type: "status", label: findingSourcesLabel(["github"]) });
        documents = (await searchGitHub(request.message)).documents;
      }
    } else if (intent === "project") {
      // Pull the full verified project list directly (like experience/skills below) rather
      // than relying on fuzzy keyword search, which can miss real projects entirely on a
      // plural/singular mismatch (e.g. "projects" never matching a doc titled "Project").
      const projectDocs: RetrievedDocument[] = usePortfolio
        ? getProjects().map((p) => ({
            id: `project-${p.id}`,
            sourceKind: "portfolio" as const,
            title: p.name,
            content: `${p.description}\nTechnologies: ${p.technologies.join(", ")}\nTopics: ${p.topics.join(", ")}`,
            url: p.github,
          }))
        : [];
      let githubDocs: RetrievedDocument[] = [];
      if (useGithub) {
        emit({ type: "status", label: findingSourcesLabel(["github"]) });
        githubDocs = (await searchGitHub(request.message)).documents;
      }
      documents = [...projectDocs, ...githubDocs];
    } else if (intent === "experience") {
      documents = usePortfolio
        ? getExperience().map((exp) => ({
            id: `experience-${exp.id}`,
            sourceKind: "portfolio" as const,
            title: `${exp.title} at ${exp.company}`,
            content: `${exp.summary}\nHighlights: ${exp.highlights.join("; ")}\nTechnologies: ${exp.technologies.join(", ")}`,
          }))
        : [];
    } else if (intent === "skills") {
      if (usePortfolio) {
        const skills = getSkills();
        documents = [
          {
            id: "skills",
            sourceKind: "portfolio",
            title: "Skills",
            content: skills.map((s) => `${s.name} (${s.category}, ${s.proficiency ?? "n/a"})`).join(", "),
          },
        ];
      }
    } else if (usePortfolio) {
      emit({ type: "status", label: findingSourcesLabel(["portfolio"]) });
      documents = (await searchPortfolio(request.message)).documents;
    }

    if (useGoogle && intent !== "chitchat") {
      emit({ type: "status", label: "Searching the web via Google" });
      documents = [...documents, ...(await searchWeb(request.message))];
    }
  } catch (err) {
    logger.error({ err, intent, sources: selectedSources }, "Chat pipeline retrieval failed");
    emit({ type: "error", message: "I couldn't reach one of my knowledge sources right now. Please try again." });
    return;
  }

  emit({ type: "status", label: pick(PREPARING_RESPONSE_LABELS) });

  const contextBlock = documents.map((doc) => `### ${doc.title}\n${doc.content}`).join("\n\n");
  const profile = portfolioRepository.getProfile();
  const messages: LLMMessage[] = [
    { role: "system", content: buildSystemPrompt(profile, contextBlock, selectedSources) },
    ...request.history.slice(-6),
    { role: "user", content: request.message },
  ];

  let answer = "";
  try {
    // A reasoning model can occasionally spend its whole token budget on internal
    // reasoning and come back with zero visible content. When that happens nothing
    // has been shown to the visitor yet (no tokens were emitted), so silently
    // retrying once is safe and invisible - far better than surfacing a dead-end
    // "please try asking again" that makes the visitor do the retry by hand.
    const MAX_ATTEMPTS = 2;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      let attemptAnswer = "";
      for await (const tokenChunk of llmProvider.streamCompletion(messages)) {
        attemptAnswer += tokenChunk;
        emit({ type: "token", value: tokenChunk });
      }
      if (attemptAnswer.trim().length > 0) {
        answer = attemptAnswer;
        break;
      }
      if (attempt < MAX_ATTEMPTS - 1) {
        logger.warn({ attempt, provider: llmProvider.name }, "Empty LLM response, retrying");
      }
    }
  } catch (err) {
    logger.error({ err, provider: llmProvider.name }, "Chat pipeline LLM completion failed");
    emit({ type: "error", message: "I couldn't reach the AI model right now. Please try again in a moment." });
    return;
  }

  // A placeholder entry is a stub, not verified grounding data — the model may still see it
  // in <context> (so it can honestly say "not filled in yet"), but it shouldn't be cited as
  // a source, since nothing real was actually drawn from it.
  const citableDocuments = documents.filter((doc) => !doc.title.toUpperCase().includes("PLACEHOLDER"));
  const sources = dedupeSources(citableDocuments.map(toSourceReference));

  // A reasoning model can occasionally exhaust its token budget on internal
  // reasoning and emit no visible content — never surface a blank bubble.
  const trimmedAnswer = answer.trim().length > 0
    ? answer
    : "Sorry, I wasn't able to put together an answer that time - please try asking again.";

  // The model doesn't always obey the "no em dash" style rule (rule 11) — enforce it
  // deterministically rather than relying on the prompt alone.
  const finalAnswer = trimmedAnswer.replace(/—/g, "-");

  // Extract AI-generated follow-up suggestions
  const { answer: cleanAnswer, followUps } = extractFollowUps(finalAnswer);

  logger.info({ intent, sources: selectedSources, documents: documents.length }, "Chat pipeline completed");
  emit({ type: "done", data: { answer: cleanAnswer, sources, suggestions: followUps } });
}

function dedupeSources(sources: SourceReference[]): SourceReference[] {
  const seen = new Map<string, SourceReference>();
  for (const s of sources) seen.set(s.id, s);
  return [...seen.values()].slice(0, 8);
}

export { getProject };
