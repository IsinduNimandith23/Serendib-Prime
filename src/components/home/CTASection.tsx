import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/motion";
import { buttonClass } from "@/components/ui/Button";
import { FishMotif, Starfish } from "@/components/visual/SeaMotif";
import { IconArrowRight } from "@/components/icons";

export function CTASection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-night px-6 py-16 text-center sm:px-12 sm:py-20">
          <FishMotif className="pointer-events-none absolute -left-8 bottom-0 h-44 w-44 text-cream opacity-[0.06]" />
          <Starfish className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 text-cream opacity-[0.06]" />
          <span className="eyebrow text-seafoam">Dinner, sorted</span>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold leading-[1.1] text-cream sm:text-4xl md:text-5xl">
            Bring Sri Lanka to your table tonight
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Stock your pantry with real island seafood. Free islandwide delivery
            over Rs 5,000, and a flavour guarantee on every tin.
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
