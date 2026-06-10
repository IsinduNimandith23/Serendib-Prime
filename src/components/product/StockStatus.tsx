import { cn } from "@/lib/utils";

/** Inline in-stock / out-of-stock indicator with a coloured status dot. */
export function StockStatus({
  inStock,
  className,
}: {
  inStock: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold",
        inStock ? "text-leaf" : "text-gold-dark",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 rounded-full",
          inStock ? "bg-leaf" : "bg-gold-dark",
        )}
      />
      {inStock ? "In stock" : "Out of stock"}
    </span>
  );
}
