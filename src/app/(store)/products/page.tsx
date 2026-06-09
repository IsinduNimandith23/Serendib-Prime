import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { PageHero } from "@/components/ui/PageHero";
import { ProductsExplorer } from "@/components/product/ProductsExplorer";

export const metadata: Metadata = {
  title: "Shop the Pantry",
  description:
    "Browse our range of ready-to-eat Sri Lankan tinned sprats — tempered sprats and dried sprats curries. Sealed fresh, ready in minutes.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts();

  return (
    <>
      <PageHero
        eyebrow="The range"
        title="Every tin, ready when you are"
        intro="Three signature recipes — dried sprats tempered and curried the island way, sealed fresh. Filter and build your box."
      />
      <ProductsExplorer products={products} initialCategory={category} />
    </>
  );
}
