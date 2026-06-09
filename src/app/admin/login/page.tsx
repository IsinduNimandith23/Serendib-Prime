import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/visual/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminNotConfigured } from "@/components/admin/NotConfigured";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  if (!isSupabaseConfigured()) return <AdminNotConfigured />;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-clay bg-cream p-8 sm:p-10">
          <Link href="/" className="text-cocoa">
            <Logo className="h-12" />
          </Link>
          <h1 className="mt-8 font-display text-3xl font-semibold text-cocoa">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-cocoa-soft">
            Manage your catalogue and orders.
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-cocoa-soft">
          <Link href="/" className="transition-colors hover:text-spice">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
