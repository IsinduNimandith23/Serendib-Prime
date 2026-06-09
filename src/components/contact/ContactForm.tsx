"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Spinner, IconCheckCircle, IconArrowRight } from "@/components/icons";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-clay bg-cream p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf/10 text-leaf">
          <IconCheckCircle className="h-7 w-7" />
        </span>
        <h3 className="font-display text-2xl font-semibold text-cocoa">Message sent</h3>
        <p className="text-cocoa-soft">
          Thank you for reaching out — we&apos;ll reply within one business day.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-clay bg-cream p-6 sm:p-8"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-cocoa">
            Your name
          </label>
          <input
            id="c-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-clay bg-cream px-4 py-2.5 text-cocoa focus-visible:outline-spice"
          />
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-cocoa">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-clay bg-cream px-4 py-2.5 text-cocoa focus-visible:outline-spice"
          />
        </div>
        <div>
          <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium text-cocoa">
            Message
          </label>
          <textarea
            id="c-message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full resize-none rounded-xl border border-clay bg-cream px-4 py-2.5 text-cocoa focus-visible:outline-spice"
          />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-spice">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className={buttonClass({ variant: "primary", size: "lg", className: "mt-6 w-full" })}
      >
        {sending ? (
          <>
            <Spinner className="h-5 w-5" /> Sending…
          </>
        ) : (
          <>
            Send message <IconArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
}
