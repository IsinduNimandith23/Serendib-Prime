/** Shipping rules - pure, safe to import on both server and client. */
import type { CartItem } from "./types";

/** Base islandwide delivery fee, for parcels up to HEAVY_THRESHOLD_G. */
export const SHIPPING_BASE = 425;
/** One-off surcharge added once the parcel goes over the weight threshold. */
export const HEAVY_SURCHARGE = 100;
/** Parcels heavier than this (1kg, in grams) pay the surcharge. */
export const HEAVY_THRESHOLD_G = 1000;
/**
 * Empty tin + label + outer packaging, per item. The weight stored on a
 * product is the NET content weight, but the courier charges on GROSS (shipped)
 * weight, so we add the tare back per unit. From the client's weight sheet the
 * tare is effectively constant (400g net -> 458g gross = 58g; 250g -> 311g =
 * 61g), so a single ~60g constant reproduces gross to within a couple of grams
 * and never changes which side of the 1kg threshold a real cart lands on.
 */
export const PACKAGING_TARE_G = 60;

/**
 * Parse a net-weight label ("400g", "1kg", "1.2 KG") into grams.
 * Weight is a free-text field in the admin, so anything unparseable is
 * treated as 0 rather than throwing - the fee falls back to the base rate.
 */
export function parseWeightGrams(label: string | undefined): number {
  if (!label) return 0;
  const match = /([\d.]+)\s*(kg|g)\b/i.exec(label);
  if (!match) return 0;
  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value) || value < 0) return 0;
  return match[2].toLowerCase() === "kg" ? value * 1000 : value;
}

/**
 * Total GROSS (shipped) weight of the cart in grams - i.e. net content plus the
 * per-item PACKAGING_TARE_G. This is the figure the courier weighs, so it is
 * what the 1kg surcharge threshold is measured against.
 */
export function cartWeightGrams(items: CartItem[]): number {
  return items.reduce(
    (g, i) => g + (parseWeightGrams(i.weight) + PACKAGING_TARE_G) * i.quantity,
    0,
  );
}

/**
 * Islandwide delivery: flat SHIPPING_BASE, plus a single HEAVY_SURCHARGE once
 * the parcel weighs more than HEAVY_THRESHOLD_G. The surcharge is charged once,
 * however heavy the parcel gets.
 */
export function shippingFor(subtotal: number, items: CartItem[] = []): number {
  if (subtotal <= 0) return 0;
  return SHIPPING_BASE + (isOverweight(items) ? HEAVY_SURCHARGE : 0);
}

/** True when the cart has crossed the heavy-parcel threshold. */
export function isOverweight(items: CartItem[]): boolean {
  return cartWeightGrams(items) > HEAVY_THRESHOLD_G;
}

/** "800g" / "1.2kg" - for showing the customer why they were surcharged. */
export function formatWeight(grams: number): string {
  return grams >= 1000
    ? `${Number((grams / 1000).toFixed(2))}kg`
    : `${Math.round(grams)}g`;
}

/** One-line explanation of the delivery fee, shown under cart/checkout totals. */
export function shippingNote(items: CartItem[]): string {
  const grams = cartWeightGrams(items);
  return isOverweight(items)
    ? `Rs. ${SHIPPING_BASE} islandwide + Rs. ${HEAVY_SURCHARGE} over 1kg (${formatWeight(grams)} parcel)`
    : `Flat Rs. ${SHIPPING_BASE} islandwide · Rs. ${HEAVY_SURCHARGE} more over 1kg`;
}
