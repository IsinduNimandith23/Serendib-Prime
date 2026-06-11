import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
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
    text: "Shipped within 24 hours in protective packaging, with free delivery on orders over Rs 5,000.",
  },
];

export function ValueProps() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROPS.map(({ Icon, title, text }) => (
            <StaggerItem key={title}>
              <SpotlightCard className="h-full rounded-3xl border border-clay bg-cream p-7 transition-colors hover:border-spice/30">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-spice/10 text-spice transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-cocoa">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa-soft">{text}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
