"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, buttonClass } from "@/components/ui/Button";
import { IconBag, IconCheck } from "@/components/icons";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

const POP = { type: "spring", stiffness: 500, damping: 24 } as const;

/** Springs the icon/label swap in whenever the keyed state toggles. */
function PopSwap({ id, children }: { id: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      key={id}
      initial={reduce ? false : { scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={POP}
      className="flex items-center gap-2"
    >
      {children}
    </motion.span>
  );
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
  full = false,
  disabled = false,
  label = "Add to cart",
}: {
  product: Product;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  full?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  if (disabled) {
    return (
      <Button
        variant="primary"
        size={size}
        disabled
        className={full ? "w-full" : ""}
        aria-label={`${product.name} is out of stock`}
      >
        <IconBag className="h-5 w-5" /> Out of stock
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      onClick={handleAdd}
      className={full ? "w-full" : ""}
      aria-label={`Add ${product.name} to cart`}
    >
      <PopSwap id={added ? "added" : "add"}>
        {added ? (
          <>
            <IconCheck className="h-5 w-5" /> Added
          </>
        ) : (
          <>
            <IconBag className="h-5 w-5" /> {label}
          </>
        )}
      </PopSwap>
    </Button>
  );
}

/** Compact icon+text add button for product cards. */
export function AddToCartMini({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      aria-label={`Add ${product.name} to cart`}
      className={buttonClass({
        variant: "primary",
        size: "sm",
        className: "rounded-full",
      })}
    >
      <PopSwap id={added ? "added" : "add"}>
        {added ? <IconCheck className="h-4 w-4" /> : <IconBag className="h-4 w-4" />}
        {added ? "Added" : "Add"}
      </PopSwap>
    </button>
  );
}
