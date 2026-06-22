"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn, formatLKR } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { IconArrowRight, IconSearch } from "@/components/icons";
import type { CartItem, OrderRecord, OrderStatus, PaymentMethod } from "@/lib/types";

const PAGE_SIZE = 10;

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "COD",
  bank: "Bank",
  payhere: "PayHere",
};

const TABS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersTable({ orders }: { orders: OrderRecord[] }) {
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (!q) return true;
      return (
        o.order_ref.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)
      );
    });
  }, [orders, tab, query]);

  // Reset to the first page whenever the filters change the result set.
  useEffect(() => {
    setPage(1);
  }, [tab, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 border-b border-clay">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[15px] font-semibold transition-colors",
                  active
                    ? "border-spice text-cocoa"
                    : "border-transparent text-cocoa-soft hover:text-cocoa",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ref, name or email"
            className="w-full rounded-full border border-clay bg-cream py-2 pl-9 pr-4 text-[15px] font-medium text-cocoa placeholder:font-normal placeholder:text-cocoa-soft focus-visible:border-spice focus-visible:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-clay bg-cream p-12 text-center text-cocoa-soft">
          {query.trim() ? "No orders match your search." : "No orders in this view."}
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-clay bg-cream">
          <table className="w-full text-left text-[15px]">
            <thead>
              <tr className="border-b border-clay text-xs font-semibold uppercase tracking-wide text-cocoa-soft">
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((o) => {
                const items = (o.items as CartItem[]) ?? [];
                const created = new Date(o.created_at);
                return (
                  <tr
                    key={o.id}
                    className="border-b border-clay/60 last:border-0 transition-colors hover:bg-sand/40"
                  >
                    <td className="px-5 py-4 font-display font-semibold text-cocoa">
                      {o.order_ref}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-cocoa">{o.customer_name}</div>
                      <div className="text-sm text-cocoa-soft">{o.email}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-cocoa">
                      <div>{created.toLocaleDateString("en-LK")}</div>
                      <div className="text-sm font-normal text-cocoa-soft">
                        {created.toLocaleTimeString("en-LK", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-cocoa">
                      {formatLKR(Number(o.total))}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-clay bg-sand/60 px-2.5 py-1 text-xs font-semibold text-cocoa-soft">
                        {PAYMENT_LABELS[o.payment_method] ?? o.payment_method}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/orders/${o.order_ref}`}
                        className="inline-flex items-center gap-1 text-[15px] font-semibold text-spice hover:text-spice-dark"
                        title={`${items.length} item${items.length === 1 ? "" : "s"}`}
                      >
                        View <IconArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[15px] font-medium text-cocoa-soft">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer rounded-full border border-clay px-3.5 py-1.5 font-medium text-cocoa transition-colors hover:border-spice hover:text-spice disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-clay disabled:hover:text-cocoa"
              >
                Previous
              </button>
              <span className="text-cocoa">
                Page {currentPage} of {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
                className="cursor-pointer rounded-full border border-clay px-3.5 py-1.5 font-medium text-cocoa transition-colors hover:border-spice hover:text-spice disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-clay disabled:hover:text-cocoa"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
