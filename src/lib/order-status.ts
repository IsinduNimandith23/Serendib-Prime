import type { OrderStatus, PaymentMethod } from "./types";

export const ALL_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "failed",
  "cancelled",
];

/**
 * Which statuses an admin may set manually, given the order's current status
 * and how it was paid.
 *
 * PayHere orders are gateway-owned: their payment status is set authoritatively
 * by the notify webhook, so the only valid manual action is cancelling (e.g.
 * after issuing a refund) - you can't hand-set a PayHere order to paid/pending/
 * failed. COD and bank-transfer orders have no webhook, so the admin manages
 * their full lifecycle.
 *
 * This is the single source of truth shared by the dropdown UI
 * (src/components/admin/StatusSelect.tsx) and the server action that persists
 * the change (src/app/admin/actions.ts), so the guardrail can't be bypassed.
 */
export function allowedStatusOptions(
  current: OrderStatus,
  method: PaymentMethod,
): OrderStatus[] {
  if (method !== "payhere") return ALL_ORDER_STATUSES;
  // Keep the current (gateway-set) status, and allow cancelling for a refund.
  return current === "cancelled" ? ["cancelled"] : [current, "cancelled"];
}
