"use client";

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { Skill } from "@portfolio/types";
import { DISPLAY_FACE, TEXT_HEADING } from "../lib/type-scale";

/** Percent of the (doubled) track travelled per second at rest. */
const BASE_SPEED = -0.9;

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/**
 * The whole stack as one running line. It drifts on its own, and the page's
 * scroll velocity pushes it: scroll faster and it speeds up, scroll back up
 * and it reverses.
 */
export function StackMarquee({ skills }: { skills: Skill[] }) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = React.useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    const step = direction.current * BASE_SPEED * (delta / 1000);
    baseX.set(baseX.get() + step + step * Math.abs(factor));
  });

  if (skills.length === 0) return null;

  const run = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {skills.map((skill) => (
        <li key={skill.id} className="flex items-center whitespace-nowrap">
          <span className="px-[0.35em]">{skill.name}</span>
          <span className="h-[0.22em] w-[0.22em] bg-foreground" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    // A raised green strip with white words: still its own band at the foot of the green hero,
    // without introducing a third colour.
    <section
      aria-label="Technologies in the stack"
      className={`w-full overflow-hidden bg-raised py-5 text-foreground md:py-7 ${DISPLAY_FACE} ${TEXT_HEADING}`}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {run(false)}
        {run(true)}
      </motion.div>
    </section>
  );
}
