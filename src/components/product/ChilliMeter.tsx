import { cn } from "@/lib/utils";
import { IconFlame } from "@/components/icons";

const LABELS: Record<number, string> = {
  0: "Mild",
  1: "Gentle",
  2: "Medium",
  3: "Fiery",
};

export function ChilliMeter({
  level,
  showLabel = true,
  className,
}: {
  level: number;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-spice", className)}
      title={`Spice level: ${LABELS[level]}`}
    >
      {[1, 2, 3].map((i) => (
        <IconFlame
          key={i}
          className={cn("h-4 w-4", i <= level ? "opacity-100" : "opacity-25")}
        />
      ))}
      {showLabel && (
        <span className="ml-1.5 text-xs font-medium text-cocoa-soft">
          {LABELS[level]}
        </span>
      )}
    </span>
  );
}
