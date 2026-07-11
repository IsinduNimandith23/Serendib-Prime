import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// Regenerate daily so products added via the admin appear without a redeploy.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/products", "/about", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const legalRoutes = ["/privacy-policy", "/refund-policy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const products = await getProducts();
  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...legalRoutes, ...productRoutes];
}
