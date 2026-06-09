"use client";

import { cn } from "@/lib/utils";
import { IconMinus, IconPlus } from "@/components/icons";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-clay bg-cream",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-cocoa transition-colors hover:text-spice disabled:opacity-40 disabled:hover:text-cocoa"
      >
        <IconMinus className="h-4 w-4" />
      </button>
      <span
        className="min-w-8 text-center text-sm font-semibold tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-cocoa transition-colors hover:text-spice disabled:opacity-40 disabled:hover:text-cocoa"
      >
        <IconPlus className="h-4 w-4" />
      </button>
    </div>
  );
}
