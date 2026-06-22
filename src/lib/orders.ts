import { createSupabaseAdminClient } from "./supabase/admin";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { CartItem, OrderRecord, OrderStatus, PaymentMethod } from "./types";

export interface NewOrderInput {
  orderRef: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  /** Bank transfer only: chosen owner account label + receipt storage path. */
  bankAccount?: string | null;
  receiptPath?: string | null;
}

const RECEIPT_BUCKET = "payment-receipts";

/**
 * Persist a pending order using the service-role client (bypasses RLS).
 * Returns `persisted: false` when Supabase isn't configured (demo mode) so the
 * checkout still completes for demonstration.
 */
export async function createOrder(
  input: NewOrderInput,
): Promise<{ persisted: boolean }> {
  const admin = createSupabaseAdminClient();
  if (!admin) return { persisted: false };

  const { error } = await admin.from("orders").insert({
    order_ref: input.orderRef,
    customer_name: input.customer.name,
    email: input.customer.email,
    phone: input.customer.phone,
    address: input.customer.address,
    city: input.customer.city,
    postal_code: input.customer.postalCode,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    status: "pending" as OrderStatus,
    payment_method: input.paymentMethod,
    bank_account: input.bankAccount ?? null,
    receipt_path: input.receiptPath ?? null,
  });

  if (error) {
    console.error("createOrder failed:", error.message);
    return { persisted: false };
  }
  return { persisted: true };
}

export async function markOrderStatus(
  orderRef: string,
  status: OrderStatus,
  paymentId?: string,
): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  if (!admin) return false;

  const { error } = await admin
    .from("orders")
    .update({ status, payhere_payment_id: paymentId ?? null })
    .eq("order_ref", orderRef);

  if (error) {
    console.error("markOrderStatus failed:", error.message);
    return false;
  }
  return true;
}

/**
 * Read a single order by its public reference using the service-role client.
 * Used by the checkout success page to show the real, webhook-confirmed status
 * (PayHere passes no status to the return_url). Returns null when Supabase is
 * not configured or the order doesn't exist.
 */
export async function getOrderByRef(
  orderRef: string,
): Promise<OrderRecord | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("orders")
    .select("*")
    .eq("order_ref", orderRef)
    .single();

  if (error || !data) return null;
  return data as OrderRecord;
}

/**
 * Create a short-lived signed URL for a bank-transfer receipt in the private
 * `payment-receipts` bucket. Used by the admin Orders page so staff can view a
 * receipt without making the bucket public. Returns null when not configured.
 */
export async function getReceiptSignedUrl(
  path: string,
  expiresInSeconds = 60 * 30,
): Promise<string | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const { data, error } = await admin.storage
    .from(RECEIPT_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data) return null;
  return data.signedUrl;
}

/** Admin listing - relies on the authenticated session + RLS policy. */
export async function getOrders(): Promise<OrderRecord[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as OrderRecord[];
  } catch {
    return [];
  }
}
