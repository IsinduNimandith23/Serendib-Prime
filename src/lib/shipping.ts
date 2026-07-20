/** Shipping rules - pure, safe to import on both server and client. */
export const SHIPPING_FLAT = 450;

/** Flat-rate islandwide delivery. */
export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return SHIPPING_FLAT;
}
