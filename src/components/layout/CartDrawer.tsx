"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn, formatLKR } from "@/lib/utils";
import { cartSubtotal, shippingFor, shippingNote, useCart } from "@/lib/cart-store";
import { buttonClass } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { IconX, IconBag, IconTrash, IconArrowRight } from "@/components/icons";
import { startLenis, stopLenis } from "@/lib/smooth-scroll";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem } = useCart();
  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal, items);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) stopLenis();
    else startLenis();
    return () => {
      document.body.style.overflow = "";
      startLenis();
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.div
            className="absolute inset-0 bg-night/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-clay px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-cocoa">
                <IconBag className="h-5 w-5 text-spice" /> Your basket
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cocoa/5"
              >
                <IconX className="h-5 w-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-spice">
                  <IconBag className="h-7 w-7" />
                </div>
                <p className="font-display text-lg text-cocoa">Your basket is empty</p>
                <p className="text-sm text-cocoa-soft">
                  Real Sri Lankan flavour, ready in minutes - let&apos;s fix that.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className={buttonClass({ variant: "primary", className: "mt-2" })}
                >
                  Browse the pantry <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-clay overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.slug} className="flex gap-4 py-4">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand/40"
                      >
                        <ProductImage
                          product={{
                            image: item.image,
                            name: item.name,
                            weight: item.weight,
                            accent: item.accent,
                            id: item.slug,
                          }}
                          sizes="80px"
                          className="p-1.5"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-cocoa">{item.name}</p>
                            <p className="text-xs text-cocoa-soft">Net {item.weight}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.slug)}
                            aria-label={`Remove ${item.name}`}
                            className="cursor-pointer text-cocoa-soft transition-colors hover:text-spice"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(q) => setQuantity(item.slug, q)}
                          />
                          <span className="font-semibold text-spice">
                            {formatLKR(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-clay px-5 py-4">
                  <div className="flex items-center justify-between text-sm text-cocoa-soft">
                    <span>Subtotal</span>
                    <span className="font-medium text-cocoa">{formatLKR(subtotal)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm text-cocoa-soft">
                    <span>Delivery</span>
                    <span className="font-medium text-cocoa">
                      {formatLKR(shipping)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-cocoa-soft">{shippingNote(items)}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-clay pt-3">
                    <span className="font-display text-lg font-semibold text-cocoa">Total</span>
                    <span className="font-display text-lg font-semibold text-spice">
                      {formatLKR(subtotal + shipping)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className={buttonClass({
                      variant: "primary",
                      size: "lg",
                      className: "mt-4 w-full",
                    })}
                  >
                    Checkout <IconArrowRight className="h-5 w-5" />
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 w-full cursor-pointer py-2 text-center text-sm text-cocoa-soft transition-colors hover:text-spice"
                  >
                    Continue shopping
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
