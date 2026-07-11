import type { Metadata } from "next";
import { getBankAccounts } from "@/lib/bank";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

// Bank account numbers are customer-facing (shown in the transfer dropdown), so
// it's safe to read them server-side and hand the list to the client form.
export default function CheckoutPage() {
  return <CheckoutClient bankAccounts={getBankAccounts()} />;
}
