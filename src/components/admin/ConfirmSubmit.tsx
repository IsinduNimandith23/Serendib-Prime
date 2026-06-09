"use client";

import type { ReactNode } from "react";

export function ConfirmSubmit({
  message,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <button
      type="submit"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
