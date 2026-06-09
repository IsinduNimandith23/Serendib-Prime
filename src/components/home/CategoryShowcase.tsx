import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { IconArrowRight } from "@/components/icons";

const CATEGORIES = [
  {
    name: "Tempered",
    blurb: "Crispy stir-fried sprats, bold & spicy",
    accent: "#f15b2b",
  },
  {
    name: "Curries",
    blurb: "Sprats simmered in rich island gravies",
    accent: "#074a6d",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Explore the pantry"
          title="Find your flavour"
          intro="From gentle coconut dhal to fiery northern crab — there is a curry here for every craving."
        />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat.name}>
              <Link
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-3xl border border-clay p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cocoa/10"
                style={{
                  background: `linear-gradient(155deg, ${cat.accent}, ${cat.accent}cc)`,
                }}
              >
                <span
                  aria-hidden
                  className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-cream/10 transition-transform duration-500 group-hover:scale-125"
                />
                <h3 className="font-display text-2xl font-semibold text-cream">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-cream/80">{cat.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cream">
                  Explore
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
