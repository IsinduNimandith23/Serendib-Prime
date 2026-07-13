export const SITE_NAME = "Serendib Prime";

/**
 * Online card payment (PayHere) is switched off while the merchant account is
 * still under verification, so customers can't accidentally order through it.
 * Flip to `true` once PayHere approves the account to re-enable the "Online
 * payment" option at checkout.
 */
export const ONLINE_PAYMENT_ENABLED = false;

// Canonical host is www — the apex 308-redirects to it at the platform level,
// so every absolute URL we emit (canonicals, OG, sitemap, JSON-LD) must use www.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://www.serendibprime.lk"
).replace(/\/+$/, "");

/** Absolutize a path; pass through already-absolute URLs (e.g. Supabase storage). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
