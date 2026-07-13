"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartSubtotal, shippingFor, useCart } from "@/lib/cart-store";
import { formatLKR, makeOrderRef } from "@/lib/utils";
import type { BankAccount } from "@/lib/bank";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import {
  Spinner,
  IconLock,
  IconArrowRight,
  IconBag,
  IconX,
  IconCheck,
  IconChevronDown,
} from "@/components/icons";
import type { PaymentMethod } from "@/lib/types";
import { ONLINE_PAYMENT_ENABLED } from "@/lib/site";

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

const RECEIPT_MAX_BYTES = 5 * 1024 * 1024; // 5MB - matches the bucket limit
const RECEIPT_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

type PaymentOption = { value: PaymentMethod; label: string; description: string };

const ALL_PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: "payhere",
    label: "Online payment",
    description: "Pay securely by card or eZ Cash via PayHere.",
  },
  {
    value: "bank",
    label: "Bank transfer",
    description: "Transfer to our account and upload your receipt.",
  },
  {
    value: "cod",
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives.",
  },
];

export function CheckoutClient({ bankAccounts }: { bankAccounts: BankAccount[] }) {
  const router = useRouter();
  const { items, clear } = useCart();

  // Bank transfer is hidden entirely when no owner accounts are configured.
  // Online payment stays visible but is shown disabled ("coming soon") while
  // PayHere is switched off, so it can't be selected. The default method is the
  // first option that is actually selectable.
  const paymentOptions = ALL_PAYMENT_OPTIONS.filter(
    (o) => o.value !== "bank" || bankAccounts.length > 0,
  );
  const isMethodDisabled = (value: PaymentMethod) =>
    value === "payhere" && !ONLINE_PAYMENT_ENABLED;

  const [form, setForm] = useState<Customer>(EMPTY);
  const [method, setMethod] = useState<PaymentMethod>(
    paymentOptions.find((o) => !isMethodDisabled(o.value))?.value ?? "cod",
  );
  const [bankAccountId, setBankAccountId] = useState<string>(bankAccounts[0]?.id ?? "");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Customer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // A reference the customer uses for the transfer; reused as the order id so
  // the receipt and the order line up. Generated once per visit.
  const [orderRef] = useState<string>(() => makeOrderRef());

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const selectedAccount = bankAccounts.find((a) => a.id === bankAccountId);

  // Bank transfers need an account picked and a receipt attached before placing.
  const bankReady = method !== "bank" || Boolean(selectedAccount && receipt);

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

  function selectReceipt(file: File | undefined) {
    setReceiptError(null);
    if (!file) return;
    if (!RECEIPT_TYPES.includes(file.type)) {
      setReceiptError("Receipt must be a PNG, JPG, WebP or PDF.");
      return;
    }
    if (file.size > RECEIPT_MAX_BYTES) {
      setReceiptError("Receipt must be 5MB or smaller.");
      return;
    }
    setReceipt(file);
  }

  function clearReceipt() {
    setReceipt(null);
    setReceiptError(null);
    if (receiptInputRef.current) receiptInputRef.current.value = "";
  }

  /** Upload the receipt and return its stored path (null in demo mode). */
  async function uploadReceipt(): Promise<string | null> {
    const fd = new FormData();
    fd.append("receipt", receipt as File);
    fd.append("orderRef", orderRef);
    const res = await fetch("/api/checkout/receipt", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not upload your receipt.");
    return data.path ?? null;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    if (method === "bank" && !selectedAccount) {
      setSubmitError("Please choose the bank account you transferred to.");
      return;
    }
    if (method === "bank" && !receipt) {
      setReceiptError("Please attach your transfer receipt.");
      return;
    }

    setSubmitting(true);
    try {
      let receiptPath: string | null = null;
      if (method === "bank") receiptPath = await uploadReceipt();

      const res = await fetch("/api/payhere/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customer: form,
          paymentMethod: method,
          ...(method === "bank" && {
            orderRef,
            bankAccount: selectedAccount
              ? `${selectedAccount.bankName} · ${selectedAccount.accountNumber}`
              : "",
            receiptPath,
          }),
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

      // COD / bank transfer: order is persisted as pending, go straight to the
      // confirmation. Demo mode (PayHere unconfigured) flags itself for the
      // success page's demo notice.
      clear();
      const demoFlag = data.mode === "demo" ? "&demo=1" : "";
      router.push(`/checkout/success?order=${data.orderRef}${demoFlag}`);
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

          <fieldset className="rounded-3xl border border-clay bg-cream p-6">
            <legend className="px-2 font-display text-lg font-semibold text-cocoa">
              Payment method
            </legend>
            <div className="space-y-3">
              {paymentOptions.map((opt) => {
                const disabled = isMethodDisabled(opt.value);
                return (
                  <label
                    key={opt.value}
                    aria-disabled={disabled}
                    className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                      disabled
                        ? "cursor-not-allowed border-clay bg-sand/30 opacity-70"
                        : method === opt.value
                          ? "cursor-pointer border-spice bg-spice/5"
                          : "cursor-pointer border-clay hover:border-cocoa-soft/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={method === opt.value}
                      onChange={() => setMethod(opt.value)}
                      disabled={disabled}
                      className="mt-1 h-4 w-4 shrink-0 accent-spice disabled:cursor-not-allowed"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-cocoa">{opt.label}</span>
                        {disabled && (
                          <span className="rounded-full bg-cocoa/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-cocoa-soft">
                            Coming soon
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-cocoa-soft">
                        {disabled
                          ? "Temporarily unavailable - we're finalising secure card payments."
                          : opt.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Bank transfer: pick an account, see the reference, upload receipt. */}
            {method === "bank" && (
              <div className="mt-5 space-y-4 border-t border-clay pt-5">
                {bankAccounts.length > 1 && (
                  <BankAccountSelect
                    accounts={bankAccounts}
                    value={bankAccountId}
                    onChange={setBankAccountId}
                  />
                )}

                {selectedAccount && (
                  <div className="rounded-2xl border border-clay bg-sand/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cocoa-soft">
                      Transfer to this account
                    </p>
                    <dl className="mt-4 divide-y divide-clay/50 text-sm">
                      {[
                        { label: "Account name", value: selectedAccount.accountName, accent: false },
                        { label: "Account number", value: selectedAccount.accountNumber, accent: false },
                        { label: "Bank", value: selectedAccount.bankName, accent: false },
                        { label: "Branch", value: selectedAccount.branch, accent: false },
                        { label: "Amount", value: formatLKR(total), accent: true },
                        { label: "Reference", value: orderRef, accent: true },
                      ]
                        .filter((r) => r.value)
                        .map(({ label, value, accent }) => (
                          <div
                            key={label}
                            className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 py-2.5 first:pt-0 last:pb-0"
                          >
                            <dt className="text-cocoa-soft">{label}</dt>
                            <dd
                              className={`break-words font-semibold ${
                                accent ? "text-spice" : "text-cocoa"
                              }`}
                            >
                              {value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                )}

                <p className="text-sm leading-relaxed text-cocoa-soft">
                  Transfer the amount above using{" "}
                  <strong className="text-cocoa">{orderRef}</strong> as the payment reference,
                  then upload your receipt to place the order.
                </p>

                {/* Receipt upload */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-cocoa">
                    Payment receipt
                  </span>
                  <input
                    ref={receiptInputRef}
                    id="receipt_file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="sr-only"
                    onChange={(e) => selectReceipt(e.target.files?.[0])}
                  />
                  {receipt ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-clay bg-cream p-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-leaf/10 text-leaf">
                        <IconLock className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-cocoa">
                        {receipt.name}
                      </span>
                      <button
                        type="button"
                        onClick={clearReceipt}
                        className="inline-flex items-center gap-1 text-sm text-cocoa-soft transition-colors hover:text-spice"
                      >
                        <IconX className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => receiptInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-clay bg-cream px-6 py-7 text-center transition-colors hover:border-spice/60"
                    >
                      <span className="text-sm font-medium text-cocoa">
                        Upload receipt - <span className="text-spice">browse</span>
                      </span>
                      <span className="text-xs text-cocoa-soft">
                        Photo or PDF of your transfer - up to 5MB
                      </span>
                    </button>
                  )}
                  {receiptError && (
                    <p role="alert" className="mt-2 text-sm text-spice">
                      {receiptError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </fieldset>

          {method === "payhere" && (
            <div className="flex items-center gap-3 rounded-2xl bg-sand/60 px-4 py-3 text-sm text-cocoa-soft">
              <IconLock className="h-5 w-5 shrink-0 text-leaf" />
              You&apos;ll be redirected to PayHere&apos;s secure gateway to complete payment. We never
              store your card details.
            </div>
          )}
          {method === "cod" && (
            <div className="flex items-center gap-3 rounded-2xl bg-sand/60 px-4 py-3 text-sm text-cocoa-soft">
              <IconLock className="h-5 w-5 shrink-0 text-leaf" />
              Pay in cash when your order is delivered. No payment is taken now.
            </div>
          )}
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
            disabled={submitting || !bankReady}
            className={buttonClass({ variant: "primary", size: "lg", className: "mt-5 w-full" })}
          >
            {submitting ? (
              <>
                <Spinner className="h-5 w-5" />{" "}
                {method === "payhere" ? "Redirecting…" : "Placing order…"}
              </>
            ) : (
              <>
                <IconLock className="h-5 w-5" />{" "}
                {method === "payhere" ? `Pay ${formatLKR(total)}` : "Place order"}
              </>
            )}
          </button>
          {method === "bank" && !bankReady && (
            <p className="mt-2 text-center text-xs text-cocoa-soft">
              Choose an account and upload your receipt to continue.
            </p>
          )}
          <p className="mt-3 text-center text-xs text-cocoa-soft">
            {method === "payhere"
              ? "Secured by PayHere · Visa, Mastercard, eZ Cash & more"
              : method === "bank"
                ? "Bank transfer · We'll confirm once your receipt is verified"
                : "Cash on delivery · Pay when your order arrives"}
          </p>
        </aside>
      </form>
    </Container>
  );
}

/** Custom, fully-styleable account picker (native <select> popups can't be themed). */
function BankAccountSelect({
  accounts,
  value,
  onChange,
}: {
  accounts: BankAccount[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = accounts.find((a) => a.id === value);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <span className="mb-1.5 block text-sm font-medium text-cocoa">Transfer to</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-cream px-4 py-2.5 text-left text-sm text-cocoa transition-colors focus-visible:outline-spice ${
          open ? "border-spice" : "border-clay hover:border-spice/60"
        }`}
      >
        <span className="truncate">
          {selected ? (
            <>
              <span className="font-medium">{selected.bankName}</span>
              <span className="text-cocoa-soft"> - {selected.accountNumber}</span>
            </>
          ) : (
            "Select an account"
          )}
        </span>
        <IconChevronDown
          className={`h-4 w-4 shrink-0 text-cocoa-soft transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-clay bg-cream shadow-xl shadow-cocoa/10"
        >
          {accounts.map((a) => {
            const active = a.id === value;
            return (
              <li key={a.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(a.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    active ? "bg-spice/10 text-spice" : "text-cocoa hover:bg-sand/60"
                  }`}
                >
                  <span className="truncate">
                    <span className="font-medium">{a.bankName}</span>
                    <span className={active ? "text-spice/80" : "text-cocoa-soft"}>
                      {" "}
                      - {a.accountNumber}
                    </span>
                  </span>
                  {active && <IconCheck className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
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
