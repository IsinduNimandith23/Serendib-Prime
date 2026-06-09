import Link from "next/link";
import type { Product } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { buttonClass } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/icons";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Bestsellers"
            title="The pantry favourites"
            intro="Our most-loved curries, slow-cooked and ready when you are."
          />
          <Link
            href="/products"
            className={buttonClass({ variant: "outline", className: "hidden shrink-0 sm:inline-flex" })}
          >
            View all products <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ProductGrid products={products} className="mt-12" />

        <Link
          href="/products"
          className={buttonClass({ variant: "outline", className: "mt-10 w-full sm:hidden" })}
        >
          View all products <IconArrowRight className="h-4 w-4" />
        </Link>
      </Container>
    </section>
  );
}
