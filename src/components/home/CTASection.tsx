import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/motion";
import { Parallax } from "@/components/ui/Parallax";
import { buttonClass } from "@/components/ui/Button";
import { FishMotif, Starfish } from "@/components/visual/SeaMotif";
import { IconArrowRight } from "@/components/icons";

export function CTASection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-night px-6 py-16 text-center sm:px-12 sm:py-20">
          <Parallax speed={36} className="pointer-events-none absolute -left-8 bottom-0">
            <FishMotif className="h-44 w-44 text-cream opacity-[0.06]" />
          </Parallax>
          <Parallax speed={-30} className="pointer-events-none absolute -right-6 -top-6">
            <Starfish className="h-36 w-36 text-cream opacity-[0.06]" />
          </Parallax>
          <span className="eyebrow text-seafoam">Dinner, sorted</span>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] text-cream sm:text-5xl md:text-6xl">
            Bring Sri Lanka to your table tonight
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Stock your pantry with real island seafood. Islandwide delivery, and
            a flavour guarantee on every tin.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/products" className={buttonClass({ variant: "gold", size: "lg" })}>
              Shop the pantry
              <IconArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className={buttonClass({
                variant: "outline",
                size: "lg",
                className: "border-cream/25 text-cream hover:border-gold hover:text-gold",
              })}
            >
              Talk to us
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
