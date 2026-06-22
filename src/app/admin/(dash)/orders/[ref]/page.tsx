import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByRef, getReceiptSignedUrl } from "@/lib/orders";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { formatLKR } from "@/lib/utils";
import { IconArrowRight } from "@/components/icons";
import type { CartItem, PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  bank: "Bank Transfer",
  payhere: "PayHere",
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-clay bg-cream">
      <div className="border-b border-clay px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cocoa-soft">
          {title}
        </h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-[15px]">
      <span className="font-medium text-cocoa-soft">{label}</span>
      <span className="text-right font-medium text-cocoa">{value}</span>
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const order = await getOrderByRef(decodeURIComponent(ref));
  if (!order) notFound();

  const items = (order.items as CartItem[]) ?? [];
  const created = new Date(order.created_at);
  const receiptUrl = order.receipt_path
    ? await getReceiptSignedUrl(order.receipt_path)
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-[15px] font-medium text-cocoa-soft transition-colors hover:text-spice"
        >
          <IconArrowRight className="h-4 w-4 rotate-180" /> Orders
        </Link>
        <span className="text-clay">/</span>
        <h1 className="font-display text-2xl font-semibold text-cocoa">
          {order.order_ref}
        </h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          <Card title={`Items (${items.length})`}>
            <div className="divide-y divide-clay/60">
              {items.map((i) => (
                <div
                  key={i.slug}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0"
                >
                  <div>
                    <p className="font-semibold text-cocoa">{i.name}</p>
                    <p className="text-sm text-cocoa-soft">
                      {i.weight} · Qty: {i.quantity}
                    </p>
                  </div>
                  <span className="whitespace-nowrap font-semibold text-cocoa">
                    {formatLKR(i.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-clay pt-3">
              <Row label="Subtotal" value={formatLKR(Number(order.subtotal))} />
              <Row label="Shipping" value={formatLKR(Number(order.shipping))} />
              <div className="mt-1 flex items-center justify-between border-t border-clay pt-2.5">
                <span className="font-semibold text-cocoa">Total</span>
                <span className="font-display text-lg font-semibold text-spice">
                  {formatLKR(Number(order.total))}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Update order status">
            <form action={updateOrderStatusAction} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="order_ref" value={order.order_ref} />
              <StatusSelect defaultValue={order.status} />
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-spice px-5 py-2 text-[15px] font-semibold text-cream transition-colors hover:bg-spice-dark"
              >
                Update
              </button>
            </form>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card title="Customer">
            <p className="font-semibold text-cocoa">{order.customer_name}</p>
            <p className="mt-1 text-[15px] font-medium text-cocoa-soft">{order.email}</p>
            <p className="text-[15px] font-medium text-cocoa-soft">{order.phone}</p>
          </Card>

          <Card title="Shipping address">
            <p className="text-[15px] font-medium text-cocoa">{order.address}</p>
            <p className="text-[15px] font-medium text-cocoa">
              {order.city}
              {order.postal_code ? `, ${order.postal_code}` : ""}
            </p>
          </Card>

          <Card title="Payment">
            <Row
              label="Method"
              value={PAYMENT_METHOD_LABELS[order.payment_method] ?? order.payment_method}
            />
            <Row label="Status" value={<StatusBadge status={order.status} />} />
            {order.bank_account && <Row label="Paid to" value={order.bank_account} />}
            {order.payment_method === "bank" && (
              <Row
                label="Receipt"
                value={
                  receiptUrl ? (
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-spice hover:text-spice-dark"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-cocoa-soft">None</span>
                  )
                }
              />
            )}
          </Card>

          <Card title="Order info">
            <Row label="Placed" value={created.toLocaleDateString("en-LK")} />
            <Row
              label="Time"
              value={created.toLocaleTimeString("en-LK", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <Row
              label="Order ID"
              value={<span className="font-mono text-xs">{order.id}</span>}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
