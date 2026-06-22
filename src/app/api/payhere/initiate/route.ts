import { NextResponse, type NextRequest } from "next/server";
import { getProducts } from "@/lib/data";
import { createOrder } from "@/lib/orders";
import { shippingFor } from "@/lib/shipping";
import { makeOrderRef } from "@/lib/utils";
import type { CartItem, PaymentMethod } from "@/lib/types";
import {
  CURRENCY,
  formatPayHereAmount,
  generateCheckoutHash,
  isPayHereConfigured,
  PAYHERE_MERCHANT_ID,
  payhereCheckoutUrl,
} from "@/lib/payhere";

export const runtime = "nodejs";

interface InitiateBody {
  items: { slug: string; quantity: number }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod?: PaymentMethod;
  /** Bank transfer: ref shown to the customer as the payment reference. */
  orderRef?: string;
  bankAccount?: string;
  receiptPath?: string | null;
}

const PAYMENT_METHODS: PaymentMethod[] = ["cod", "bank", "payhere"];
const ORDER_REF_RE = /^SP-[A-Z0-9]{6}$/;

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let body: InitiateBody;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request body.");
  }

  const { items, customer } = body;
  if (!Array.isArray(items) || items.length === 0) return bad("Your cart is empty.");
  if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address || !customer?.city) {
    return bad("Please complete all required delivery fields.");
  }
  const paymentMethod: PaymentMethod = PAYMENT_METHODS.includes(body.paymentMethod as PaymentMethod)
    ? (body.paymentMethod as PaymentMethod)
    : "payhere";

  // Bank transfers complete the payment up front: the customer must pick an
  // account and upload a receipt before placing the order.
  const bankAccount = paymentMethod === "bank" ? String(body.bankAccount ?? "").trim() : null;
  const receiptPath =
    paymentMethod === "bank" && body.receiptPath ? String(body.receiptPath).trim() : null;
  if (paymentMethod === "bank" && !bankAccount) {
    return bad("Please choose the bank account you transferred to.");
  }

  // Recompute prices server-side from the catalogue to prevent tampering.
  const catalogue = await getProducts();
  const validated: CartItem[] = [];
  for (const line of items) {
    const product = catalogue.find((p) => p.slug === line.slug);
    if (!product) continue;
    const quantity = Math.max(1, Math.min(20, Math.floor(line.quantity)));
    validated.push({
      slug: product.slug,
      name: product.name,
      price: product.price,
      weight: product.weight,
      accent: product.accent,
      category: product.category,
      quantity,
    });
  }
  if (validated.length === 0) return bad("None of the items are available.");

  const subtotal = validated.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  // For bank transfers the customer already saw a reference and used it for the
  // transfer, so honour that ref (if well-formed); otherwise mint a fresh one.
  const orderRef =
    paymentMethod === "bank" && body.orderRef && ORDER_REF_RE.test(body.orderRef)
      ? body.orderRef
      : makeOrderRef();
  const itemCount = validated.reduce((n, i) => n + i.quantity, 0);

  const { persisted } = await createOrder({
    orderRef,
    customer,
    items: validated,
    subtotal,
    shipping,
    total,
    paymentMethod,
    bankAccount,
    receiptPath,
  });

  // COD / bank transfer skip the gateway entirely - the order is recorded as
  // pending and confirmed manually by an admin once payment is received.
  if (paymentMethod !== "payhere") {
    return NextResponse.json({ mode: "manual", orderRef, persisted, total });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const [firstName, ...rest] = customer.name.trim().split(/\s+/);
  const lastName = rest.join(" ") || firstName;

  if (!isPayHereConfigured()) {
    // Demo mode - credentials not set. Allow the flow to complete for the demo.
    return NextResponse.json({ mode: "demo", orderRef, persisted, total });
  }

  const fields: Record<string, string> = {
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: `${appUrl}/checkout/success?order=${orderRef}`,
    cancel_url: `${appUrl}/checkout/cancel`,
    notify_url: `${appUrl}/api/payhere/notify`,
    order_id: orderRef,
    items: `Serendib Prime order · ${itemCount} item${itemCount === 1 ? "" : "s"}`,
    currency: CURRENCY,
    amount: formatPayHereAmount(total),
    first_name: firstName,
    last_name: lastName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    country: "Sri Lanka",
    hash: generateCheckoutHash(orderRef, total),
  };

  return NextResponse.json({
    mode: "payhere",
    actionUrl: payhereCheckoutUrl(),
    fields,
    orderRef,
  });
}
