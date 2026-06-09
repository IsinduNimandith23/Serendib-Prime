import { cn } from "@/lib/utils";
import {
  IconLeaf,
  IconClock,
  IconShield,
  IconFlame,
  IconAward,
  IconCheck,
} from "@/components/icons";

function iconFor(text: string) {
  const t = text.toLowerCase();
  if (t.includes("plant") || t.includes("vegan")) return IconLeaf;
  if (t.includes("ready") || t.includes("min")) return IconClock;
  if (
    t.includes("preservative") ||
    t.includes("gluten") ||
    t.includes("caught") ||
    t.includes("range")
  )
    return IconShield;
  if (t.includes("protein") || t.includes("fibre")) return IconFlame;
  if (
    t.includes("chef") ||
    t.includes("heritage") ||
    t.includes("festive") ||
    t.includes("favourite") ||
    t.includes("reserve") ||
    t.includes("complete") ||
    t.includes("recipe")
  )
    return IconAward;
  return IconCheck;
}

export function Badge({ text, className }: { text: string; className?: string }) {
  const Icon = iconFor(text);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-clay bg-sand/70 px-3 py-1 text-xs font-medium text-cocoa-soft",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 text-leaf" />
      {text}
    </span>
  );
}
