"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds of delay before the reveal begins. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
}

/** Fade + rise into view once, honouring prefers-reduced-motion. */
export function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its <StaggerItem> children as they enter view. */
export function Stagger({
  children,
  className,
  gap = 0.09,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : gap, delayChildren: 0.05 },
    },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE },
    },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/**
 * Reveals text word by word, each rising out of its own clipped line box.
 * Falls back to a plain fade under reduced motion.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5, delay }}
      >
        {text}
      </motion.span>
    );
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: "115%" },
    show: { y: 0, transition: { duration: 0.55, ease: EASE } },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
    >
      {text.split(" ").map((w, i, arr) => (
        // Padding/negative-margin keeps descenders inside the clip box.
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] mb-[-0.1em] align-bottom">
          <motion.span className="inline-block" variants={word}>
            {w}
          </motion.span>
          {i < arr.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}

/** A divider that draws itself in (scaleX) as it enters the viewport. */
export function GrowLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("origin-left", className)}
      initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
      whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  );
}
