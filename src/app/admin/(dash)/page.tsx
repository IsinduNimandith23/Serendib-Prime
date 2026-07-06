import Link from "next/link";
import { getOrders } from "@/lib/orders";
import { getAdminProducts } from "@/lib/data";
import { formatLKR, formatSLDate, formatSLTime } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { IconArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([getOrders(), getAdminProducts()]);

  return (
    <div>
      <DashboardStats
        orders={orders}
        activeProducts={products.filter((p) => p.inStock).length}
        heading={
          <div>
            <h1 className="font-display text-3xl font-semibold text-cocoa">Dashboard</h1>
            <p className="mt-1 text-base text-cocoa-soft">
              Welcome back - here&apos;s your store at a glance.
            </p>
          </div>
        }
      />

      <div className="mt-10 rounded-2xl border border-clay bg-cream">
        <div className="flex items-center justify-between border-b border-clay px-5 py-4">
          <h2 className="font-display text-2xl font-semibold text-cocoa">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-base font-semibold text-spice hover:text-spice-dark"
          >
            View all <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="px-5 py-12 text-center text-cocoa-soft">
            No orders yet. They&apos;ll appear here as customers check out.
          </p>
        ) : (
          <>
            {/* Mobile: stacked list */}
            <ul className="divide-y divide-clay sm:hidden">
              {orders.slice(0, 8).map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.order_ref}`}
                    className="flex items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-cocoa">{o.order_ref}</p>
                      <p className="truncate text-sm font-medium text-cocoa">
                        {o.customer_name}
                      </p>
                      <p className="mt-0.5 text-sm text-cocoa-soft">
                        {formatSLDate(o.created_at)} · {formatSLTime(o.created_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="font-semibold text-cocoa">
                        {formatLKR(Number(o.total))}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-160 text-base">
                <thead>
                  <tr className="text-left text-[15px] font-semibold text-cocoa-soft">
                    <th className="px-5 py-3.5">Order</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-clay">
                  {orders.slice(0, 8).map((o) => (
                    <tr key={o.id}>
                      <td className="px-5 py-3.5 font-semibold text-cocoa">{o.order_ref}</td>
                      <td className="px-5 py-3.5 font-medium text-cocoa">{o.customer_name}</td>
                      <td className="px-5 py-3.5 font-medium text-cocoa">{formatLKR(Number(o.total))}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-5 py-3.5 font-medium text-cocoa-soft">
                        <div>{formatSLDate(o.created_at)}</div>
                        <div className="text-sm font-normal">{formatSLTime(o.created_at)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
