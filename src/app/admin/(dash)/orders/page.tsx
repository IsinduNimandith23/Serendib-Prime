import { getOrders } from "@/lib/orders";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-cocoa">Orders</h1>
      <p className="mt-1 text-[15px] text-cocoa-soft">
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-clay bg-cream p-12 text-center text-cocoa-soft">
          No orders yet. They&apos;ll appear here as customers check out.
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
