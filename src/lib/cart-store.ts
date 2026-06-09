"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "./types";

const MAX_QTY = 20;

interface CartState {
  items: CartItem[];
  /** Drawer open state (UI). */
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === product.slug);
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.slug === product.slug
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) }
                  : i,
              ),
            };
          }
          const item: CartItem = {
            slug: product.slug,
            name: product.name,
            price: product.price,
            weight: product.weight,
            accent: product.accent,
            image: product.image,
            category: product.category,
            quantity: Math.min(MAX_QTY, quantity),
          };
          return { isOpen: true, items: [...state.items, item] };
        }),

      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),

      setQuantity: (slug, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) =>
                  i.slug === slug
                    ? { ...i, quantity: Math.min(MAX_QTY, quantity) }
                    : i,
                ),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: "serendib-prime-cart", partialize: (s) => ({ items: s.items }) },
  ),
);

/** Derived totals — call inside a component for reactive updates. */
export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

// Re-exported from the server-safe shipping module for convenience.
export {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
  shippingFor,
} from "./shipping";
