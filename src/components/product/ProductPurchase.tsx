"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "./QuantityStepper";
import { AddToCartButton } from "./AddToCartButton";
import { useCart } from "@/lib/cart-store";
import { IconArrowRight } from "@/components/icons";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  function buyNow() {
    addItem(product, qty);
    router.push("/checkout");
  }

  if (!product.inStock) {
    return (
      <div className="flex flex-col gap-2">
        <AddToCartButton product={product} size="lg" full disabled />
        <p className="text-sm text-cocoa-soft">
          This product is currently sold out. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <QuantityStepper value={qty} onChange={setQty} className="h-12 self-start" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <AddToCartButton product={product} quantity={qty} size="lg" full />
        </div>
        <Button variant="gold" size="lg" onClick={buyNow} className="flex-1">
          Buy it now
          <IconArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}
