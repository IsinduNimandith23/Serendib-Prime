"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { buttonClass } from "@/components/ui/Button";
import { Spinner, IconArrowRight } from "@/components/icons";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-cocoa">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-clay bg-cream px-4 py-2.5 text-cocoa focus-visible:outline-spice"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-cocoa">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-clay bg-cream px-4 py-2.5 text-cocoa focus-visible:outline-spice"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-spice">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={buttonClass({ variant: "primary", size: "lg", className: "w-full" })}
      >
        {loading ? (
          <>
            <Spinner className="h-5 w-5" /> Signing in…
          </>
        ) : (
          <>
            Sign in <IconArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
}
