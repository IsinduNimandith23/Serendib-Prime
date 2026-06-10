"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "./ProductGrid";
import { IconSearch, IconSliders, IconX } from "@/components/icons";

const CATEGORIES = ["All", "Tempered", "Curries"] as const;

const SPICE_OPTIONS: { level: number; label: string }[] = [
  { level: 0, label: "Mild" },
  { level: 1, label: "Gentle" },
  { level: 2, label: "Medium" },
  { level: 3, label: "Fiery" },
];

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
  const [spice, setSpice] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const counts = useMemo(() => {
    const byCategory: Record<string, number> = { All: products.length };
    const bySpice: Record<number, number> = {};
    for (const p of products) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
      bySpice[p.spiceLevel] = (bySpice[p.spiceLevel] ?? 0) + 1;
    }
    return { byCategory, bySpice };
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (spice.length > 0 && !spice.includes(p.spiceLevel)) return false;
      if (inStockOnly && !p.inStock) return false;
      if (q) {
        const haystack = [
          p.name,
          p.nameSi,
          p.nameTa,
          p.tagline,
          p.shortDescription,
          p.description,
          ...p.ingredients,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

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
        sorted.sort(
          (a, b) =>
            Number(b.inStock) - Number(a.inStock) ||
            Number(b.featured) - Number(a.featured) ||
            b.rating - a.rating,
        );
    }
    return sorted;
  }, [products, category, spice, inStockOnly, query, sort]);

  const hasActiveFilters =
    category !== "All" || spice.length > 0 || inStockOnly || query.trim() !== "";

  function toggleSpice(level: number) {
    setSpice((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }

  function resetAll() {
    setCategory("All");
    setSpice([]);
    setInStockOnly(false);
    setQuery("");
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10 xl:grid-cols-[16rem_1fr]">
        {/* Filters sidebar */}
        <aside
          className={cn(
            "mb-6 lg:mb-0 lg:block",
            showFilters ? "block" : "hidden",
          )}
        >
          <div className="lg:sticky lg:top-28">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-cocoa">
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-sm font-medium text-spice transition-colors hover:text-spice-dark"
                >
                  Clear all
                </button>
              )}
            </div>

            <FilterGroup title="Category">
              {CATEGORIES.map((cat) => (
                <OptionRow
                  key={cat}
                  type="radio"
                  label={cat}
                  count={counts.byCategory[cat] ?? 0}
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Spice level">
              {SPICE_OPTIONS.map((opt) => (
                <OptionRow
                  key={opt.level}
                  type="checkbox"
                  label={opt.label}
                  count={counts.bySpice[opt.level] ?? 0}
                  checked={spice.includes(opt.level)}
                  onChange={() => toggleSpice(opt.level)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Availability" last>
              <OptionRow
                type="checkbox"
                label="In stock only"
                checked={inStockOnly}
                onChange={() => setInStockOnly((v) => !v)}
              />
            </FilterGroup>
          </div>
        </aside>

        {/* Main column */}
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-clay bg-cream px-4 py-2.5 text-sm font-medium text-cocoa transition-colors hover:border-spice hover:text-spice lg:hidden"
              aria-expanded={showFilters}
            >
              <IconSliders className="h-4 w-4" />
              {showFilters ? "Hide filters" : "Filters"}
            </button>

            <div className="relative w-full sm:w-80 md:w-96">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-soft" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-11 w-full rounded-full border border-clay bg-cream pl-11 pr-10 text-sm text-cocoa placeholder:text-cocoa-soft/70 focus-visible:border-spice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spice/30 [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa-soft transition-colors hover:text-spice"
                >
                  <IconX className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <label htmlFor="sort" className="text-sm text-cocoa-soft">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="cursor-pointer rounded-full border border-clay bg-cream px-4 py-2.5 text-sm font-medium text-cocoa focus-visible:outline-spice"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-cocoa-soft">
              Showing <strong className="text-cocoa">{visible.length}</strong>{" "}
              {visible.length === 1 ? "product" : "products"}
              {category !== "All" && ` in ${category}`}
              {query.trim() && ` for "${query.trim()}"`}
            </p>
          </div>

          {visible.length > 0 ? (
            <ProductGrid
              key={`${category}-${sort}-${spice.join("")}-${inStockOnly}`}
              products={visible}
              className="mt-6"
            />
          ) : (
            <div className="mt-16 text-center">
              <p className="text-cocoa-soft">
                No products match your filters.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-3 text-sm font-medium text-spice transition-colors hover:text-spice-dark"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

function FilterGroup({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("py-5", !last && "border-b border-clay/70")}>
      <h3 className="eyebrow mb-3 text-cocoa">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function OptionRow({
  type,
  label,
  count,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-cocoa-soft transition-colors hover:text-cocoa">
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className={cn(
          "h-4 w-4 shrink-0 accent-spice",
          type === "radio" ? "rounded-full" : "rounded",
        )}
      />
      <span className={cn("flex-1", checked && "font-medium text-cocoa")}>
        {label}
      </span>
      {typeof count === "number" && (
        <span className="text-xs tabular-nums text-cocoa-soft/70">{count}</span>
      )}
    </label>
  );
}
