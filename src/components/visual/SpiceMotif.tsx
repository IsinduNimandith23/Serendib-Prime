import { cn } from "@/lib/utils";

/** Decorative curry-leaf sprig — purely ornamental background flourish. */
export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("text-leaf", className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <g opacity="0.9">
        <path
          d="M60 112 C 60 86 60 60 60 18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <ellipse cx="42" cy="92" rx="13" ry="6" transform="rotate(-34 42 92)" />
        <ellipse cx="78" cy="80" rx="13" ry="6" transform="rotate(34 78 80)" />
        <ellipse cx="43" cy="70" rx="12" ry="5.5" transform="rotate(-32 43 70)" />
        <ellipse cx="77" cy="58" rx="12" ry="5.5" transform="rotate(32 77 58)" />
        <ellipse cx="46" cy="48" rx="10" ry="5" transform="rotate(-30 46 48)" />
        <ellipse cx="74" cy="38" rx="10" ry="5" transform="rotate(30 74 38)" />
        <circle cx="60" cy="18" r="5" />
      </g>
    </svg>
  );
}

/** Decorative star-anise pod. */
export function StarAnise({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("text-gold", className)}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 45} 60 60)`}>
          <path d="M60 60 L60 18 Q66 26 60 30 Q54 26 60 18" fill="currentColor" />
        </g>
      ))}
      <circle cx="60" cy="60" r="9" fill="currentColor" />
    </svg>
  );
}
