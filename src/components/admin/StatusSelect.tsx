"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "@/components/icons";
import { ALL_ORDER_STATUSES } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";

export function StatusSelect({
  defaultValue,
  options = ALL_ORDER_STATUSES,
}: {
  defaultValue: OrderStatus;
  options?: OrderStatus[];
}) {
  const [value, setValue] = useState<OrderStatus>(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name="status" value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-44 cursor-pointer items-center justify-between gap-2 rounded-full border border-clay bg-cream px-4 py-2 text-base font-semibold capitalize text-cocoa transition-colors hover:border-spice focus-visible:outline-spice"
      >
        {value}
        <IconChevronDown
          className={cn("h-4 w-4 text-cocoa-soft transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 w-44 overflow-hidden rounded-2xl border border-clay bg-cream p-1 shadow-lg shadow-cocoa/5">
          {options.map((opt) => {
            const active = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(opt);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full cursor-pointer rounded-xl px-3 py-2 text-left text-base font-medium capitalize transition-colors",
                    active
                      ? "bg-spice text-cream"
                      : "text-cocoa hover:bg-sand/60",
                  )}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
