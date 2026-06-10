"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product, i) => (
        // Each card triggers its own entrance, so cards filtered back in
        // (e.g. after clearing the search) reliably re-appear.
        <motion.div
          key={product.id}
          className="flex"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.55, ease: EASE, delay: Math.min(i, 8) * 0.06 }}
        >
          <ProductCard product={product} className="w-full" />
        </motion.div>
      ))}
    </div>
  );
}
