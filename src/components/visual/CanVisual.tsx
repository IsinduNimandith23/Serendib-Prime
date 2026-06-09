import { cn } from "@/lib/utils";

/** Darken (factor<1) or lighten a hex colour by a multiplicative factor. */
function shade(hex: string, factor: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * factor));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * factor));
  const b = Math.min(255, Math.round((n & 255) * factor));
  return `rgb(${r},${g},${b})`;
}

interface CanVisualProps {
  name: string;
  weight: string;
  accent: string;
  className?: string;
  /** Render a soft tinted disc behind the tin. */
  backdrop?: boolean;
  /** Unique id seed so gradients don't collide when many render on one page. */
  uid?: string;
}

/**
 * Elegant SVG of a premium ready-to-eat tin with a wrap-around label.
 * Fully self-contained (no external images) so it renders instantly and
 * crisply on any device. Doubles as the packaging mockup.
 */
export function CanVisual({
  name,
  weight,
  accent,
  className,
  backdrop = true,
  uid = "c",
}: CanVisualProps) {
  const id = `${uid}-${name.replace(/\W+/g, "")}`;
  const dark = shade(accent, 0.62);
  const light = shade(accent, 1.18);

  return (
    <svg
      viewBox="0 0 320 380"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`${name} tin, ${weight}`}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={dark} />
          <stop offset="18%" stopColor={accent} />
          <stop offset="50%" stopColor={light} />
          <stop offset="82%" stopColor={accent} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9aa3a7" />
          <stop offset="50%" stopColor="#eef2f3" />
          <stop offset="100%" stopColor="#9aa3a7" />
        </linearGradient>
        <radialGradient id={`${id}-disc`} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor={light} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {backdrop && <circle cx="160" cy="175" r="150" fill={`url(#${id}-disc)`} />}

      {/* soft contact shadow */}
      <ellipse cx="160" cy="350" rx="92" ry="16" fill="#2a1a12" opacity="0.12" />

      {/* tin body */}
      <path
        d="M88 96 Q160 78 232 96 L232 322 Q160 346 88 322 Z"
        fill={`url(#${id}-body)`}
      />
      {/* bottom rim (silver) */}
      <path
        d="M88 322 Q160 346 232 322 L232 330 Q160 354 88 330 Z"
        fill="#aab2b6"
      />
      {/* gloss highlight */}
      <rect x="108" y="104" width="14" height="214" rx="7" fill="#ffffff" opacity="0.16" />

      {/* lid */}
      <ellipse cx="160" cy="96" rx="72" ry="18" fill={`url(#${id}-lid)`} />
      <ellipse cx="160" cy="93" rx="72" ry="18" fill={dark} opacity="0.25" />
      <ellipse cx="160" cy="92" rx="60" ry="13" fill={`url(#${id}-lid)`} />

      {/* label band */}
      <path
        d="M84 168 Q160 156 236 168 L236 270 Q160 282 84 270 Z"
        fill="#fbf6ee"
      />
      <path d="M84 176 Q160 165 236 176" stroke="#c2912e" strokeWidth="1.5" fill="none" />
      <path d="M84 262 Q160 273 236 262" stroke="#c2912e" strokeWidth="1.5" fill="none" />

      <text
        x="160"
        y="194"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="2.5"
        fill="#074a6d"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}
      >
        SERENDIB PRIME
      </text>
      <text
        x="160"
        y="226"
        textAnchor="middle"
        fontSize="23"
        fill="#2a1a12"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        {name}
      </text>
      <text
        x="160"
        y="252"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="1.5"
        fill="#6e5a48"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        NET {weight} · READY TO EAT
      </text>
    </svg>
  );
}
