"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn, formatLKR, formatSLMonth, slMonthKey } from "@/lib/utils";
import { IconBag, IconTruck, IconClock, IconChevronDown } from "@/components/icons";
import type { OrderRecord } from "@/lib/types";

export function DashboardStats({
  orders,
  activeProducts,
}: {
  orders: OrderRecord[];
  activeProducts: number;
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
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  // Awaiting payment and active products are "right now" numbers, so the
  // month filter deliberately leaves them alone.
  const pending = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Total orders", value: inPeriod.length.toString(), Icon: IconBag, scoped: true },
    { label: "Revenue (paid)", value: formatLKR(revenue), Icon: IconTruck, scoped: true },
    { label: "Awaiting payment", value: pending.toString(), Icon: IconClock, scoped: false },
    { label: "Active products", value: activeProducts.toString(), Icon: IconBag, scoped: false },
  ];

  return (
    <div className="mt-8">
      <div ref={ref} className="relative flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-44 cursor-pointer items-center justify-between gap-2 rounded-full border border-clay bg-cream px-4 py-2 text-[15px] font-semibold text-cocoa transition-colors hover:border-spice focus-visible:outline-spice"
        >
          {selected.label}
          <IconChevronDown
            className={cn("h-4 w-4 text-cocoa-soft transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <ul className="absolute right-0 top-full z-10 mt-2 max-h-72 w-44 overflow-y-auto rounded-2xl border border-clay bg-cream p-1 shadow-lg shadow-cocoa/5">
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
                      "w-full cursor-pointer rounded-xl px-3 py-2 text-left text-[15px] font-medium transition-colors",
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, scoped }) => (
          <div key={label} className="rounded-2xl border border-clay bg-cream p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-spice/10 text-spice">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-3xl font-semibold text-cocoa">{value}</p>
            <p className="text-[15px] font-medium text-cocoa-soft">
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
