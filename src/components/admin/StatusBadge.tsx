import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-gold/15 text-gold-dark", // amber - new / awaiting
  paid: "bg-leaf/10 text-leaf", // teal - payment in
  processing: "bg-seafoam/40 text-spice-dark", // pale teal - being prepared
  dispatched: "bg-spice/10 text-spice", // navy - with the courier
  completed: "bg-leaf-dark/15 text-leaf-dark", // deep teal - delivered
  failed: "bg-gold-dark/10 text-gold-dark", // burnt orange - payment failed
  cancelled: "bg-cocoa/10 text-cocoa-soft", // grey - cancelled
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
