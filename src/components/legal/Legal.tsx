import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/motion";

/** Shared support contact details, used across all legal pages. */
export const SUPPORT_EMAIL = "serendibprime587@gmail.com";
export const SUPPORT_PHONE_DISPLAY = "077 051 2383";
export const SUPPORT_PHONE_TEL = "+94770512383";

/** Inline mailto link styled to match the body copy. */
export function MailLink({ children }: { children?: ReactNode }) {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="font-medium text-spice underline-offset-2 hover:underline"
    >
      {children ?? SUPPORT_EMAIL}
    </a>
  );
}

/** Wraps the readable body column of a legal document. */
export function LegalBody({ children }: { children: ReactNode }) {
  return (
    <Container className="py-16 sm:py-20">
      <Reveal className="mx-auto max-w-3xl space-y-10">{children}</Reveal>
    </Container>
  );
}

/** A numbered section with a display heading. */
export function LegalSection({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-28">
      <h2 className="flex items-baseline gap-3 font-display text-2xl font-semibold text-cocoa">
        <span className="text-gold">{n}.</span>
        <span>{title}</span>
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-cocoa-soft">
        {children}
      </div>
    </section>
  );
}

/** A bulleted list with on-brand markers. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Closing contact card shown at the foot of each legal page. */
export function LegalContact() {
  return (
    <section className="rounded-3xl border border-clay bg-sand/40 p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-cocoa">
        Serendib Prime
      </h2>
      <ul className="mt-4 space-y-2 text-sm text-cocoa-soft">
        <li>
          Email: <MailLink />
        </li>
        <li>
          Phone:{" "}
          <a
            href={`tel:${SUPPORT_PHONE_TEL}`}
            className="font-medium text-spice underline-offset-2 hover:underline"
          >
            {SUPPORT_PHONE_DISPLAY}
          </a>
        </li>
      </ul>
    </section>
  );
}
