"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
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

const EASE = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const reduce = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = cartCount(items);

  const lastY = useRef(0);
  const { scrollY, scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  // Hide on scroll-down, reveal on scroll-up.
  useMotionValueEvent(scrollY, "change", (y) => {
    if (mobileOpen) return;
    const diff = y - lastY.current;
    if (y > 180 && diff > 6) setHidden(true);
    else if (diff < -6 || y < 180) setHidden(false);
    lastY.current = y;
  });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        aria-hidden
        className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-gold"
        style={{ scaleX: progressX }}
      />

      <header className="sticky top-0 z-40">
        <motion.div
          // Fade in place on load so the bar is the first thing present at the
          // top. The off-screen slide is reserved for the scroll hide/reveal
          // below (driven by `hidden`), not the initial entrance.
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: hidden ? -110 : 0, opacity: 1 }}
          transition={{ y: { duration: 0.4, ease: EASE }, opacity: { duration: 0.3 } }}
          className="will-change-transform"
        >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
          <Link href="/" className="text-cocoa" aria-label="Serendib Prime - home">
            <Logo className="h-11 sm:h-12" />
          </Link>

          <div className="hidden items-center gap-1 rounded-full glass border border-clay/60 px-3 py-2 shadow-sm md:flex">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-base font-medium tracking-wide transition-colors",
                    active ? "text-spice" : "text-cocoa hover:text-spice",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-spice/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
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
                <motion.span
                  key={count}
                  initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-spice px-1 text-[0.65rem] font-bold text-cream"
                >
                  {count}
                </motion.span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setHidden(false);
                setMobileOpen((o) => !o);
              }}
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
              transition={{ duration: 0.28, ease: EASE }}
              className="mx-4 overflow-hidden rounded-2xl border border-clay/70 glass shadow-lg md:hidden"
            >
              <div className="flex flex-col gap-1 p-3">
                {LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.3, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-cocoa/5 hover:text-spice",
                        isActive(link.href) ? "text-spice" : "text-cocoa",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </header>
    </>
  );
}
