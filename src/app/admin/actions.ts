"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProductRow(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  return {
    name,
    slug,
    name_si: String(formData.get("name_si") ?? "").trim() || null,
    name_ta: String(formData.get("name_ta") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    tagline: String(formData.get("tagline") ?? "").trim(),
    category: String(formData.get("category") ?? "Tempered"),
    price: Number(formData.get("price") ?? 0),
    weight: String(formData.get("weight") ?? "").trim(),
    short_description: String(formData.get("short_description") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    accent: String(formData.get("accent") ?? "#b5371f"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    in_stock: formData.get("in_stock") === "on",
    badges: splitLines(formData.get("badges")),
    ingredients: splitLines(formData.get("ingredients")),
    prep_steps: splitLines(formData.get("prep_steps")),
    serving_suggestion: String(formData.get("serving_suggestion") ?? "").trim(),
    nutrition: {
      servingSize: String(formData.get("n_serving") ?? "").trim(),
      calories: Number(formData.get("n_calories") ?? 0),
      protein: String(formData.get("n_protein") ?? "").trim(),
      carbs: String(formData.get("n_carbs") ?? "").trim(),
      fat: String(formData.get("n_fat") ?? "").trim(),
      sodium: String(formData.get("n_sodium") ?? "").trim(),
    },
    rating: Number(formData.get("rating")) || 0,
    reviews: Number(formData.get("reviews")) || 0,
    sort_order: Number(formData.get("sort_order")) || 100,
  };
}

export async function createProduct(formData: FormData) {
  await requireUser();
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase service role not configured.");

  const { error } = await admin.from("products").insert(buildProductRow(formData));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireUser();
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase service role not configured.");

  const { error } = await admin
    .from("products")
    .update(buildProductRow(formData))
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase service role not configured.");

  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductFlag(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  const field = String(formData.get("field")); // "featured" | "active"
  const value = formData.get("value") === "true";
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase service role not configured.");

  const { error } = await admin
    .from("products")
    .update({ [field]: value })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireUser();
  const orderRef = String(formData.get("order_ref"));
  const status = String(formData.get("status")) as OrderStatus;
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase service role not configured.");

  const { error } = await admin
    .from("orders")
    .update({ status })
    .eq("order_ref", orderRef);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}
