/** Shipping rules - pure, safe to import on both server and client. */
export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FLAT = 450;

/** Flat-rate islandwide delivery; free over the threshold. */
export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}
