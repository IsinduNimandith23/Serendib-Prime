import { cn } from "@/lib/utils";

/**
 * SERENDIB PRIME logo - renders the official artwork from /public/logo.png
 * (fish mark + wordmark). On dark surfaces pass `light` to render it white.
 * Set the height via `className` (e.g. "h-10").
 */
export function Logo({
  className,
  light = false,
}: {
  className?: string;
  /** Render white, for dark backgrounds. */
  light?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Serendib Prime"
      className={cn("w-auto", light && "brightness-0 invert", className)}
    />
  );
}
