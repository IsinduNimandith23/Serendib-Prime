import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

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
          "max-w-2xl text-balance text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-[2.75rem]",
          light ? "text-cream" : "text-cocoa",
        )}
      >
        {title}
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
