"use client";

import type { ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Card surface with a soft radial glow that follows the cursor.
 * Mouse-only and inert under reduced motion. The glow layer uses
 * `rounded-[inherit]`, so pass the card radius via `className`.
 */
export function SpotlightCard({
  children,
  className,
  /** Spotlight tint as an `R G B` triple. Defaults to the teal accent. */
  rgb = "34 155 167",
}: {
  children: ReactNode;
  className?: string;
  rgb?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, rgb(${rgb} / 0.12), transparent 70%)`;

  function handlePointer(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    opacity.set(1);
  }

  return (
    <div
      className={cn("group relative", className)}
      onPointerMove={handlePointer}
      onPointerLeave={() => opacity.set(0)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ background, opacity }}
      />
      {children}
    </div>
  );
}
