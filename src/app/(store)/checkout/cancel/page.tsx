import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/Button";
import { IconX, IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  robots: { index: false },
};

export default function CancelPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-clay bg-cream p-8 text-center sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-spice/10 text-spice">
          <IconX className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-cocoa sm:text-4xl">
          Payment cancelled
        </h1>
        <p className="mt-3 text-cocoa-soft">
          No charge was made and your basket has been saved. You can pick up right where
          you left off whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className={buttonClass({ variant: "primary" })}>
            Return to checkout <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/cart" className={buttonClass({ variant: "outline" })}>
            View basket
          </Link>
        </div>
      </div>
    </Container>
  );
}
