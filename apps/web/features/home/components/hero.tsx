"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import type { ExperienceEntry, Profile, Project, Skill } from "@portfolio/types";
import { useChatPanel } from "@/features/chat";
import { AnimatedCounter } from "./animated-counter";
import { HEADLINE_FACE, TEXT_BODY, TEXT_PAGE_HEADLINE, TEXT_SMALL } from "../lib/type-scale";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-elevated hover:text-foreground"
    >
      {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

const lineVariants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({
  profile,
  experience,
  skills,
  projects,
}: {
  profile: Profile | null;
  experience: ExperienceEntry[];
  skills: Skill[];
  projects: Project[];
}) {
  const reduceMotion = useReducedMotion();
  const { open } = useChatPanel();
  const name = profile?.name ?? "Sumanth Narem";
  const firstName = name.split(" ")[0];

  const stats = [
    { value: projects.length, label: "Shipped projects" },
    { value: skills.length, label: "Skills" },
    { value: experience.length, label: "Roles" },
  ].filter((s) => s.value > 0);

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 sm:px-10">
        <span className={`${TEXT_BODY} font-semibold tracking-tight text-foreground`}>{name}</span>
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 pb-16 pt-20 sm:px-10 md:pb-24 md:pt-10">
        <h1 className={`max-w-3xl ${TEXT_PAGE_HEADLINE} ${HEADLINE_FACE} text-foreground`}>
          {["Full-stack engineer.", "AI-first, by design."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                custom={i}
                initial={reduceMotion ? undefined : "hidden"}
                animate="visible"
                variants={lineVariants}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-6 max-w-xl ${TEXT_BODY} text-foreground-muted`}
        >
          From infrastructure to applied AI. Ask {firstName}&rsquo;s AI twin anything — it only answers from
          verified, version-controlled data, never a guess.
        </motion.p>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            onClick={open}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent/90"
          >
            Ask the AI
          </button>
          <a
            href="#work"
            className="rounded-md px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-elevated"
          >
            View my work
          </a>
        </motion.div>

        {stats.length > 0 && (
          <motion.dl
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-16 grid max-w-xl grid-cols-3 gap-6 rounded-md bg-elevated p-6 sm:p-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dd className={`text-4xl ${HEADLINE_FACE} text-foreground`}>
                  <AnimatedCounter value={stat.value} />
                </dd>
                <dt className={`${TEXT_SMALL} text-foreground-muted`}>{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        )}
      </div>
    </section>
  );
}
