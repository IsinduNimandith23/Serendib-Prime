"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/visual/Logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { IconArrowUpRight } from "@/components/icons";

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

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-clay bg-cream/90 backdrop-blur">
        <div className="relative flex h-16 items-center">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-cocoa">
                <Logo className="h-11" />
              </Link>
              <nav className="flex items-center gap-1">
                {NAV.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors",
                        active
                          ? "bg-spice text-cream"
                          : "text-cocoa hover:bg-cocoa/5",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden cursor-pointer items-center gap-1.5 rounded-full border border-clay bg-sand/40 px-3.5 py-2 text-[15px] font-semibold text-cocoa transition-colors hover:border-spice hover:bg-spice/10 hover:text-spice sm:flex"
              >
                View store <IconArrowUpRight className="h-4 w-4" />
              </Link>
              <span className="hidden text-[15px] font-medium text-cocoa-soft md:inline">{email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-clay px-3.5 py-2 text-[15px] font-semibold text-cocoa transition-colors hover:border-spice hover:text-spice lg:right-8"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">{children}</main>
    </div>
  );
}
