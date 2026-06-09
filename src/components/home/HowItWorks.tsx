import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/motion";

const STEPS = [
  {
    n: "01",
    title: "Choose your curries",
    text: "Browse the pantry and build your box - mix signature curries, seafood and plant-based favourites.",
  },
  {
    n: "02",
    title: "We ship in 24 hours",
    text: "Freshly sealed and carefully packed, your order leaves our Colombo kitchen within a day.",
  },
  {
    n: "03",
    title: "Open, warm & savour",
    text: "Heat in a pan or microwave for two minutes, serve with rice or bread, and taste home.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-sand/60 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From our kitchen to your table"
          intro="No marinating, no simmering, no washing up. Just the real thing, made simple."
        />
        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 hidden h-px bg-clay md:block"
          />
          <Stagger className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <StaggerItem key={step.n} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-clay bg-cream font-display text-2xl font-semibold text-spice shadow-sm">
                  {step.n}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-cocoa">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-cocoa-soft">
                  {step.text}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
