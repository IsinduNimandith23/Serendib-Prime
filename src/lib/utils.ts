import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conditional logic, de-duplicating conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Sri Lankan Rupees, e.g. 1250 -> "Rs 1,250". */
export function formatLKR(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("LKR", "Rs")
    .replace("Rs ", "Rs ");
}

/** Sri Lanka time zone - timestamps render the same regardless of where the
 * code runs (Vercel servers are UTC, so without this they'd show UTC). */
const SL_TIME_ZONE = "Asia/Colombo";

/** Format a timestamp as a Sri Lanka calendar date, e.g. "23/06/2026". */
export function formatSLDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-LK", { timeZone: SL_TIME_ZONE });
}

/** Format a timestamp as a Sri Lanka wall-clock time, e.g. "12:18 AM". */
export function formatSLTime(value: string | Date): string {
  return new Date(value).toLocaleTimeString("en-LK", {
    timeZone: SL_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Generate a human-friendly order reference, e.g. "CPC-7F3K9Q". */
export function makeOrderRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SP-${s}`;
}
