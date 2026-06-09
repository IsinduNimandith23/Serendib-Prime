"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "./ProductGrid";

const CATEGORIES = ["All", "Tempered", "Curries"] as const;

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export function ProductsExplorer({
  products,
  initialCategory,
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState<string>(
    CATEGORIES.includes((initialCategory ?? "All") as (typeof CATEGORIES)[number])
      ? (initialCategory ?? "All")
      : "All",
  );
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const filtered =
      category === "All"
        ? products
        : products.filter((p) => p.category === category);
    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }
    return sorted;
  }, [products, category, sort]);

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat)}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-spice bg-spice text-cream"
                    : "border-clay bg-cream text-cocoa hover:border-spice hover:text-spice",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-cocoa-soft">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer rounded-full border border-clay bg-cream px-4 py-2 text-sm font-medium text-cocoa focus-visible:outline-spice"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-cocoa-soft">
        Showing <strong className="text-cocoa">{visible.length}</strong>{" "}
        {visible.length === 1 ? "product" : "products"}
        {category !== "All" && ` in ${category}`}
      </p>

      {visible.length > 0 ? (
        <ProductGrid key={`${category}-${sort}`} products={visible} className="mt-6" />
      ) : (
        <p className="mt-16 text-center text-cocoa-soft">
          No products in this category yet - check back soon.
        </p>
      )}
    </Container>
  );
}
