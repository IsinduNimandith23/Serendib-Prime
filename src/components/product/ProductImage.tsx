import Image from "next/image";
import { cn } from "@/lib/utils";
import { CanVisual } from "@/components/visual/CanVisual";
import type { Product } from "@/lib/types";

/**
 * Renders the real product photo (object-contain) when available, falling back
 * to the SVG can visual for admin-added products without a photo.
 * The parent MUST be `relative` and have a defined size.
 */
export function ProductImage({
  product,
  sizes = "(max-width: 640px) 90vw, 33vw",
  className,
  priority = false,
}: {
  product: Pick<Product, "image" | "name" | "weight" | "accent" | "id">;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (!product.image) {
    return (
      <CanVisual
        name={product.name}
        weight={product.weight}
        accent={product.accent}
        uid={product.id}
        backdrop={false}
        className={cn("h-full w-full", className)}
      />
    );
  }
  return (
    <Image
      src={product.image}
      alt={product.name}
      width={640}
      height={620}
      sizes={sizes}
      priority={priority}
      className={cn("h-full w-full object-contain", className)}
    />
  );
}
