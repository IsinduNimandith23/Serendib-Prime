import { getOrders } from "@/lib/orders";
import { formatLKR } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateOrderStatusAction } from "@/app/admin/actions";
import type { CartItem, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: OrderStatus[] = ["pending", "paid", "failed", "cancelled"];

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-cocoa">Orders</h1>
      <p className="mt-1 text-cocoa-soft">{orders.length} total</p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-clay bg-cream p-12 text-center text-cocoa-soft">
          No orders yet. They&apos;ll appear here as customers check out.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o) => {
            const items = (o.items as CartItem[]) ?? [];
            const itemCount = items.reduce((n, i) => n + i.quantity, 0);
            return (
              <div key={o.id} className="rounded-2xl border border-clay bg-cream p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg font-semibold text-cocoa">
                        {o.order_ref}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="mt-1 text-sm text-cocoa">
                      {o.customer_name} · {o.email} · {o.phone}
                    </p>
                    <p className="text-sm text-cocoa-soft">
                      {o.address}, {o.city} {o.postal_code}
                    </p>
                    <p className="mt-1 text-xs text-cocoa-soft">
                      {new Date(o.created_at).toLocaleString("en-LK")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-semibold text-spice">
                      {formatLKR(Number(o.total))}
                    </p>
                    <p className="text-xs text-cocoa-soft">
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-clay pt-3">
                  {items.map((i) => (
                    <span
                      key={i.slug}
                      className="rounded-full bg-sand/60 px-3 py-1 text-xs text-cocoa"
                    >
                      {i.quantity} × {i.name}
                    </span>
                  ))}
                </div>

                <form
                  action={updateOrderStatusAction}
                  className="mt-4 flex items-center gap-2"
                >
                  <input type="hidden" name="order_ref" value={o.order_ref} />
                  <label htmlFor={`status-${o.id}`} className="text-sm text-cocoa-soft">
                    Update status
                  </label>
                  <select
                    id={`status-${o.id}`}
                    name="status"
                    defaultValue={o.status}
                    className="cursor-pointer rounded-full border border-clay bg-cream px-3 py-1.5 text-sm text-cocoa focus-visible:outline-spice"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full bg-spice px-4 py-1.5 text-sm font-semibold text-cream transition-colors hover:bg-spice-dark"
                  >
                    Save
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
