import Link from "next/link";
import { Logo } from "@/components/visual/Logo";
import { buttonClass } from "@/components/ui/Button";

/** Shown when Supabase env vars are missing — guides the owner through setup. */
export function AdminNotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-lg rounded-[2rem] border border-clay bg-cream p-8 sm:p-10">
        <Link href="/" className="text-cocoa">
          <Logo className="h-11" />
        </Link>
        <h1 className="mt-8 font-display text-2xl font-semibold text-cocoa">
          Admin isn&apos;t connected yet
        </h1>
        <p className="mt-2 text-cocoa-soft">
          To manage products and orders, connect your Supabase project:
        </p>
        <ol className="mt-5 space-y-3 text-sm text-cocoa">
          {[
            "Create a free project at supabase.com",
            "Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to .env.local",
            "Run supabase/schema.sql (and seed.sql) in the SQL editor",
            "Create an admin user under Authentication → Users",
          ].map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-spice/10 text-xs font-semibold text-spice">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 rounded-2xl bg-sand/60 px-4 py-3 text-sm text-cocoa-soft">
          Full instructions are in <code className="text-cocoa">README.md</code>. The
          storefront works without this — it falls back to the bundled catalogue.
        </p>
        <Link href="/" className={buttonClass({ variant: "outline", className: "mt-6" })}>
          Back to store
        </Link>
      </div>
    </div>
  );
}
