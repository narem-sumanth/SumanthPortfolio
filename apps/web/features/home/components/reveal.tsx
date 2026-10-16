"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Entrance for the parts of a section: rises 20px with opacity, triggered once
 * as it enters the viewport. `prefers-reduced-motion` drops the travel but
 * keeps the content visible immediately (useReducedMotion, not CSS alone,
 * since Motion's inline transforms would otherwise override the global rule).
 */
export function Reveal({
  children,
  delay = 0,
  as: Component = "div",
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "span" | "li";
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduceMotion = useReducedMotion();
  const MotionComponent = motion[Component];

  if (reduceMotion) {
    const Static = Component;
    return (
      <Static className={className} style={style}>
        {children}
      </Static>
    );
  }

  return (
    <MotionComponent
      className={className}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </MotionComponent>
  );
}
