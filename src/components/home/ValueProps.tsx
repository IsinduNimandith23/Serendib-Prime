import Image from "next/image";
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
    image: "/values/honest-ingredients.jpg",
    alt: "Whole spices, chillies, garlic and fresh herbs laid out on a wooden table",
    title: "Honest ingredients",
    text: "Island-grown spices and real coconut milk.",
  },
  {
    Icon: IconClock,
    image: "/values/ready-in-minutes.jpg",
    alt: "A plate of rich curry served with warm flatbread",
    title: "Ready in minutes",
    text: "Open, warm and serve in two minutes flat.",
  },
  {
    Icon: IconShield,
    image: "/values/no-preservatives.jpg",
    alt: "Home-style curry simmered in a traditional copper pot",
    title: "No preservatives",
    text: "Sealed fresh with gentle heat - never chemicals.",
  },
  {
    Icon: IconTruck,
    image: "/values/islandwide-delivery.jpg",
    alt: "A parcel being handed over at the doorstep",
    title: "Islandwide delivery",
    text: "At your door within 24 hours, free over Rs 5,000.",
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
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROPS.map(({ Icon, image, alt, title, text }) => (
            <StaggerItem key={title}>
              <article className="group relative aspect-3/4 overflow-hidden rounded-3xl border border-clay bg-cocoa">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-cocoa/85 via-cocoa/20 to-transparent transition-colors duration-500 group-hover:via-cocoa/35"
                />

                <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-cream/90 text-spice shadow-lg backdrop-blur transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span
                    aria-hidden
                    className="mb-3 block h-0.5 w-8 origin-left bg-gold transition-transform duration-500 group-hover:scale-x-[2.5]"
                  />
                  <h3 className="font-display text-xl font-semibold text-cream">
                    {title}
                  </h3>
                  {/* One short line; hidden until hover on fine-pointer screens,
                      always visible on touch where hover never fires. */}
                  <p className="mt-1.5 text-sm leading-snug text-cream/85 transition-all duration-500 pointer-fine:translate-y-3 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100">
                    {text}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
