import { IconSparkle } from "@/components/icons";

const ITEMS = [
  "100% Sri Lankan sprats",
  "No preservatives",
  "Ready in 2 minutes",
  "Rich in protein",
  "Islandwide delivery",
  "Authentic island recipes",
  "Sealed at peak freshness",
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-clay bg-sand/70 py-4">
      <div className="flex w-max animate-marquee items-center gap-8">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-8">
                <span className="whitespace-nowrap font-display text-lg text-cocoa/80">
                  {item}
                </span>
                <IconSparkle className="h-4 w-4 shrink-0 text-gold" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
