import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import {
  IconLeaf,
  IconClock,
  IconShield,
  IconTruck,
} from "@/components/icons";

const PROPS = [
  {
    Icon: IconLeaf,
    title: "Honest ingredients",
    text: "Real coconut milk, freshly roasted spices and produce sourced from island farmers. Nothing artificial.",
  },
  {
    Icon: IconClock,
    title: "Ready in minutes",
    text: "Authentic curries that took hours to cook, warmed through and on your plate in two minutes flat.",
  },
  {
    Icon: IconShield,
    title: "No preservatives",
    text: "Sealed fresh using gentle heat - never chemicals. The way your grandmother preserved her curries.",
  },
  {
    Icon: IconTruck,
    title: "Islandwide delivery",
    text: "Shipped within 24 hours in protective packaging, with flat-rate delivery anywhere in Sri Lanka.",
  },
];

export function ValueProps() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why Serendib Prime"
          title="The promise in every tin"
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROPS.map(({ Icon, title, text }) => (
            <StaggerItem
              key={title}
              className="rounded-3xl border border-clay bg-cream p-7 transition-colors hover:border-spice/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-spice/10 text-spice">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-cocoa">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cocoa-soft">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
