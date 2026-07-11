import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GrowLine, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { CTASection } from "@/components/home/CTASection";
import { IconMapPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Serendib Prime captures the everyday flavour of the Sri Lankan coast - dried sprats tempered and curried in small batches, then sealed fresh. Real island taste, ready in minutes.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "3", label: "Signature recipes" },
  { value: "100%", label: "Natural ingredients" },
  { value: "0", label: "Preservatives added" },
  { value: "24 hrs", label: "Islandwide dispatch" },
];

const PROCESS = [
  {
    n: "01",
    title: "Sourced from the coast",
    text: "Quality dried sprats from local fishing communities, with spices and coconut grown by island farmers.",
  },
  {
    n: "02",
    title: "Cooked in small batches",
    text: "Hand-ground spices, fresh coconut milk and family recipes, cooked the slow way in our Colombo kitchen.",
  },
  {
    n: "03",
    title: "Sealed at the peak",
    text: "Every batch is sealed using gentle heat alone - no preservatives, no artificial anything.",
  },
  {
    n: "04",
    title: "Shipped within 24 hours",
    text: "Carefully packed and dispatched islandwide within a day, ready for your pantry shelf.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="The taste of the coast, honestly made"
        intro="We exist to capture the everyday flavour of Sri Lankan home cooking - and to put it within everyone's reach, anywhere in the world."
      />

      {/* Origin story */}
      <Container className="grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-clay">
            <Image
              src="/about/coastal-fishing-boats.jpg"
              alt="Fishing boats pulled up on a Sri Lankan beach at golden hour"
              fill
              sizes="(max-width: 1024px) 92vw, 44vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-clay bg-cream/90 px-4 py-3 shadow-lg backdrop-blur">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-spice/10 text-spice">
              <IconMapPin className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-cocoa">Haal messo</p>
              <p className="text-xs text-cocoa-soft">a coastal staple for generations</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="eyebrow inline-flex items-center gap-2 text-spice">
            <span className="h-px w-6 bg-current opacity-50" /> Where it began
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] text-cocoa sm:text-5xl">
            It started by the sea
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-cocoa-soft">
            <p>
              On Sri Lanka&apos;s west coast, dried sprats - haal messo - have been a humble
              pantry staple for generations: tempered with onion and chilli, or simmered
              into a rich curry on the family stove. Simple, honest, unforgettable.
            </p>
            <p>
              Serendib Prime is our answer to a busy world. We cook that same flavour in
              small batches and seal each recipe at its peak, so the tin you open tomorrow
              tastes exactly like the pan we cooked today.
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

      {/* Production process */}
      <section className="bg-sand/40 py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="From coast to tin"
              title="How every tin is made"
              intro="The shortcuts we refuse to take are the reason it tastes like home."
            />
          </div>

          <div className="relative">
            <GrowLine
              className="absolute bottom-9 left-9 top-9 hidden w-px bg-clay sm:block"
              delay={0.2}
            />
            <Stagger className="grid gap-10">
              {PROCESS.map((step) => (
                <StaggerItem key={step.n} className="relative flex gap-6 sm:gap-8">
                  <span className="relative z-10 flex h-18 w-18 shrink-0 items-center justify-center rounded-full border border-clay bg-cream font-display text-2xl font-semibold text-spice shadow-sm">
                    {step.n}
                  </span>
                  <div className="pt-2">
                    <h3 className="font-display text-xl font-semibold text-cocoa">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-cocoa-soft">
                      {step.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
