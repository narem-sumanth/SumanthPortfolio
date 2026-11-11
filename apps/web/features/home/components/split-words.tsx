"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "../lib/type-scale";

const container = {
  hidden: {},
  visible: (delay: number) => ({ transition: { staggerChildren: 0.07, delayChildren: delay } }),
};

const word = {
  hidden: { y: "112%" },
  visible: { y: "0%", transition: { duration: 0.95, ease: EASE_OUT } },
};

/**
 * A display headline whose words rise out of a mask, one after another.
 * Each entry in `lines` is its own block line. Plays when scrolled into view,
 * or — when `active` is passed — when the caller says so (the hero waits for
 * the preloader). Screen readers get the plain sentence.
 */
export function SplitWords({
  lines,
  as: Tag = "h2",
  className,
  active,
  delay = 0,
}: {
  lines: string[];
  as?: "h1" | "h2" | "p";
  className?: string;
  active?: boolean;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const text = lines.join(" ");

  if (reduceMotion) return <Tag className={className}>{text}</Tag>;

  const controlled = active !== undefined;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        variants={container}
        custom={delay}
        initial="hidden"
        animate={controlled ? (active ? "visible" : "hidden") : undefined}
        whileInView={controlled ? undefined : "visible"}
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        {lines.map((line) => (
          <span key={line} className="block">
            {line.split(" ").map((token, i) => (
              <React.Fragment key={`${token}-${i}`}>
                {/* The padding/negative-margin pair keeps commas and descenders inside the mask. */}
                <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span data-reveal className="inline-block" variants={word}>
                    {token}
                  </motion.span>
                </span>{" "}
              </React.Fragment>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
