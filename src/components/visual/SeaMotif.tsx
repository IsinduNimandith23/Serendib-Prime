import { cn } from "@/lib/utils";

/** Decorative little fish - purely ornamental background flourish. */
export function FishMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("text-leaf", className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <g opacity="0.9">
        {/* body */}
        <path d="M18 60 C 34 40, 66 36, 90 50 C 98 54, 106 57, 112 60 C 106 63, 98 66, 90 70 C 66 84, 34 80, 18 60 Z" />
        {/* tail fin */}
        <path d="M18 60 L3 46 C 8 55, 8 65, 3 74 Z" />
        {/* eye */}
        <circle cx="92" cy="56" r="2.6" fill="var(--color-cream)" />
      </g>
    </svg>
  );
}

/** Decorative star-fish pod. */
export function Starfish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("text-gold", className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <g opacity="0.9">
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            transform={`rotate(${i * 72} 60 60)`}
            d="M60 60 C 51 42, 52 26, 60 10 C 68 26, 69 42, 60 60 Z"
          />
        ))}
        <circle cx="60" cy="60" r="15" />
      </g>
    </svg>
  );
}
