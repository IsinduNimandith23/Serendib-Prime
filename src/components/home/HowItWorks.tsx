"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Parallax } from "@/components/ui/Parallax";
import { FishMotif, Starfish } from "@/components/visual/SeaMotif";

const STEPS = [
  {
    n: "01",
    title: "Open the tin",
    text: "Pop the lid - everything inside is already slow-cooked, seasoned and sealed at its peak.",
    tip: "Ring-pull lid - no can opener needed.",
    image: "/tempered-sprats.jpg",
    alt: "A tin of Serendib Prime Tempered Sprats, ready to open",
  },
  {
    n: "02",
    title: "Heat for two minutes",
    text: "Warm it in a pan or microwave until it's gently bubbling - no marinating, no simmering.",
    tip: "Pan-fry for extra crisp, or microwave right in a bowl.",
    image: "/values/no-preservatives.jpg",
    alt: "Curry warming in a copper pan",
  },
  {
    n: "03",
    title: "Plate up & eat",
    text: "Serve with steaming rice or warm bread, and taste home in every spoonful.",
    tip: "Best over steaming rice with a squeeze of lime.",
    image: "/values/ready-in-minutes.jpg",
    alt: "A plated curry served with flatbread",
  },
];

// Gentle sine wave spanning the step row - the "ocean current" the steps ride.
const CURRENT_PATH =
  "M0 60 C75 24 150 24 225 60 C300 96 375 96 450 60 C525 24 600 24 675 60 C750 96 825 96 900 60 C975 24 1050 24 1125 60 C1150 48 1175 46 1200 52";

export function HowItWorks() {
  const reduce = useReducedMotion();

  // The current draws itself in as the step row scrolls into view.
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 0.92", "start 0.35"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const fishOpacity = useTransform(drawn, [0.8, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Ocean backdrop: soft seafoam glows over the sand surface */}
      <div
        aria-hidden
        className="grain absolute inset-0 bg-sand/60"
        style={{
          background:
            "radial-gradient(70% 55% at 12% 15%, rgb(143 214 222 / 0.22) 0%, transparent 60%), radial-gradient(60% 50% at 90% 85%, rgb(34 155 167 / 0.14) 0%, transparent 60%), var(--color-sand)",
        }}
      />

      {/* Drifting sea life */}
      <Parallax speed={40} className="pointer-events-none absolute -left-10 top-24">
        <FishMotif className="h-36 w-36 -scale-x-100 opacity-[0.08]" />
      </Parallax>
      <Parallax speed={-32} className="pointer-events-none absolute -right-8 bottom-16">
        <Starfish className="h-32 w-32 opacity-[0.08]" />
      </Parallax>
      <Parallax speed={24} className="pointer-events-none absolute right-[12%] top-12 hidden lg:block">
        <FishMotif className="h-14 w-14 rotate-6 opacity-10" />
      </Parallax>

      {/* Rising bubbles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {[
          { left: "8%", top: "30%", size: "h-3 w-3", delay: "0s" },
          { left: "16%", top: "70%", size: "h-2 w-2", delay: "1.6s" },
          { left: "88%", top: "26%", size: "h-2.5 w-2.5", delay: "0.8s" },
          { left: "94%", top: "58%", size: "h-2 w-2", delay: "2.4s" },
          { left: "52%", top: "18%", size: "h-2 w-2", delay: "3.1s" },
        ].map((b, i) => (
          <span
            key={i}
            className={`absolute ${b.size} animate-float rounded-full border border-seafoam/50 bg-seafoam/15`}
            style={{ left: b.left, top: b.top, animationDelay: b.delay }}
          />
        ))}
      </div>

      <Container className="relative">
        <SectionHeading
          eyebrow="How it works"
          title="Open. Heat. Eat."
          intro="Everything in the tin is fully cooked, so dinner is three easy steps and two minutes away."
        />

        <div ref={rowRef} className="relative mt-14">
          {/* The ocean current: a faint dashed route with a teal line that
             swims across it as you scroll, a little fish arriving at the end. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[34%] hidden h-24 -translate-y-1/2 md:block"
          >
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              fill="none"
              className="h-full w-full"
            >
              <path
                d={CURRENT_PATH}
                stroke="var(--color-clay)"
                strokeWidth="2"
                strokeDasharray="2 8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={CURRENT_PATH}
                stroke="var(--color-leaf)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: reduce ? 1 : drawn }}
              />
            </svg>
            <motion.div
              style={{ opacity: reduce ? 1 : fishOpacity }}
              className="absolute -right-3 top-[38%] -translate-y-1/2"
            >
              <FishMotif className="h-9 w-9 animate-float" />
            </motion.div>
          </div>

          <Stagger className="relative grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <StaggerItem key={step.n} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-clay bg-cream shadow-sm transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-leaf/40 hover:shadow-xl hover:shadow-spice/10">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="transform-gpu object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Tip that surfaces on hover */}
                    <p className="absolute bottom-6 left-5 right-5 w-fit max-w-full translate-y-2 rounded-full bg-night/75 px-3.5 py-1.5 text-xs font-medium leading-snug text-cream opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {step.tip}
                    </p>

                    {/* Wave edge between photo and caption */}
                    <svg
                      aria-hidden
                      viewBox="0 0 480 26"
                      preserveAspectRatio="none"
                      className="absolute -bottom-px left-0 h-5 w-full text-cream"
                      fill="currentColor"
                    >
                      <path d="M0 26 L0 16 C60 4 120 4 180 13 C240 22 300 22 360 11 C410 3 450 6 480 14 L480 26 Z" />
                    </svg>

                    {/* Number badge with a sonar ping on hover */}
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-clay bg-cream/90 font-display text-base font-semibold text-spice shadow-sm backdrop-blur">
                      <span className="absolute inset-0 rounded-full bg-seafoam/50 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
                      <span className="relative">{step.n}</span>
                    </span>
                  </div>

                  <div className="px-6 pb-7 pt-3 text-center">
                    <h3 className="font-display text-xl font-semibold text-cocoa">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-cocoa-soft">
                      {step.text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
