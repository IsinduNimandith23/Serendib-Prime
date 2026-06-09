"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/lib/types";
import { formatLKR } from "@/lib/utils";
import { buttonClass } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { LeafSprig, StarAnise } from "@/components/visual/SpiceMotif";
import { Stars } from "@/components/product/Stars";
import { IconArrowRight, IconClock } from "@/components/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();
  const [hero, second, third] = products;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  const float = (offset: number) =>
    reduce
      ? {}
      : {
          y: [0, -16, 0],
          transition: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: offset,
          },
        };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="grain absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 85% 0%, #f6d9a833 0%, transparent 55%), radial-gradient(90% 70% at 0% 100%, #b5371f12 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="eyebrow inline-flex items-center gap-2 rounded-full border border-clay bg-cream/60 px-4 py-1.5 text-spice"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-spice" />
            Premium Sri Lankan seafood
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 text-balance text-4xl font-semibold leading-[1.04] text-cocoa sm:text-5xl lg:text-6xl"
          >
            Real Sri Lankan seafood,{" "}
            <span className="relative whitespace-nowrap text-spice">
              ready in minutes
              <svg
                className="absolute -bottom-2 left-0 w-full text-gold"
                viewBox="0 0 300 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 9C60 3 240 3 298 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-md text-lg leading-relaxed text-cocoa-soft"
          >
            Dried sprats tempered and curried the traditional way — bold, crispy,
            full of spice — then sealed at their peak. No preservatives, no
            shortcuts. Just open, warm and savour.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/products" className={buttonClass({ variant: "primary", size: "lg" })}>
              Shop the pantry <IconArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/about" className={buttonClass({ variant: "outline", size: "lg" })}>
              Our story
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-9 flex items-center gap-4">
            <Stars rating={4.9} />
            <span className="h-8 w-px bg-clay" />
            <p className="text-sm text-cocoa-soft">
              Loved by <strong className="text-cocoa">5,000+</strong> island kitchens
            </p>
          </motion.div>
        </motion.div>

        {/* Hero composition */}
        <div className="relative h-[360px] sm:h-[460px] lg:h-[560px]">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, #f2e0bd 0%, #f4ead9 45%, transparent 72%)",
            }}
          />

          <LeafSprig className="absolute right-2 top-2 h-24 w-24 rotate-12 opacity-30 sm:h-32 sm:w-32" />
          <StarAnise className="absolute bottom-6 left-2 h-16 w-16 opacity-30 sm:h-20 sm:w-20" />

          {third && (
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
              className="absolute bottom-4 left-0 w-[34%] -rotate-6 sm:bottom-8 sm:left-2"
            >
              <motion.div animate={float(0.6)}>
                <ProductImage product={third} sizes="(max-width: 640px) 32vw, 18vw" className="drop-shadow-[0_22px_28px_rgba(42,26,18,0.22)]" />
              </motion.div>
            </motion.div>
          )}

          {second && (
            <motion.div
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="absolute right-0 top-6 w-[36%] rotate-6 sm:right-2"
            >
              <motion.div animate={float(1.1)}>
                <ProductImage product={second} sizes="(max-width: 640px) 34vw, 19vw" className="drop-shadow-[0_22px_28px_rgba(42,26,18,0.22)]" />
              </motion.div>
            </motion.div>
          )}

          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
              className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div animate={float(0)}>
                <ProductImage product={hero} priority sizes="(max-width: 640px) 50vw, 27vw" className="drop-shadow-[0_30px_38px_rgba(42,26,18,0.26)]" />
              </motion.div>
            </motion.div>
          )}

          {/* floating chips */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            className="absolute right-3 bottom-10 flex items-center gap-2 rounded-2xl border border-clay bg-cream/90 px-3.5 py-2.5 shadow-lg backdrop-blur sm:right-6"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf/10 text-leaf">
              <IconClock className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-cocoa">Ready in 2 min</p>
              <p className="text-xs text-cocoa-soft">No prep, no mess</p>
            </div>
          </motion.div>

          {hero && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.85, ease: EASE }}
              className="absolute left-2 top-8 rounded-2xl border border-clay bg-cream/90 px-3.5 py-2.5 shadow-lg backdrop-blur sm:left-0"
            >
              <p className="text-xs text-cocoa-soft">From</p>
              <p className="font-display text-lg font-semibold text-spice">
                {formatLKR(hero.price)}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
