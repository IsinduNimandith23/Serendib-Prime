import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/Button";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";
import { FishMotif } from "@/components/visual/SeaMotif";
import { getOrderByRef } from "@/lib/orders";
import { formatLKR } from "@/lib/utils";
import type { OrderStatus, PaymentMethod } from "@/lib/types";
import {
  IconCheckCircle,
  IconArrowRight,
  IconMail,
  IconTruck,
  IconClock,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

// Always read the latest order status (the notify webhook may have just updated it).
export const revalidate = 0;

/**
 * What we render the page as. PayHere passes no payment status to the return_url,
 * so we look the order up by reference and trust the webhook-updated status.
 * `demo` short-circuits the lookup; `unknown` is the optimistic fallback used
 * when Supabase isn't configured or the order can't be found.
 */
type View = "paid" | "pending" | "failed" | "demo" | "unknown";

function viewFor(status: OrderStatus): View {
  switch (status) {
    case "pending":
      return "pending";
    case "failed":
    case "cancelled":
      return "failed";
    default:
      return "paid"; // paid | processing | dispatched | completed
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; demo?: string }>;
}) {
  const { order, demo } = await searchParams;

  let view: View = "unknown";
  let method: PaymentMethod = "payhere";
  let total = 0;
  let bankAccount: string | null = null;
  if (demo) {
    view = "demo";
  } else if (order) {
    const record = await getOrderByRef(order);
    if (record) {
      method = record.payment_method;
      total = Number(record.total);
      bankAccount = record.bank_account;
      // PayHere orders wait on the webhook (pending). COD/bank orders are
      // confirmed the moment they're placed - "pending" just means we haven't
      // collected payment yet, so show them as confirmed.
      view =
        method === "payhere"
          ? viewFor(record.status)
          : record.status === "failed" || record.status === "cancelled"
            ? "failed"
            : "paid";
    }
  }

  // Only empty the basket once payment is confirmed (or in the demo flow) so a
  // failed/cancelled payment leaves the cart intact for a retry.
  const clearCart = view === "paid" || view === "demo";
  // While the webhook may still be in flight, let the page refresh itself.
  const autoRefresh = view === "pending";

  const confirmed = view === "paid" || view === "demo" || view === "unknown";

  return (
    <Container className="py-16 sm:py-24">
      {clearCart && <ClearCartOnMount />}
      {autoRefresh && <meta httpEquiv="refresh" content="5" />}
      <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-clay bg-cream p-8 text-center sm:p-12">
        <FishMotif className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 opacity-10" />

        {confirmed ? (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/10 text-leaf">
              <IconCheckCircle className="h-9 w-9" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-cocoa sm:text-4xl">
              Thank you - your order is confirmed!
            </h1>
          </>
        ) : view === "pending" ? (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold-dark">
              <IconClock className="h-9 w-9" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-cocoa sm:text-4xl">
              We&apos;re confirming your payment…
            </h1>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-spice/10 text-spice">
              <IconClock className="h-9 w-9" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-cocoa sm:text-4xl">
              Your payment wasn&apos;t completed
            </h1>
          </>
        )}

        {order && (
          <p className="mt-3 text-cocoa-soft">
            Order reference{" "}
            <strong className="font-semibold text-cocoa">{order}</strong>
          </p>
        )}

        {confirmed && method === "bank" && (
          <div className="mt-5 rounded-2xl border border-clay bg-sand/50 px-5 py-4 text-left">
            <p className="font-display text-base font-semibold text-cocoa">
              Receipt received
            </p>
            <p className="mt-1 text-sm text-cocoa-soft">
              Thanks for your transfer of{" "}
              <strong className="text-cocoa">{formatLKR(total)}</strong>
              {bankAccount ? ` to ${bankAccount}` : ""}. We&apos;ll verify your payment and confirm
              your order shortly - keep{" "}
              <strong className="text-cocoa">{order}</strong> as your reference.
            </p>
          </div>
        )}

        {confirmed && method === "cod" && (
          <p className="mt-5 rounded-2xl border border-clay bg-sand/50 px-4 py-3 text-sm text-cocoa">
            <strong>Cash on delivery.</strong> Please have{" "}
            <strong>{formatLKR(total)}</strong> ready to pay when your order arrives.
          </p>
        )}

        {view === "demo" && (
          <p className="mt-5 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-dark">
            <strong>Demo checkout.</strong> No payment was taken. Add your PayHere
            merchant keys to take real payments - see the setup guide.
          </p>
        )}

        {view === "pending" && (
          <p className="mt-5 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-dark">
            This page will update automatically once the payment clears. It usually
            takes only a few seconds.
          </p>
        )}

        {view === "failed" && (
          <p className="mt-5 rounded-2xl border border-spice/30 bg-spice/5 px-4 py-3 text-sm text-spice">
            We couldn&apos;t confirm a payment for this order. Your basket is still
            saved if you&apos;d like to try again.
          </p>
        )}

        {confirmed && (
          <div className="mt-8 space-y-3 text-left">
            {[
              { Icon: IconMail, text: "A confirmation email is on its way to your inbox." },
              { Icon: IconClock, text: "We start preparing your order within hours." },
              { Icon: IconTruck, text: "Freshly sealed and shipped islandwide within 24 hours." },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl bg-sand/50 px-4 py-3">
                <Icon className="h-5 w-5 shrink-0 text-spice" />
                <span className="text-sm text-cocoa">{text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {view === "failed" ? (
            <>
              <Link href="/checkout" className={buttonClass({ variant: "primary" })}>
                Try again <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className={buttonClass({ variant: "outline" })}>
                Continue shopping
              </Link>
            </>
          ) : (
            <>
              <Link href="/products" className={buttonClass({ variant: "primary" })}>
                Continue shopping <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/" className={buttonClass({ variant: "outline" })}>
                Back to home
              </Link>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
