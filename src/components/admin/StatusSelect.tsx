"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "@/components/icons";
import type { OrderStatus } from "@/lib/types";

const OPTIONS: OrderStatus[] = ["pending", "paid", "failed", "cancelled"];

export function StatusSelect({ defaultValue }: { defaultValue: OrderStatus }) {
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
        className="flex w-44 cursor-pointer items-center justify-between gap-2 rounded-full border border-clay bg-cream px-4 py-2 text-[15px] font-semibold capitalize text-cocoa transition-colors hover:border-spice focus-visible:outline-spice"
      >
        {value}
        <IconChevronDown
          className={cn("h-4 w-4 text-cocoa-soft transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 w-44 overflow-hidden rounded-2xl border border-clay bg-cream p-1 shadow-lg shadow-cocoa/5">
          {OPTIONS.map((opt) => {
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
                    "w-full cursor-pointer rounded-xl px-3 py-2 text-left text-[15px] font-medium capitalize transition-colors",
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
