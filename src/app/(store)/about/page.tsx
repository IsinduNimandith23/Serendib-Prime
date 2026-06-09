import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";
import { LeafSprig } from "@/components/visual/SpiceMotif";
import { ValueProps } from "@/components/home/ValueProps";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Serendib Prime captures the everyday flavour of the Sri Lankan coast — dried sprats tempered and curried in small batches, then sealed fresh. Real island taste, ready in minutes.",
};

const STATS = [
  { value: "3", label: "Signature recipes" },
  { value: "100%", label: "Natural ingredients" },
  { value: "0", label: "Preservatives added" },
  { value: "24 hrs", label: "Islandwide dispatch" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="The taste of the coast, honestly made"
        intro="We exist to capture the everyday flavour of Sri Lankan home cooking — and to put it within everyone's reach, anywhere in the world."
      />

      <Container className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="grain relative overflow-hidden rounded-[2rem] border border-clay bg-gradient-to-br from-sand to-parchment p-10">
            <LeafSprig className="absolute -left-6 -top-6 h-40 w-40 opacity-20" />
            <div className="mx-auto aspect-square w-[82%]">
              <Image
                src="/dried-sprats-curry-premium.jpg"
                alt="Serendib Prime Dried Sprats Curry tin"
                width={640}
                height={620}
                sizes="(max-width: 1024px) 70vw, 35vw"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-balance text-3xl font-semibold leading-[1.1] text-cocoa sm:text-4xl">
            It started by the sea
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-cocoa-soft">
            <p>
              On Sri Lanka&apos;s west coast, dried sprats — haal messo — have been a humble
              pantry staple for generations: tempered with onion and chilli, or simmered
              into a rich curry on the family stove. Simple, honest, unforgettable.
            </p>
            <p>
              Serendib Prime is our answer to a busy world. We source quality dried sprats
              and cook them in small batches with hand-ground spices and fresh coconut —
              then seal each recipe at its peak using gentle heat alone. No preservatives,
              no artificial anything.
            </p>
            <p>
              The result is the real thing, kept honestly, ready whenever you are. A taste
              of the coast, two minutes away.
            </p>
          </div>
        </Reveal>
      </Container>

      {/* Stats band */}
      <section className="bg-night py-16">
        <Container>
          <Stagger className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {STATS.map((s) => (
              <StaggerItem key={s.label}>
                <p className="font-display text-4xl font-semibold text-gold sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-cream/70">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="The promises in every tin"
            intro="The shortcuts we refuse to take are the reason it tastes like home."
          />
        </Container>
        <ValueProps />
      </section>

      <CTASection />
    </>
  );
}
