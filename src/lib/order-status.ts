import type { OrderStatus, PaymentMethod } from "./types";

export const ALL_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "dispatched",
  "completed",
  "failed",
  "cancelled",
];

/**
 * Statuses an admin can pick by hand. "paid" is deliberately excluded - it's set
 * automatically by the PayHere webhook, and in the manual workflow reaching
 * "processing" already implies the order is paid. Admins drive:
 * pending -> processing -> dispatched -> completed (or failed / cancelled).
 */
export const MANUAL_ORDER_STATUSES: OrderStatus[] = ALL_ORDER_STATUSES.filter(
  (s) => s !== "paid",
);

/**
 * Fulfillment stages the admin drives by hand once payment / stock is
 * confirmed: prepared in-house (processing) -> handed to the courier
 * (dispatched) -> received by the customer (completed).
 */
export const FULFILLMENT_STATUSES: OrderStatus[] = [
  "processing",
  "dispatched",
  "completed",
];

/**
 * Statuses that count as realised revenue. A paid order stays revenue as it
 * moves through fulfillment, so every post-payment stage is included. (For COD
 * this slightly leads reality - the cash only lands on "completed" - but keeping
 * paid online/bank orders in the total as they ship matters more.)
 */
export const REVENUE_STATUSES: OrderStatus[] = ["paid", ...FULFILLMENT_STATUSES];

function unique(list: OrderStatus[]): OrderStatus[] {
  return [...new Set(list)];
}

/**
 * Which statuses an admin may set manually, given the order's current status
 * and how it was paid.
 *
 * PayHere orders are gateway-owned for *payment*: pending/paid/failed are set
 * authoritatively by the notify webhook and can't be hand-set. Fulfillment,
 * though, is always the admin's job - so once a PayHere order is paid they can
 * move it through processing -> dispatched -> completed, or cancel it for a
 * refund. COD and bank-transfer orders have no webhook, so the admin owns their
 * full lifecycle.
 *
 * This is the single source of truth shared by the dropdown UI
 * (src/components/admin/StatusSelect.tsx) and the server action that persists
 * the change (src/app/admin/actions.ts), so the guardrail can't be bypassed.
 */
export function allowedStatusOptions(
  current: OrderStatus,
  method: PaymentMethod,
): OrderStatus[] {
  if (method !== "payhere") {
    // Admin owns the lifecycle. Offer the manual workflow, and always keep the
    // current status selectable so a no-op update can't be rejected (this is the
    // only way "paid" can appear - when the order is already sitting there).
    return unique([current, ...MANUAL_ORDER_STATUSES]);
  }

  // Paid (or already-in-fulfillment) PayHere orders: keep the current status,
  // allow moving forward through fulfillment, and allow cancelling for a refund.
  if (current === "paid" || FULFILLMENT_STATUSES.includes(current)) {
    return unique([current, ...FULFILLMENT_STATUSES, "cancelled"]);
  }

  // pending / failed / cancelled PayHere orders aren't fulfillable yet; the only
  // manual action is cancelling (e.g. after issuing a refund).
  return current === "cancelled" ? ["cancelled"] : [current, "cancelled"];
}
