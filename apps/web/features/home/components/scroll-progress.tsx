"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** A thin, fixed reading-progress bar — a real reflection of scroll position, not a looping decoration. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 32, mass: 0.2 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
