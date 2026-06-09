import { cn } from "@/lib/utils";
import { IconStar } from "@/components/icons";

export function Stars({
  rating,
  reviews,
  className,
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex text-gold" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconStar key={i} filled={i <= rounded} className="h-4 w-4" />
        ))}
      </span>
      <span className="text-sm font-medium text-cocoa">
        {rating.toFixed(1)}
        {typeof reviews === "number" && (
          <span className="font-normal text-cocoa-soft"> ({reviews})</span>
        )}
      </span>
      <span className="sr-only">{rating} out of 5 stars</span>
    </span>
  );
}
