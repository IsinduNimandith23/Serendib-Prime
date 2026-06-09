import type { Product } from "./types";
import { PRODUCTS } from "./products";
import { isSupabaseConfigured } from "./supabase/config";
import { createSupabaseServerClient } from "./supabase/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameSi: row.name_si ?? undefined,
    nameTa: row.name_ta ?? undefined,
    tagline: row.tagline,
    image: row.image_url ?? undefined,
    category: row.category,
    price: Number(row.price),
    weight: row.weight,
    shortDescription: row.short_description,
    description: row.description,
    ingredients: row.ingredients ?? [],
    nutrition: row.nutrition ?? {
      servingSize: "",
      calories: 0,
      protein: "",
      carbs: "",
      fat: "",
      sodium: "",
    },
    spiceLevel: row.spice_level ?? 0,
    badges: row.badges ?? [],
    accent: row.accent ?? "#b5371f",
    prepSteps: row.prep_steps ?? [],
    servingSuggestion: row.serving_suggestion ?? "",
    featured: Boolean(row.featured),
    inStock: row.in_stock ?? true,
    rating: Number(row.rating ?? 0),
    reviews: Number(row.reviews ?? 0),
    active: row.active ?? true,
    sortOrder: row.sort_order ?? 100,
  };
}

/**
 * Returns the full active catalogue. Pulls from Supabase when configured,
 * otherwise falls back to the bundled seed so the storefront always renders.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return PRODUCTS;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return PRODUCTS;
    return data.map(rowToProduct);
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}

/** Admin-only: read directly from the DB with no seed fallback. */
export async function getAdminProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data.map(rowToProduct);
  } catch {
    return [];
  }
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return rowToProduct(data);
  } catch {
    return null;
  }
}
