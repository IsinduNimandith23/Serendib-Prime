import type { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "./motion";
import { FishMotif, Starfish } from "@/components/visual/SeaMotif";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-clay bg-sand/50">
      <FishMotif className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 opacity-15" />
      <Starfish className="pointer-events-none absolute -right-4 bottom-2 h-28 w-28 opacity-15" />
      <Container className="relative py-14 text-center sm:py-20">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          {eyebrow && (
            <span className="eyebrow inline-flex items-center gap-2 text-spice">
              <span className="h-px w-6 bg-current opacity-50" />
              {eyebrow}
              <span className="h-px w-6 bg-current opacity-50" />
            </span>
          )}
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-cocoa sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="max-w-xl text-base leading-relaxed text-cocoa-soft sm:text-lg">
              {intro}
            </p>
          )}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
