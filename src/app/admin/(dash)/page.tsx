import Link from "next/link";
import { getOrders } from "@/lib/orders";
import { getAdminProducts } from "@/lib/data";
import { formatLKR } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonClass } from "@/components/ui/Button";
import { IconBag, IconTruck, IconClock, IconArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([getOrders(), getAdminProducts()]);

  const paid = orders.filter((o) => o.status === "paid");
  const pending = orders.filter((o) => o.status === "pending");
  const revenue = paid.reduce((sum, o) => sum + Number(o.total), 0);

  const stats = [
    { label: "Total orders", value: orders.length.toString(), Icon: IconBag },
    { label: "Revenue (paid)", value: formatLKR(revenue), Icon: IconTruck },
    { label: "Awaiting payment", value: pending.length.toString(), Icon: IconClock },
    { label: "Active products", value: products.filter((p) => p.inStock).length.toString(), Icon: IconBag },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cocoa">Dashboard</h1>
          <p className="mt-1 text-cocoa-soft">Welcome back — here&apos;s your store at a glance.</p>
        </div>
        <Link href="/admin/products/new" className={buttonClass({ variant: "primary" })}>
          Add product
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl border border-clay bg-cream p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-spice/10 text-spice">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-2xl font-semibold text-cocoa">{value}</p>
            <p className="text-sm text-cocoa-soft">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-clay bg-cream">
        <div className="flex items-center justify-between border-b border-clay px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-cocoa">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-spice hover:text-spice-dark"
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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-cocoa-soft">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay">
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-medium text-cocoa">{o.order_ref}</td>
                    <td className="px-5 py-3 text-cocoa">{o.customer_name}</td>
                    <td className="px-5 py-3 text-cocoa">{formatLKR(Number(o.total))}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-cocoa-soft">
                      {new Date(o.created_at).toLocaleDateString("en-LK")}
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
