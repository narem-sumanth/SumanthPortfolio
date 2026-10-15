import type { ChatAction, ChatResponse, ChatSourceOption, ChatWidget, SourceReference } from "@portfolio/types";
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

// A bare "yeah"/"sure" etc. carries no keywords of its own - treated as chitchat
// it would skip retrieval; treated literally for retrieval it matches nothing
// (an empty query scores zero against every document). Either way the model
// ends up with nothing to say and just repeats its own last question. When one
// of these follows an assistant turn, the reply is really about whatever that
// turn offered, so intent/retrieval should be driven off of that instead.
const CONTINUATION_RE =
  /^(yeah|yep|yup|ya|yes|sure|please|go ahead|sounds good|alright|ok(ay)?|do (that|it)|i'?d like that|tell me( more)?)[.!?]*$/;

function lastAssistantMessage(history: LLMMessage[]): string | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]?.role === "assistant") return history[i]?.content;
  }
  return undefined;
}

/**
 * The text intent detection and retrieval should actually run against: the
 * prior assistant turn's content when this message is just agreeing to
 * continue it, otherwise the message itself.
 */
function resolveRetrievalQuery(message: string, history: LLMMessage[]): string {
  const trimmed = message.toLowerCase().trim();
  if (!CONTINUATION_RE.test(trimmed)) return message;
  const prior = lastAssistantMessage(history);
  return prior ? `${prior} ${message}` : message;
}

function detectIntent(message: string): Intent {
  const text = message.toLowerCase().trim();
  // "hire you" is deliberately excluded - it also matches "why should I hire
  // you?", which wants a real pitch from the model, not the contact form.
  if (/\b(contact|reach out|get in touch|email me|message (you|sumanth))\b/.test(text)) {
    return "contact";
  }
  // Chitchat needs no retrieval — model replies from context alone.
  if (/^(ok(ay)?|k+|thanks?( you)?|thx|cool|nice|great|got it|sure|alright|yep|yes|no|hi|hello|hey|sounds good)[.!?]*$/.test(text)) {
    return "chitchat";
  }
  if (/\b(github|repo|repositor(y|ies))\b/.test(text)) return "github";
  if (/\b(project|projects|built|built with|built using|kubernetes|docker|terraform|deploy(ed|ment)?)\b/.test(text)) {
    return "project";
  }
  if (/\b(experience|worked|compan(y|ies)|career|job|role|background)\b/.test(text)) return "experience";
  if (/\b(skills?|technolog\w*|stack|proficient|expert|know)\b/.test(text)) return "skills";
  return "general";
}

// Randomized per-turn so ticker doesn't read identically every time.
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
  const retrievalQuery = resolveRetrievalQuery(request.message, request.history);
  const intent = detectIntent(retrievalQuery);
  const selectedSources = request.sources && request.sources.length > 0 ? request.sources : DEFAULT_SOURCES;
  const usePortfolio = selectedSources.includes("portfolio");
  const useGoogle = selectedSources.includes("google");
  const useGithub = selectedSources.includes("github");

  // Emitted right before real work starts — never on timer, never for skipped stages.
  emit({ type: "status", label: pick(QUESTION_EXTRACTOR_LABELS) });

  let documents: RetrievedDocument[] = [];
  let widget: ChatWidget | undefined;

  try {
    if (intent === "chitchat" || intent === "contact") {
      // Chitchat/contact — the model answers from conversational context and
      // system-prompt rule 10 alone; no retrieval needed.
    } else if (intent === "github") {
      if (useGithub) {
        emit({ type: "status", label: findingSourcesLabel(["github"]) });
        documents = (await searchGitHub(retrievalQuery)).documents;
      }
    } else if (intent === "project") {
// Direct lookup avoids fuzzy misses (e.g., "projects" vs "Project").
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
        githubDocs = (await searchGitHub(retrievalQuery)).documents;
      }
      documents = [...projectDocs, ...githubDocs];
    } else if (intent === "experience") {
      if (usePortfolio) {
        const experience = getExperience();
        documents = experience.map((exp) => ({
          id: `experience-${exp.id}`,
          sourceKind: "portfolio" as const,
          title: `${exp.title} at ${exp.company}`,
          // Dates line is load-bearing: the system prompt's tense check (rule
          // 1a) depends on it to tell a current role from a past one.
          content: [
            exp.summary,
            `Highlights: ${exp.highlights.join("; ")}`,
            `Technologies: ${exp.technologies.join(", ")}`,
            `Dates: ${exp.startDate} – ${exp.endDate ?? "present"}`,
          ].join("\n"),
        }));
        if (experience.length > 0) widget = { type: "experience_timeline", entries: experience };
      } else {
        documents = [];
      }
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
      documents = (await searchPortfolio(retrievalQuery)).documents;
    }

    if (useGoogle && intent !== "chitchat" && intent !== "contact") {
      emit({ type: "status", label: "Searching the web via Google" });
      documents = [...documents, ...(await searchWeb(retrievalQuery))];
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
// Reasoning model may spend budget on internal thoughts — silent retry avoids blank bubble.
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

  // Placeholders aren't real sources — shown in context but not cited.
  const citableDocuments = documents.filter((doc) => !doc.title.toUpperCase().includes("PLACEHOLDER"));
  const sources = dedupeSources(citableDocuments.map(toSourceReference));

  // Model may emit no visible tokens — never surface blank bubble.
  const trimmedAnswer = answer.trim().length > 0
    ? answer
    : "Sorry, I wasn't able to put together an answer that time - please try asking again.";

  // Model ignores "no em dash" rule — enforce locally.
  const finalAnswer = trimmedAnswer.replace(/—/g, "-");

  // Extract AI-generated follow-up suggestions
  const { answer: cleanAnswer, followUps } = extractFollowUps(finalAnswer);

  // The form itself is a UI affordance, not something the model should have to
  // ask for in prose - attach it whenever the visitor's turn was contact-shaped.
  const actions: ChatAction[] | undefined =
    intent === "contact" ? [{ type: "show_contact_form", label: "Contact Sumanth" }] : undefined;

  logger.info({ intent, sources: selectedSources, documents: documents.length }, "Chat pipeline completed");
  emit({ type: "done", data: { answer: cleanAnswer, sources, suggestions: followUps, widget, actions } });
}

function dedupeSources(sources: SourceReference[]): SourceReference[] {
  const seen = new Map<string, SourceReference>();
  for (const s of sources) seen.set(s.id, s);
  return [...seen.values()].slice(0, 8);
}

export { getProject };
