import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Stars } from "@/components/product/Stars";

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

export function Testimonials() {
  return (
    <section className="bg-sand/60 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Loved by thousands"
          title="A taste of home, wherever you are"
        />
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <StaggerItem key={r.name}>
              <SpotlightCard className="flex h-full flex-col rounded-3xl border border-clay bg-cream p-7 transition-colors hover:border-spice/30">
                <Stars rating={5} />
                <p className="mt-4 flex-1 text-base leading-relaxed text-cocoa">
                  “{r.quote}”
                </p>
                <div className="mt-6 border-t border-clay pt-4">
                  <p className="font-semibold text-cocoa">{r.name}</p>
                  <p className="text-sm text-cocoa-soft">{r.location}</p>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
