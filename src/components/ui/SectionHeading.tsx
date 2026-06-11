import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, WordReveal } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  className?: string;
  /** Use on dark backgrounds. */
  light?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "eyebrow inline-flex items-center gap-2",
            light ? "text-seafoam" : "text-spice",
          )}
        >
          <span className="h-px w-6 bg-current opacity-50" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "max-w-3xl text-balance text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl",
          light ? "text-cream" : "text-cocoa",
        )}
      >
        {typeof title === "string" ? <WordReveal text={title} delay={0.1} /> : title}
      </h2>
      {intro && (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed sm:text-lg",
            align === "center" ? "mx-auto" : "",
            light ? "text-cream/70" : "text-cocoa-soft",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
