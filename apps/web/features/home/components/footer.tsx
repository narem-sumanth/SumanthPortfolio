"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Profile } from "@portfolio/types";
import { CONTAINER, DISPLAY_FACE, TEXT_BODY } from "../lib/type-scale";

export function Footer({ profile }: { profile: Profile | null }) {
  const ref = React.useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // The wordmark rises into place as the footer comes into view.
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  const name = profile?.name ?? "Sumanth Narem";
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="w-full overflow-hidden bg-base pt-16 text-foreground">
      <div className={`${CONTAINER} flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between ${TEXT_BODY}`}>
        <p>
          © {year} {name}
          {profile?.role ? `. ${profile.role}.` : "."}
        </p>
        <a href="#top" className="font-semibold underline-offset-4 hover:underline">
          Back to the top
        </a>
      </div>

      {/* The name, set as wide as the page — a sign-off, not a heading. */}
      <motion.p
        aria-hidden="true"
        style={reduceMotion ? undefined : { y }}
        className={`mt-10 select-none whitespace-nowrap text-center ${DISPLAY_FACE} text-[15.2vw] leading-[0.78] text-foreground`}
      >
        {name}
      </motion.p>
    </footer>
  );
}
