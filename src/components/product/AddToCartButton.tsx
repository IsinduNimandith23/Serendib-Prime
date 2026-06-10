"use client";

import { useState } from "react";
import { Button, buttonClass } from "@/components/ui/Button";
import { IconBag, IconCheck } from "@/components/icons";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

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
      {added ? (
        <>
          <IconCheck className="h-5 w-5" /> Added
        </>
      ) : (
        <>
          <IconBag className="h-5 w-5" /> {label}
        </>
      )}
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
      {added ? <IconCheck className="h-4 w-4" /> : <IconBag className="h-4 w-4" />}
      {added ? "Added" : "Add"}
    </button>
  );
}
