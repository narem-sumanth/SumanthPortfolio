"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Counts up to a real value once it scrolls into view — never a canned animation on fake data. */
export function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = React.useState(reduceMotion ? value : 0);

  React.useEffect(() => {
    if (!inView || reduceMotion) return;
    const duration = 900;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {display}
    </span>
  );
}
