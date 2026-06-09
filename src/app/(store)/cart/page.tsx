"use client";

import Link from "next/link";
import {
  cartSubtotal,
  shippingFor,
  FREE_SHIPPING_THRESHOLD,
  useCart,
} from "@/lib/cart-store";
import { formatLKR } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import {
  IconArrowRight,
  IconBag,
  IconTrash,
  IconLock,
  IconTruck,
} from "@/components/icons";

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart();
  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center gap-5 py-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-spice">
          <IconBag className="h-9 w-9" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-cocoa">
          Your basket is empty
        </h1>
        <p className="max-w-sm text-cocoa-soft">
          Heritage Sri Lankan curries, ready in minutes. Let&apos;s find your next favourite.
        </p>
        <Link href="/products" className={buttonClass({ variant: "primary", size: "lg" })}>
          Browse the pantry <IconArrowRight className="h-5 w-5" />
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-display text-4xl font-semibold text-cocoa">Your basket</h1>
      <p className="mt-2 text-cocoa-soft">
        {items.length} {items.length === 1 ? "product" : "products"} ready to ship
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-clay border-y border-clay">
          {items.map((item) => (
            <li key={item.slug} className="flex gap-4 py-6 sm:gap-6">
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand/40 sm:h-28 sm:w-28"
              >
                <ProductImage
                  product={{
                    image: item.image,
                    name: item.name,
                    weight: item.weight,
                    accent: item.accent,
                    id: item.slug,
                  }}
                  sizes="112px"
                  className="p-2"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="eyebrow text-gold-dark">{item.category}</span>
                    <Link
                      href={`/products/${item.slug}`}
                      className="mt-1 block font-display text-lg font-semibold text-cocoa transition-colors hover:text-spice"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-cocoa-soft">Net {item.weight}</p>
                  </div>
                  <span className="font-display text-lg font-semibold text-spice">
                    {formatLKR(item.price * item.quantity)}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(q) => setQuantity(item.slug, q)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-cocoa-soft transition-colors hover:text-spice"
                  >
                    <IconTrash className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-3xl border border-clay bg-sand/40 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-semibold text-cocoa">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
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
            {remaining > 0 && (
              <p className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2 text-xs text-cocoa-soft">
                <IconTruck className="h-4 w-4 text-leaf" />
                Add {formatLKR(remaining)} more for free delivery
              </p>
            )}
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-clay pt-4">
            <span className="font-display text-lg font-semibold text-cocoa">Total</span>
            <span className="font-display text-xl font-semibold text-spice">
              {formatLKR(subtotal + shipping)}
            </span>
          </div>
          <Link
            href="/checkout"
            className={buttonClass({ variant: "primary", size: "lg", className: "mt-6 w-full" })}
          >
            Proceed to checkout <IconArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-cocoa-soft">
            <IconLock className="h-3.5 w-3.5 text-leaf" /> Secure payment via PayHere
          </p>
          <Link
            href="/products"
            className="mt-2 block text-center text-sm text-cocoa-soft transition-colors hover:text-spice"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </Container>
  );
}
