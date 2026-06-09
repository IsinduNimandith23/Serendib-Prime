import { createSupabaseAdminClient } from "./supabase/admin";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { CartItem, OrderRecord, OrderStatus } from "./types";

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
}

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

/** Admin listing — relies on the authenticated session + RLS policy. */
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
