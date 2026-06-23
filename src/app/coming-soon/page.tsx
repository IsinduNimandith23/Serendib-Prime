import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launching Soon",
  description:
    "Serendib Prime is putting the finishing touches on our online store. Premium ready-to-eat Sri Lankan tinned seafood - tempered & curried, sealed fresh. Back very soon.",
};

const EMAIL = "serendibprime587@gmail.com";

export default function ComingSoonPage() {
  return (
    <main className="grain relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden bg-cream px-6 py-16 text-center">
      {/* Decorative floating colour washes */}
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-ember/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-gold/20 blur-3xl"
        style={{ animationDelay: "-4s" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-seafoam/10 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Serendib Prime"
          className="mb-10 h-36 w-auto md:h-44"
        />

        <span className="my-6 font-display text-4xl font-extrabold uppercase tracking-widest text-gold sm:text-5xl md:text-6xl">
          Launching Soon
        </span>

        <h1 className="mt-5 text-balance font-display text-2xl leading-[1.15] text-spice sm:text-3xl md:text-4xl">
          Something delicious is on its way.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cocoa-soft">
          We&rsquo;re putting the finishing touches on our online store. Premium
          ready-to-eat Sri Lankan tinned seafood - tempered &amp; curried
          the island way, sealed fresh and ready in minutes.
        </p>

        {/* Accent divider */}
        <div className="mt-10 flex items-center gap-3" aria-hidden>
          <span className="h-px w-12 bg-clay" />
          <span className="h-2 w-2 rotate-45 bg-gold" />
          <span className="h-px w-12 bg-clay" />
        </div>

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-cocoa-soft">
          Get in touch in the meantime
        </p>

        {/* Contact actions */}
        <div className="mt-5 flex justify-center">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center justify-center rounded-full border border-spice/25 px-7 py-3 font-semibold text-spice transition-colors hover:border-spice hover:bg-spice hover:text-cream"
          >
            {EMAIL}
          </a>
        </div>

        <p className="mt-12 text-sm text-cocoa-soft">
          <span className="font-semibold text-cocoa">Islandwide delivery</span>
        </p>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-clay">
          &copy; {new Date().getFullYear()} Serendib Prime
        </p>
      </div>
    </main>
  );
}
