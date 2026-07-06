import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  paid: "bg-leaf/10 text-leaf",
  pending: "bg-gold/15 text-gold-dark",
  cancelled: "bg-cocoa/10 text-cocoa-soft",
  failed: "bg-spice/10 text-spice",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[13px] font-semibold capitalize",
        STYLES[status] ?? STYLES.pending,
      )}
    >
      {status}
    </span>
  );
}
