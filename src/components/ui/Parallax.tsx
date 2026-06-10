"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Subtle vertical parallax driven by the element's position in the viewport.
 * Transform-only (GPU friendly) and fully disabled under reduced-motion.
 *
 * @param speed  px of travel across the full scroll-through (positive = moves down).
 */
export function Parallax({
  children,
  className,
  speed = 60,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
