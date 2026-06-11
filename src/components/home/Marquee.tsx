"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { IconSparkle } from "@/components/icons";

const ITEMS = [
  "100% Sri Lankan sprats",
  "No preservatives",
  "Ready in 2 minutes",
  "Rich in protein",
  "Islandwide delivery",
  "Authentic island recipes",
  "Sealed at peak freshness",
];

/** % per second the strip drifts. */
const BASE_VELOCITY = 2;

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/** Marquee that drifts left at a constant speed. Static under reduced motion. */
export function Marquee() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);

  // The row holds two copies, so wrapping at -50% loops seamlessly.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    baseX.set(baseX.get() - BASE_VELOCITY * (delta / 1000));
  });

  return (
    <div className="overflow-hidden border-y border-clay bg-sand/70 py-4">
      <motion.div className="flex w-max items-center gap-8" style={{ x }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-8">
                <span className="whitespace-nowrap font-display text-lg text-cocoa/80">
                  {item}
                </span>
                <IconSparkle className="h-4 w-4 shrink-0 text-gold" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
