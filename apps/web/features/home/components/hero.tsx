"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Profile } from "@portfolio/types";
import { useChatPanel } from "@/features/chat";
import { sentenceLines, splitLeadSentence } from "../lib/format";
import { CONTAINER, DISPLAY_FACE, EASE_OUT, TEXT_BODY, TEXT_DISPLAY, TEXT_LEAD } from "../lib/type-scale";
import { useIntro } from "./intro-provider";
import { Magnetic } from "./magnetic";
import { SplitWords } from "./split-words";

const FALLBACK_TAGLINE = "Writes the code. Runs the cluster.";
const FALLBACK_LEAD =
  "I'm a senior software developer and junior DevOps engineer: I build the product end to end, then ship and run it.";

const STARTER_QUESTIONS = [
  "What does Sumanth do at Rever?",
  "How does he ship to Kubernetes?",
  "What is he learning right now?",
];

export function Hero({ profile }: { profile: Profile | null }) {
  const { ready } = useIntro();
  const { ask, open } = useChatPanel();
  const reduceMotion = useReducedMotion();
  const [question, setQuestion] = React.useState("");

  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The headline drifts up faster than the page as the hero scrolls away.
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const detailOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const lines = sentenceLines(profile?.tagline ?? FALLBACK_TAGLINE);
  const lead = profile?.bio ? splitLeadSentence(profile.bio).lead : FALLBACK_LEAD;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = question.trim();
    if (trimmed) {
      ask(trimmed);
      setQuestion("");
    } else {
      open();
    }
  }

  const rise = (delay: number) => ({
    "data-reveal": true,
    initial: reduceMotion ? false : ({ opacity: 0, y: 28 } as const),
    animate: ready || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 0.9, delay, ease: EASE_OUT },
  });

  return (
    <section id="top" ref={ref} className="relative flex min-h-svh w-full flex-col justify-between overflow-hidden pb-10 pt-40 md:pt-32">
      <motion.div className={CONTAINER} style={reduceMotion ? undefined : { y: headlineY }}>
        <SplitWords
          as="h1"
          lines={lines}
          active={ready}
          className={`${DISPLAY_FACE} ${TEXT_DISPLAY} text-balance text-foreground`}
        />
      </motion.div>

      <motion.div
        className={`${CONTAINER} mt-14 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12 lg:items-end`}
        style={reduceMotion ? undefined : { opacity: detailOpacity }}
      >
        <motion.p {...rise(0.45)} className={`${TEXT_LEAD} font-medium leading-[1.3] text-foreground lg:col-span-6`}>
          {lead}
        </motion.p>

        {/* The one working thing on the page: a question here opens the AI twin with it already asked. */}
        <motion.div {...rise(0.6)} className="lg:col-span-5 lg:col-start-8">
          <form onSubmit={handleSubmit}>
            <label htmlFor="hero-question" className={`mb-3 block ${TEXT_BODY} font-semibold text-foreground`}>
              Ask my AI twin. It answers from my real work history.
            </label>
            <div className="flex items-center gap-2 rounded-2xl bg-elevated p-2 transition-colors focus-within:bg-raised">
              <input
                id="hero-question"
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="How does he deploy to AWS?"
                autoComplete="off"
                className={`min-w-0 flex-1 bg-transparent px-4 py-3 ${TEXT_BODY} text-foreground placeholder:text-foreground-subtle focus:outline-none`}
              />
              <Magnetic strength={0.25}>
                <button
                  type="submit"
                  aria-label="Ask the AI twin"
                  className="group flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-200 active:scale-95"
                >
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </Magnetic>
            </div>
          </form>

          <ul className={`mt-4 flex flex-col items-start gap-1 ${TEXT_BODY}`}>
            {STARTER_QUESTIONS.map((starter) => (
              <li key={starter}>
                <button
                  type="button"
                  onClick={() => ask(starter)}
                  className="group flex items-center gap-2 py-1 text-left text-foreground-muted transition-colors hover:text-accent"
                >
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  {starter}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
