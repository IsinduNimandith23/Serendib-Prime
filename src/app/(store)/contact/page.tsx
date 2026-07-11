import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/motion";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
} from "@/components/legal/Legal";
import {
  IconPhone,
  IconMail,
  IconWhatsApp,
  IconClock,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about our tinned sprats, wholesale or delivery? Get in touch with the Serendib Prime team.",
  alternates: { canonical: "/contact" },
};

const DETAILS = [
  {
    Icon: IconPhone,
    label: "Call us",
    value: SUPPORT_PHONE_DISPLAY,
    href: `tel:${SUPPORT_PHONE_TEL}`,
  },
  {
    Icon: IconMail,
    label: "Email us",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    Icon: IconWhatsApp,
    label: "WhatsApp",
    value: SUPPORT_PHONE_DISPLAY,
    href: `https://wa.me/${SUPPORT_PHONE_TEL.replace("+", "")}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        intro="Questions about a recipe, a wholesale enquiry, or just want to say hello? Drop us a line."
      />

      <Container className="grid gap-10 py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-cocoa">Get in touch</h2>
          <p className="mt-2 text-cocoa-soft">
            Our kitchen team is here Monday to Saturday and replies within one business day.
          </p>

          <div className="mt-8 space-y-4">
            {DETAILS.map(({ Icon, label, value, href }) => {
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-clay bg-cream p-4 transition-colors hover:border-spice/40">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-spice/10 text-spice">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-cocoa-soft">{label}</p>
                    <p className="font-medium text-cocoa">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} className="block">
                  {content}
                </a>
              ) : (
                <div key={label}>{content}</div>
              );
            })}

            <div className="flex items-start gap-4 rounded-2xl border border-clay bg-sand/50 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                <IconClock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-cocoa-soft">Opening hours</p>
                <p className="font-medium text-cocoa">Mon–Sat · 9:00 – 18:00</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-2xl font-semibold text-cocoa">Send us a message</h2>
          <p className="mt-2 text-cocoa-soft">
            Fill in the form below and we&apos;ll get back to you shortly.
          </p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </>
  );
}
