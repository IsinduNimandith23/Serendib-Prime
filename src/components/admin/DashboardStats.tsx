"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn, formatLKR, formatSLMonth, slMonthKey } from "@/lib/utils";
import { IconBag, IconTruck, IconClock, IconChevronDown } from "@/components/icons";
import { REVENUE_STATUSES } from "@/lib/order-status";
import type { OrderRecord } from "@/lib/types";

export function DashboardStats({
  orders,
  activeProducts,
  heading,
}: {
  orders: OrderRecord[];
  activeProducts: number;
  heading?: React.ReactNode;
}) {
  const [month, setMonth] = useState("all");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const options = useMemo(() => {
    const seen = new Map<string, string>();
    for (const o of orders) {
      const key = slMonthKey(o.created_at);
      if (!seen.has(key)) seen.set(key, formatSLMonth(o.created_at));
    }
    const months = [...seen.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([value, label]) => ({ value, label }));
    return [{ value: "all", label: "All time" }, ...months];
  }, [orders]);

  const selected = options.find((o) => o.value === month) ?? options[0];

  const inPeriod =
    month === "all" ? orders : orders.filter((o) => slMonthKey(o.created_at) === month);
  const revenue = inPeriod
    .filter((o) => REVENUE_STATUSES.includes(o.status))
    .reduce((sum, o) => sum + Number(o.total), 0);
  // Awaiting payment and active products are "right now" numbers, so the
  // month filter deliberately leaves them alone.
  const pending = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Total orders", value: inPeriod.length.toString(), Icon: IconBag, scoped: true },
    { label: "Revenue", value: formatLKR(revenue), Icon: IconTruck, scoped: true },
    { label: "Awaiting payment", value: pending.toString(), Icon: IconClock, scoped: false },
    { label: "Active products", value: activeProducts.toString(), Icon: IconBag, scoped: false },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        {heading}
        <div ref={ref} className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-clay bg-cream px-4 py-2 text-base font-semibold text-cocoa transition-colors hover:border-spice focus-visible:outline-spice sm:w-44"
          >
            {selected.label}
            <IconChevronDown
              className={cn("h-4 w-4 text-cocoa-soft transition-transform", open && "rotate-180")}
            />
          </button>

          {open && (
            <ul className="absolute right-0 top-full z-10 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-clay bg-cream p-1 shadow-lg shadow-cocoa/5 sm:w-44">
              {options.map((opt) => {
                const active = opt.value === month;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setMonth(opt.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full cursor-pointer rounded-xl px-3 py-2 text-left text-base font-medium transition-colors",
                        active ? "bg-spice text-cream" : "text-cocoa hover:bg-sand/60",
                      )}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, scoped }) => (
          <div key={label} className="rounded-2xl border border-clay bg-cream p-4 sm:p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-spice/10 text-spice sm:h-10 sm:w-10">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold text-cocoa sm:mt-4 sm:text-4xl">
              {value}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-cocoa-soft sm:text-base">
              {label}
              {scoped && month !== "all" && (
                <span className="font-normal"> · {selected.label}</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
