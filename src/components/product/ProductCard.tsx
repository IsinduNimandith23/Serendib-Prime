import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn, formatLKR } from "@/lib/utils";
import { ProductImage } from "./ProductImage";
import { ChilliMeter } from "./ChilliMeter";
import { StockStatus } from "./StockStatus";
import { AddToCartMini } from "./AddToCartButton";
import { buttonClass } from "@/components/ui/Button";
import { IconArrowUpRight } from "@/components/icons";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const href = `/products/${product.slug}`;
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-clay bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-spice/30 hover:shadow-xl hover:shadow-cocoa/10",
        className,
      )}
    >
      <Link href={href} className="block focus-visible:outline-none">
        <div className="relative aspect-square overflow-hidden bg-sand/30">
          <ProductImage
            product={product}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className={cn(
              "px-3 pb-3 pt-7 transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              !product.inStock && "opacity-50 grayscale",
            )}
          />
          {!product.inStock ? (
            <span className="absolute left-4 top-4 rounded-full bg-night/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-cream">
              Out of stock
            </span>
          ) : (
            product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-night">
                Bestseller
              </span>
            )
          )}
          <span className="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-cream/90 text-cocoa opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <IconArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="flex flex-col gap-2 px-5 pt-5">
          <span className="eyebrow text-gold-dark">{product.category}</span>
          <h3 className="font-display text-xl font-semibold text-cocoa transition-colors group-hover:text-spice">
            {product.name}
          </h3>
          {product.nameSi && (
            <p className="-mt-1 text-sm text-cocoa-soft/90">{product.nameSi}</p>
          )}
          <p className="line-clamp-2 min-h-[2.84rem] text-sm leading-relaxed text-cocoa-soft">
            {product.tagline}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <ChilliMeter level={product.spiceLevel} />
            <span className="text-xs font-medium text-cocoa-soft">
              Net {product.weight}
            </span>
          </div>
          <StockStatus inStock={product.inStock} className="mt-0.5" />
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-3 px-5 pb-5 pt-4">
        <span className="font-display text-xl font-semibold text-spice">
          {formatLKR(product.price)}
        </span>
        {product.inStock ? (
          <AddToCartMini product={product} />
        ) : (
          <span
            aria-disabled="true"
            className={buttonClass({
              variant: "outline",
              size: "sm",
              className: "cursor-not-allowed rounded-full opacity-60",
            })}
          >
            Sold out
          </span>
        )}
      </div>
    </div>
  );
}
