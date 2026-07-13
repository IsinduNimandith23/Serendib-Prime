"use client";

import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const REVIEWS = [
  {
    quote:
      "The tempered sprats taste exactly like my ammā's. I keep a tin at the office and lunch with rice is sorted in two minutes. Crispy, spicy, perfect.",
    name: "Dilini Perera",
    location: "Colombo 05",
  },
  {
    quote:
      "As a Sri Lankan living in London, this is the closest I've found to home. The dried sprats curry is ridiculously good. Shipped fast and packed beautifully.",
    name: "Roshan Fernando",
    location: "London, UK",
  },
  {
    quote:
      "The premium coconut sprats curry is restaurant quality with zero effort. My kids ask for it. Honestly couldn't tell it came from a tin.",
    name: "Ayesha Jayawardena",
    location: "Kandy",
  },
];

// Copies of the review list in the marquee track. The track animates to
// -50%, so an even count keeps the loop seamless; six keeps the half-track
// wider than any viewport so no gap ever scrolls into view.
const TRACK_COPIES = 6;

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <SpotlightCard className="flex h-full flex-col rounded-3xl border border-clay bg-cream p-7 transition-colors hover:border-spice/30">
      <p className="flex-1 text-base leading-relaxed text-cocoa">
        “{review.quote}”
      </p>
      <div className="mt-6 border-t border-clay pt-4">
        <p className="font-semibold text-cocoa">{review.name}</p>
        <p className="text-sm text-cocoa-soft">{review.location}</p>
      </div>
    </SpotlightCard>
  );
}

export function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-sand/60 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Loved by thousands"
          title="A taste of home, wherever you are"
        />
      </Container>
      {reduce ? (
        <Container>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <StaggerItem key={r.name}>
                <ReviewCard review={r} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      ) : (
        <Reveal>
          <div className="mt-14 overflow-hidden mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
              {Array.from({ length: TRACK_COPIES }).flatMap((_, copy) =>
                REVIEWS.map((r) => (
                  <div
                    key={`${copy}-${r.name}`}
                    aria-hidden={copy > 0}
                    className="w-[min(85vw,24rem)] shrink-0"
                  >
                    <ReviewCard review={r} />
                  </div>
                )),
              )}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
