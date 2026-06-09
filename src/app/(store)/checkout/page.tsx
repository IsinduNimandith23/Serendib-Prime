"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartSubtotal, shippingFor, useCart } from "@/lib/cart-store";
import { formatLKR } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { Spinner, IconLock, IconArrowRight, IconBag } from "@/components/icons";

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

const EMPTY: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [form, setForm] = useState<Customer>(EMPTY);
  const [errors, setErrors] = useState<Partial<Customer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  function validate(): boolean {
    const e: Partial<Customer> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^[0-9+\s()-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Please enter your address";
    if (!form.city.trim()) e.city = "Please enter your city";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function update(field: keyof Customer, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/payhere/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      if (data.mode === "payhere") {
        const f = document.createElement("form");
        f.method = "POST";
        f.action = data.actionUrl;
        Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = v;
          f.appendChild(input);
        });
        document.body.appendChild(f);
        f.submit();
        return;
      }

      // Demo mode
      clear();
      router.push(`/checkout/success?order=${data.orderRef}&demo=1`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center gap-5 py-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-spice">
          <IconBag className="h-9 w-9" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-cocoa">Nothing to check out</h1>
        <p className="max-w-sm text-cocoa-soft">Add a few curries to your basket first.</p>
        <Link href="/products" className={buttonClass({ variant: "primary", size: "lg" })}>
          Browse the pantry <IconArrowRight className="h-5 w-5" />
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-display text-4xl font-semibold text-cocoa">Checkout</h1>
      <p className="mt-2 text-cocoa-soft">Almost there - tell us where to send your curries.</p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]" noValidate>
        {/* Delivery details */}
        <div className="space-y-6">
          <fieldset className="rounded-3xl border border-clay bg-cream p-6">
            <legend className="px-2 font-display text-lg font-semibold text-cocoa">
              Delivery details
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) => update("name", v)}
                error={errors.name}
                autoComplete="name"
                className="sm:col-span-2"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
                autoComplete="email"
              />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                error={errors.phone}
                autoComplete="tel"
                placeholder="+94 7X XXX XXXX"
              />
              <Field
                label="Address"
                value={form.address}
                onChange={(v) => update("address", v)}
                error={errors.address}
                autoComplete="street-address"
                className="sm:col-span-2"
              />
              <Field
                label="City"
                value={form.city}
                onChange={(v) => update("city", v)}
                error={errors.city}
                autoComplete="address-level2"
              />
              <Field
                label="Postal code (optional)"
                value={form.postalCode}
                onChange={(v) => update("postalCode", v)}
                autoComplete="postal-code"
              />
            </div>
          </fieldset>

          <div className="flex items-center gap-3 rounded-2xl bg-sand/60 px-4 py-3 text-sm text-cocoa-soft">
            <IconLock className="h-5 w-5 shrink-0 text-leaf" />
            You&apos;ll be redirected to PayHere&apos;s secure gateway to complete payment. We never
            store your card details.
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-clay bg-sand/40 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-semibold text-cocoa">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-3">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sand/40">
                  <ProductImage
                    product={{
                      image: item.image,
                      name: item.name,
                      weight: item.weight,
                      accent: item.accent,
                      id: item.slug,
                    }}
                    sizes="48px"
                    className="p-1"
                  />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cocoa px-1 text-[0.65rem] font-bold text-cream">
                    {item.quantity}
                  </span>
                </span>
                <span className="flex-1 text-sm text-cocoa">{item.name}</span>
                <span className="text-sm font-medium text-cocoa">
                  {formatLKR(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-clay pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-cocoa-soft">Subtotal</dt>
              <dd className="font-medium text-cocoa">{formatLKR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa-soft">Delivery</dt>
              <dd className="font-medium text-cocoa">
                {shipping === 0 ? "Free" : formatLKR(shipping)}
              </dd>
            </div>
          </dl>
          <div className="mt-3 flex items-center justify-between border-t border-clay pt-3">
            <span className="font-display text-lg font-semibold text-cocoa">Total</span>
            <span className="font-display text-xl font-semibold text-spice">
              {formatLKR(total)}
            </span>
          </div>

          {submitError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-spice/30 bg-spice/5 px-3 py-2 text-sm text-spice"
            >
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({ variant: "primary", size: "lg", className: "mt-5 w-full" })}
          >
            {submitting ? (
              <>
                <Spinner className="h-5 w-5" /> Redirecting…
              </>
            ) : (
              <>
                <IconLock className="h-5 w-5" /> Pay {formatLKR(total)}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-cocoa-soft">
            Secured by PayHere · Visa, Mastercard, eZ Cash &amp; more
          </p>
        </aside>
      </form>
    </Container>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-cocoa">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-cream px-4 py-2.5 text-cocoa transition-colors placeholder:text-cocoa-soft/60 focus-visible:outline-spice ${
          error ? "border-spice" : "border-clay"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-spice">
          {error}
        </p>
      )}
    </div>
  );
}
