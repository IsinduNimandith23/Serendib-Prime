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
      <div>
        <h1 className="font-display text-3xl font-semibold text-cocoa">Dashboard</h1>
        <p className="mt-1 text-[15px] text-cocoa-soft">Welcome back - here&apos;s your store at a glance.</p>
      </div>

      <DashboardStats
        orders={orders}
        activeProducts={products.filter((p) => p.inStock).length}
      />

      <div className="mt-10 rounded-2xl border border-clay bg-cream">
        <div className="flex items-center justify-between border-b border-clay px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-cocoa">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[15px] font-semibold text-spice hover:text-spice-dark"
          >
            View all <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="px-5 py-12 text-center text-cocoa-soft">
            No orders yet. They&apos;ll appear here as customers check out.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-[15px]">
              <thead>
                <tr className="text-left text-sm font-semibold text-cocoa-soft">
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
        )}
      </div>
    </div>
  );
}
