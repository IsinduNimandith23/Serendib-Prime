import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/motion";
import { Parallax } from "@/components/ui/Parallax";
import Image from "next/image";
import { FishMotif } from "@/components/visual/SeaMotif";
import { IconArrowRight, IconAward } from "@/components/icons";

export function StorySection() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-2 lg:order-1">
          <div className="grain relative overflow-hidden rounded-[2rem] border border-clay bg-gradient-to-br from-sand to-parchment p-10">
            <Parallax speed={44} className="absolute -right-6 -top-6">
              <FishMotif className="h-40 w-40 opacity-20" />
            </Parallax>
            <div className="mx-auto aspect-square w-[82%]">
              <Image
                src="/tempered-sprats.jpg"
                alt="Serendib Prime Tempered Sprats tin"
                width={640}
                height={620}
                sizes="(max-width: 1024px) 70vw, 35vw"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-clay bg-cream/90 px-4 py-3 shadow-lg backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                <IconAward className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-cocoa">3 generations</p>
                <p className="text-xs text-cocoa-soft">of family recipes</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.1}>
          <span className="eyebrow inline-flex items-center gap-2 text-spice">
            <span className="h-px w-6 bg-current opacity-50" /> Our story
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] text-cocoa sm:text-4xl">
            From the Sri Lankan coast to your table
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-cocoa-soft">
            <p>
              Serendib Prime began on the west coast, where dried sprats -
              haal messo - have been a pantry staple for generations. We set out
              to capture that everyday island flavour in a tin, without losing a
              thing.
            </p>
            <p>
              We source quality dried sprats, temper and curry them in small
              batches with hand-ground spices and fresh coconut, then seal each
              recipe at its peak using gentle heat alone - never chemicals. The
              tin you open tomorrow tastes exactly like the pan we cooked today.
            </p>
          </div>
          <Link
            href="/about"
            className="group mt-7 inline-flex items-center gap-2 font-semibold text-spice transition-colors hover:text-spice-dark"
          >
            Read the full story
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
