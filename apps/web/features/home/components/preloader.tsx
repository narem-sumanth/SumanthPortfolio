"use client";

import * as React from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { DISPLAY_FACE, TEXT_BODY } from "../lib/type-scale";
import { useIntro } from "./intro-provider";

/** The page loads the way its subject works: built, tested, shipped, live. */
const STAGES = ["Build", "Test", "Ship", "Live"] as const;

const WIPE_EASE = [0.76, 0, 0.24, 1] as const;
const WIPE_SECONDS = 0.95;
const FOLLOW_DELAY_SECONDS = 0.16;

type Phase = "loading" | "leaving" | "gone";

function stageFor(progress: number): number {
  if (progress >= 100) return 3;
  if (progress >= 62) return 2;
  if (progress >= 30) return 1;
  return 0;
}

/**
 * Full-screen loading curtain. Server-rendered so it covers the page from the
 * first paint; the counter runs to 85 on a timer, then waits on the real
 * webfont load before finishing, and the curtain wipes upward — a green panel
 * first, a white panel chasing it — to reveal the hero.
 */
export function Preloader({ name, role }: { name: string; role: string }) {
  const { markReady } = useIntro();
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [stage, setStage] = React.useState(0);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const countRef = React.useRef<HTMLSpanElement>(null);
  const progress = useMotionValue(0);
  const barScale = useTransform(progress, (value) => value / 100);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(reduced);

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));
    const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

    const unsubscribe = progress.on("change", (value) => {
      if (countRef.current) countRef.current.textContent = String(Math.round(value));
      setStage(stageFor(value));
    });

    let controls: ReturnType<typeof animate> | undefined;

    async function run() {
      if (reduced) {
        await Promise.all([fontsReady, wait(300)]);
        if (cancelled) return;
        progress.set(100);
      } else {
        controls = animate(progress, 85, { duration: 1.25, ease: [0.3, 0, 0.2, 1] });
        await Promise.all([controls, fontsReady]);
        if (cancelled) return;
        controls = animate(progress, 100, { duration: 0.4, ease: "easeOut" });
        await controls;
        if (cancelled) return;
        await wait(380);
        if (cancelled) return;
      }

      root.style.overflow = previousOverflow;
      setPhase("leaving");
      timers.push(window.setTimeout(markReady, reduced ? 0 : 280));
      timers.push(
        window.setTimeout(() => setPhase("gone"), reduced ? 350 : (WIPE_SECONDS + FOLLOW_DELAY_SECONDS) * 1000 + 80),
      );
    }
    void run();

    return () => {
      cancelled = true;
      controls?.stop();
      unsubscribe();
      timers.forEach((id) => window.clearTimeout(id));
      root.style.overflow = previousOverflow;
      progress.set(0);
    };
    // Runs once on mount: progress is a stable motion value and markReady only flips a flag.
  }, []);

  if (phase === "gone") return null;

  const leaving = phase === "leaving";
  // -116% clears the panel plus the curved skirt hanging below it.
  const lifted = reduceMotion ? { opacity: 0 } : { y: "-116%" };

  return (
    <div className="preloader fixed inset-0 z-[100]" role="status" aria-label="Loading portfolio">
      {/* Without JavaScript nothing would ever lift the curtain or run the entrances. */}
      <noscript>
        <style>{`.preloader{display:none}[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      {/* White panel — chases the green panel up, so the reveal is a two-colour wipe. */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0 bg-accent"
          initial={false}
          animate={leaving ? lifted : { y: 0 }}
          transition={{ duration: WIPE_SECONDS, delay: FOLLOW_DELAY_SECONDS, ease: WIPE_EASE }}
          aria-hidden="true"
        >
          <div className="absolute left-[-10%] top-[calc(100%-1px)] h-[14vh] w-[120%] rounded-b-[100%] bg-accent" />
        </motion.div>
      )}

      <motion.div
        className="absolute inset-0 flex flex-col justify-between bg-base p-5 text-foreground sm:p-10"
        initial={false}
        animate={leaving ? lifted : { y: 0, opacity: 1 }}
        transition={reduceMotion ? { duration: 0.3 } : { duration: WIPE_SECONDS, ease: WIPE_EASE }}
      >
        <div
          className="absolute left-[-10%] top-[calc(100%-1px)] h-[14vh] w-[120%] rounded-b-[100%] bg-base"
          aria-hidden="true"
        />

        <div className={`flex items-baseline justify-between gap-6 ${TEXT_BODY}`}>
          <span className="font-semibold">{name}</span>
          <span className="hidden text-foreground-muted sm:block">{role}</span>
        </div>

        <div className={`flex items-end justify-between gap-6 pb-4 ${DISPLAY_FACE} text-[clamp(4rem,17vw,16rem)]`} aria-hidden="true">
          {/* Clips vertically only: the outgoing word is taken out of flow, so the box is only as wide as the incoming one. */}
          <span className="relative block [overflow-y:clip]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={stage}
                className={`block ${stage === 3 ? "text-accent" : ""}`}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease: WIPE_EASE }}
              >
                {STAGES[stage]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="tabular-nums">
            <span ref={countRef}>0</span>
          </span>
        </div>

        {/* Progress fill — the same value the counter reads. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-2 origin-left bg-accent"
          style={{ scaleX: barScale }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
