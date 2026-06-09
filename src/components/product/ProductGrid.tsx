"use client";

import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <Stagger
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <StaggerItem key={product.id} className="flex">
          <ProductCard product={product} className="w-full" />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
