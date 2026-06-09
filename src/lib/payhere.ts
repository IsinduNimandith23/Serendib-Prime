import crypto from "crypto";

/**
 * PayHere.lk integration helpers.
 *
 * Docs: https://support.payhere.lk/api-&-mobile-sdk/checkout-api
 * The merchant secret is used ONLY on the server to build/verify hashes —
 * it is never sent to the browser.
 */

export const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID ?? "";
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET ?? "";
export const PAYHERE_MODE = (process.env.NEXT_PUBLIC_PAYHERE_MODE ?? "sandbox") as
  | "sandbox"
  | "live";
export const CURRENCY = "LKR";

export function isPayHereConfigured(): boolean {
  return Boolean(PAYHERE_MERCHANT_ID && PAYHERE_MERCHANT_SECRET);
}

export function payhereCheckoutUrl(): string {
  return PAYHERE_MODE === "live"
    ? "https://www.payhere.lk/pay/checkout"
    : "https://sandbox.payhere.lk/pay/checkout";
}

function md5Upper(value: string): string {
  return crypto.createHash("md5").update(value).digest("hex").toUpperCase();
}

/** Amounts must be sent as a fixed 2-decimal string with no thousands separators. */
export function formatPayHereAmount(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}

/** hash = UPPER( md5( merchant_id + order_id + amount + currency + UPPER(md5(secret)) ) ) */
export function generateCheckoutHash(orderId: string, amount: number): string {
  const secretHash = md5Upper(PAYHERE_MERCHANT_SECRET);
  return md5Upper(
    PAYHERE_MERCHANT_ID +
      orderId +
      formatPayHereAmount(amount) +
      CURRENCY +
      secretHash,
  );
}

/**
 * Verify the server-to-server notification signature sent to notify_url.
 * status_code: 2 = success, 0 = pending, -1 = cancelled, -2 = failed, -3 = chargedback
 */
export function verifyNotifySignature(params: {
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  statusCode: string;
  md5sig: string;
}): boolean {
  const secretHash = md5Upper(PAYHERE_MERCHANT_SECRET);
  const local = md5Upper(
    params.merchantId +
      params.orderId +
      params.amount +
      params.currency +
      params.statusCode +
      secretHash,
  );
  return local === params.md5sig.toUpperCase();
}

export function payhereStatusToOrderStatus(
  statusCode: string,
): "paid" | "pending" | "cancelled" | "failed" {
  switch (statusCode) {
    case "2":
      return "paid";
    case "0":
      return "pending";
    case "-1":
      return "cancelled";
    default:
      return "failed";
  }
}
