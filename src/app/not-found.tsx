import Link from "next/link";
import { Logo } from "@/components/visual/Logo";
import { buttonClass } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-5 text-center">
      <Link href="/" className="text-cocoa">
        <Logo className="h-12" />
      </Link>
      <p className="eyebrow text-spice">Error 404</p>
      <h1 className="max-w-md text-balance font-display text-4xl font-semibold text-cocoa">
        This page slipped out of the pantry
      </h1>
      <p className="max-w-sm text-cocoa-soft">
        The page you&apos;re after doesn&apos;t exist or has moved. Let&apos;s get you back to the good stuff.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass({ variant: "primary" })}>
          Back to home
        </Link>
        <Link href="/products" className={buttonClass({ variant: "outline" })}>
          Browse the pantry <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
