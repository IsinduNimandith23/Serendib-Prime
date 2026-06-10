import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/visual/Logo";
import { FishMotif } from "@/components/visual/SeaMotif";
import {
  IconInstagram,
  IconFacebook,
  IconWhatsApp,
  IconMail,
  IconPhone,
} from "@/components/icons";

const SHOP_LINKS = [
  { href: "/products", label: "All products" },
  { href: "/products?category=Tempered", label: "Tempered Sprats" },
  { href: "/products?category=Curries", label: "Sprats Curries" },
  { href: "/about", label: "Our Story" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/products", label: "Shop" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-night text-cream/80">
      <FishMotif className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 text-cream opacity-[0.04]" />
      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Link href="/" className="text-cream" aria-label="Serendib Prime - home">
              <Logo className="h-16" />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-cream/60">
              Premium Sri Lankan tinned seafood - dried sprats tempered and
              curried the island way, sealed fresh and ready in minutes.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: IconInstagram, label: "Instagram", href: "#" },
                { Icon: IconFacebook, label: "Facebook", href: "#" },
                { Icon: IconWhatsApp, label: "WhatsApp", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-seafoam hover:text-seafoam"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div>
            <h3 className="eyebrow mb-4 text-seafoam">Get in touch</h3>
            <ul className="space-y-3 text-sm text-cream/70">
              <li className="flex items-center gap-3">
                <IconPhone className="h-4 w-4 shrink-0 text-seafoam" />
                <a href="tel:+94112345678" className="transition-colors hover:text-seafoam">
                  +94 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IconMail className="h-4 w-4 shrink-0 text-seafoam" />
                <a href="mailto:hello@serendibprime.lk" className="transition-colors hover:text-seafoam">
                  hello@serendibprime.lk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Serendib Prime. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Secure payments by</span>
            <span className="rounded-md bg-cream/10 px-2.5 py-1 font-semibold tracking-wide text-cream/80">
              PayHere
            </span>
            <span className="text-cream/40">Visa · Mastercard · eZ Cash</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow mb-4 text-seafoam">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-cream/70 transition-colors hover:text-seafoam"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
