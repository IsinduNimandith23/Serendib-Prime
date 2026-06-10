import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data";
import { PRODUCTS } from "@/lib/products";
import { formatLKR } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/motion";
import { ProductImage } from "@/components/product/ProductImage";
import { FishMotif } from "@/components/visual/SeaMotif";
import { Badge } from "@/components/product/Badge";
import { ChilliMeter } from "@/components/product/ChilliMeter";
import { StockStatus } from "@/components/product/StockStatus";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  IconChevronRight,
  IconTruck,
  IconLock,
  IconClock,
  IconLeaf,
} from "@/components/icons";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .concat(all.filter((p) => p.slug !== product.slug && p.category !== product.category))
    .slice(0, 3);

  const nutritionRows: [string, string][] = [
    ["Serving size", product.nutrition.servingSize],
    ["Energy", `${product.nutrition.calories} kcal`],
    ["Protein", product.nutrition.protein],
    ["Carbohydrates", product.nutrition.carbs],
    ["Fat", product.nutrition.fat],
    ["Sodium", product.nutrition.sodium],
  ];

  return (
    <div className="pb-8">
      {/* Breadcrumb */}
      <Container className="pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-cocoa-soft">
          <Link href="/" className="transition-colors hover:text-spice">Home</Link>
          <IconChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="transition-colors hover:text-spice">Shop</Link>
          <IconChevronRight className="h-3.5 w-3.5" />
          <span className="text-cocoa">{product.name}</span>
        </nav>
      </Container>

      <Container className="grid gap-10 pt-8 lg:grid-cols-2 lg:gap-16">
        {/* Visual */}
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-clay bg-gradient-to-br from-cream to-sand">
              <FishMotif className="absolute -right-6 -top-6 h-40 w-40 opacity-15" />
              <ProductImage
                product={product}
                sizes="(max-width: 1024px) 90vw, 45vw"
                priority
                className="p-8"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { Icon: IconClock, label: "Ready in 2 min" },
                { Icon: IconLeaf, label: "No preservatives" },
                { Icon: IconTruck, label: "Ships in 24 hrs" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-clay bg-cream px-2 py-3 text-center"
                >
                  <Icon className="h-5 w-5 text-spice" />
                  <span className="text-xs font-medium text-cocoa-soft">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Details */}
        <Reveal delay={0.1}>
          <div className="flex flex-col">
            <span className="eyebrow text-gold-dark">{product.category}</span>

            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cocoa sm:text-5xl">
              {product.name}
            </h1>
            {(product.nameSi || product.nameTa) && (
              <p className="mt-2 text-base text-cocoa-soft">
                {[product.nameSi, product.nameTa].filter(Boolean).join("  ·  ")}
              </p>
            )}
            <p className="mt-2 text-lg text-cocoa-soft">{product.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-display text-3xl font-semibold text-spice">
                {formatLKR(product.price)}
              </span>
              <span className="rounded-full bg-sand px-3 py-1 text-sm font-medium text-cocoa-soft">
                Net {product.weight}
              </span>
              <ChilliMeter level={product.spiceLevel} />
              <StockStatus inStock={product.inStock} className="text-sm" />
            </div>

            <p className="mt-6 text-base leading-relaxed text-cocoa">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <Badge key={b} text={b} />
              ))}
            </div>

            <div className="mt-8">
              <ProductPurchase product={product} />
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-sand/60 px-4 py-3 text-sm text-cocoa-soft">
              <IconLock className="h-4 w-4 text-leaf" />
              Secure checkout via PayHere · Free delivery over Rs 5,000
            </div>

            {/* Detail sections */}
            <div className="mt-10 space-y-8">
              <DetailBlock title="What's inside">
                <ul className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <li
                      key={ing}
                      className="rounded-full border border-clay bg-cream px-3 py-1.5 text-sm text-cocoa"
                    >
                      {ing}
                    </li>
                  ))}
                </ul>
              </DetailBlock>

              <DetailBlock title="How to prepare">
                <ol className="space-y-3">
                  {product.prepSteps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-spice/10 text-sm font-semibold text-spice">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-cocoa">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 rounded-2xl border border-clay bg-sand/50 p-4 text-sm italic text-cocoa-soft">
                  Serving idea - {product.servingSuggestion}
                </p>
              </DetailBlock>

              <DetailBlock title="Nutrition">
                <table className="w-full overflow-hidden rounded-2xl border border-clay text-sm">
                  <tbody>
                    {nutritionRows.map(([label, value], i) => (
                      <tr
                        key={label}
                        className={i % 2 === 0 ? "bg-cream" : "bg-sand/40"}
                      >
                        <th
                          scope="row"
                          className="px-4 py-2.5 text-left font-medium text-cocoa-soft"
                        >
                          {label}
                        </th>
                        <td className="px-4 py-2.5 text-right font-semibold text-cocoa">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-cocoa-soft">
                  Values are indicative per serving. Made in a kitchen that handles fish,
                  shellfish and tree nuts.
                </p>
              </DetailBlock>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <Container className="mt-24">
          <h2 className="font-display text-2xl font-semibold text-cocoa sm:text-3xl">
            You may also like
          </h2>
          <ProductGrid products={related} className="mt-8" />
        </Container>
      )}
    </div>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold text-cocoa">{title}</h2>
      {children}
    </section>
  );
}
