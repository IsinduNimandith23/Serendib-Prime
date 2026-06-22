import { getBankAccounts } from "@/lib/bank";
import { CheckoutClient } from "./CheckoutClient";

// Bank account numbers are customer-facing (shown in the transfer dropdown), so
// it's safe to read them server-side and hand the list to the client form.
export default function CheckoutPage() {
  return <CheckoutClient bankAccounts={getBankAccounts()} />;
}
