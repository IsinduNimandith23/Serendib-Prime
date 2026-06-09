"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/visual/Logo";
import { IconBag, IconMenu, IconX } from "@/components/icons";
import { cartCount, useCart } from "@/lib/cart-store";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "glass border-b border-clay/70 shadow-sm" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <Link href="/" className="text-cocoa" aria-label="Serendib Prime - home">
          <Logo className="h-11 sm:h-12" />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium tracking-wide text-cocoa transition-colors hover:text-spice",
                  active && "text-spice",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-spice" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cocoa/5 hover:text-spice"
          >
            <IconBag className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-spice px-1 text-[0.65rem] font-bold text-cream">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cocoa/5 md:hidden"
          >
            {mobileOpen ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-clay/70 glass md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-cocoa transition-colors hover:bg-cocoa/5 hover:text-spice"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
