import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "dark" | "light";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

const variants: Record<Variant, string> = {
  primary: "bg-spice text-cream hover:bg-spice-dark shadow-sm hover:shadow-lg hover:shadow-spice/20",
  gold: "bg-gold text-night hover:bg-gold-dark hover:text-cream shadow-sm",
  outline: "border border-cocoa/20 text-cocoa hover:border-spice hover:text-spice",
  ghost: "text-cocoa hover:bg-cocoa/5",
  dark: "bg-night text-cream hover:bg-cocoa",
  light: "bg-cream text-cocoa hover:bg-sand shadow-sm",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-60",
    sizes[size],
    variants[variant],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClass({ variant, size, className })} {...props} />;
}
