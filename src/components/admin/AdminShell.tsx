"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/visual/Logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { IconArrowUpRight, IconMenu, IconX } from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(item: (typeof NAV)[number]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-clay bg-cream/90 backdrop-blur">
        <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Centered label (mobile only) */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-lg font-semibold text-cocoa lg:hidden">
            Admin
          </span>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-cocoa">
              <Logo className="h-10 sm:h-11" />
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors",
                    isActive(item)
                      ? "bg-spice text-cream"
                      : "text-cocoa hover:bg-cocoa/5",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-clay bg-sand/40 px-3.5 py-2 text-[15px] font-semibold text-cocoa transition-colors hover:border-spice hover:bg-spice/10 hover:text-spice"
            >
              View store <IconArrowUpRight className="h-4 w-4" />
            </Link>
            <span className="hidden text-[15px] font-medium text-cocoa-soft xl:inline">
              {email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="cursor-pointer rounded-full border border-clay px-3.5 py-2 text-[15px] font-semibold text-cocoa transition-colors hover:border-spice hover:text-spice"
            >
              Sign out
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative h-9 w-9 cursor-pointer rounded-full border border-clay text-cocoa transition-colors hover:border-spice hover:text-spice lg:hidden"
          >
            <IconMenu
              className={cn(
                "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out-soft",
                menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
              )}
            />
            <IconX
              className={cn(
                "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out-soft",
                menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
              )}
            />
          </button>
        </div>

        {/* Mobile menu panel - animates open/closed via a collapsing grid row */}
        <div
          className={cn(
            "grid overflow-hidden transition-all duration-300 ease-out-soft lg:hidden",
            menuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "invisible grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 overflow-hidden border-t border-clay bg-cream">
            <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-colors",
                    isActive(item)
                      ? "bg-spice text-cream"
                      : "text-cocoa hover:bg-cocoa/5",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-2 border-t border-clay pt-3">
                {email && (
                  <span className="px-1 text-sm font-medium text-cocoa-soft">
                    {email}
                  </span>
                )}
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-clay bg-sand/40 px-3.5 py-2.5 text-[15px] font-semibold text-cocoa transition-colors hover:border-spice hover:bg-spice/10 hover:text-spice"
                >
                  View store <IconArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="cursor-pointer rounded-full border border-clay px-3.5 py-2.5 text-[15px] font-semibold text-cocoa transition-colors hover:border-spice hover:text-spice"
                >
                  Sign out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
