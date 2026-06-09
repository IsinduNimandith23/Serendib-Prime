import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/Button";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";
import { LeafSprig } from "@/components/visual/SpiceMotif";
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

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; demo?: string }>;
}) {
  const { order, demo } = await searchParams;

  return (
    <Container className="py-16 sm:py-24">
      <ClearCartOnMount />
      <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-clay bg-cream p-8 text-center sm:p-12">
        <LeafSprig className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 opacity-10" />
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/10 text-leaf">
          <IconCheckCircle className="h-9 w-9" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-cocoa sm:text-4xl">
          Thank you — your order is confirmed!
        </h1>
        {order && (
          <p className="mt-3 text-cocoa-soft">
            Order reference{" "}
            <strong className="font-semibold text-cocoa">{order}</strong>
          </p>
        )}

        {demo && (
          <p className="mt-5 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-dark">
            <strong>Demo checkout.</strong> No payment was taken. Add your PayHere
            merchant keys to take real payments — see the setup guide.
          </p>
        )}

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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className={buttonClass({ variant: "primary" })}>
            Continue shopping <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className={buttonClass({ variant: "outline" })}>
            Back to home
          </Link>
        </div>
      </div>
    </Container>
  );
}
