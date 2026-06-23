"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { Product } from "@/lib/types";
import { cn, formatLKR } from "@/lib/utils";
import { buttonClass } from "@/components/ui/Button";
import { FishMotif, Starfish } from "@/components/visual/SeaMotif";
import { usePreloaderDone } from "@/components/providers/Preloader";
import { IconArrowRight, IconClock } from "@/components/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

// Cans hold back this long after load before revealing, so the headline lands
// first and the can composition then animates in as its own smooth moment.
const REVEAL = 0.55;

function floatAnim(offset: number, reduce: boolean | null) {
  return reduce
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
}

export function Hero({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();
  // Hold the entrance until the preloader splash starts lifting, so the
  // choreography plays as the page is revealed instead of behind it.
  const ready = usePreloaderDone();
  const [hero, second, third] = products;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  // Pointer-driven parallax: the front can drifts more than the ones behind it,
  // creating real depth. The cans also fan out at slight angles (see `rotate`
  // on each HeroCan) so the arrangement reads dynamic rather than flat.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springCfg = { stiffness: 80, damping: 20, mass: 0.6 };
  const frontX = useSpring(useTransform(pointerX, [-0.5, 0.5], [28, -28]), springCfg);
  const frontY = useSpring(useTransform(pointerY, [-0.5, 0.5], [20, -20]), springCfg);
  const backX = useSpring(useTransform(pointerX, [-0.5, 0.5], [13, -13]), springCfg);
  const backY = useSpring(useTransform(pointerY, [-0.5, 0.5], [9, -9]), springCfg);

  function handlePointer(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section className="relative -mt-19 flex min-h-svh items-center overflow-hidden pt-19 sm:-mt-22 sm:pt-22">
      <div
        aria-hidden
        className="grain absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 85% 0%, #f6d9a833 0%, transparent 55%), radial-gradient(90% 70% at 0% 100%, #b5371f12 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-352 items-center gap-8 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24 xl:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          className="text-center lg:text-left"
        >
          <motion.h1
            variants={item}
            className="text-balance text-4xl font-semibold leading-[1.04] text-cocoa sm:text-6xl xl:text-7xl"
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
            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-cocoa-soft sm:mt-7 sm:text-lg lg:mx-0 xl:max-w-lg xl:text-xl"
          >
            Dried sprats tempered and curried the traditional way - bold, crispy,
            full of spice - then sealed at their peak. No preservatives, no
            shortcuts. Just open, warm and savour.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-8 lg:justify-start"
          >
            <Link href="/products" className={buttonClass({ variant: "primary", size: "lg" })}>
              Shop the pantry <IconArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/about" className={buttonClass({ variant: "outline", size: "lg" })}>
              Our story
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero composition */}
        <div
          className="relative h-82.5 sm:h-115 lg:h-140 xl:h-155"
          onPointerMove={handlePointer}
          onPointerLeave={resetPointer}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={ready ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, #f2e0bd 0%, #f4ead9 45%, transparent 72%)",
            }}
          />

          <FishMotif className="absolute right-2 top-2 h-24 w-24 rotate-12 opacity-30 sm:h-32 sm:w-32" />
          <Starfish className="absolute bottom-6 left-2 h-16 w-16 opacity-30 sm:h-20 sm:w-20" />

          {/* Cans reveal a beat after the headline settles, so the composition
             assembles itself: the side cans fan in first (REVEAL + small stagger)
             and the front hero can lands last, on top. */}

          {/* Back layer - parallax drifts less than the front can */}
          {third && (
            <HeroCan
              product={third}
              parallaxX={backX}
              parallaxY={backY}
              positionClassName="absolute bottom-4 left-0 w-[34%] sm:bottom-8 sm:left-2"
              initial={{ opacity: 0, y: 38, x: -18, scale: 0.92 }}
              delay={REVEAL}
              rotate={-5}
              floatOffset={0.6}
              sizes="(max-width: 640px) 32vw, 18vw"
              shadowClassName="drop-shadow-[0_16px_24px_rgba(7,49,74,0.20)]"
              reduce={reduce}
              ready={ready}
            />
          )}

          {second && (
            <HeroCan
              product={second}
              parallaxX={backX}
              parallaxY={backY}
              positionClassName="absolute right-0 top-6 w-[36%] sm:right-2"
              initial={{ opacity: 0, y: 38, x: 18, scale: 0.92 }}
              delay={REVEAL + 0.12}
              rotate={5}
              floatOffset={1.1}
              sizes="(max-width: 640px) 34vw, 19vw"
              shadowClassName="drop-shadow-[0_16px_24px_rgba(7,49,74,0.20)]"
              reduce={reduce}
              ready={ready}
            />
          )}

          {/* Front layer - the hero can sits closest and drifts most */}
          {hero && (
            <div className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2">
              <HeroCan
                product={hero}
                parallaxX={frontX}
                parallaxY={frontY}
                initial={{ opacity: 0, y: 54, scale: 0.9 }}
                delay={REVEAL + 0.26}
                rotate={-2}
                floatOffset={0}
                sizes="(max-width: 640px) 50vw, 27vw"
                shadowClassName="drop-shadow-[0_28px_36px_rgba(7,49,74,0.30)]"
                reduce={reduce}
                ready={ready}
              />
            </div>
          )}

          {/* floating chips */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: REVEAL + 0.5, ease: EASE }}
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
              animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: REVEAL + 0.65, ease: EASE }}
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

/**
 * A single hero can. The entrance animation only fires once the image has
 * actually loaded (covering the cached case via `complete`), so the can fades
 * and slides in smoothly with its pixels - never an empty box that pops in.
 */
function HeroCan({
  product,
  parallaxX,
  parallaxY,
  positionClassName,
  initial,
  delay,
  rotate = 0,
  floatOffset,
  sizes,
  shadowClassName,
  reduce,
  ready,
}: {
  product: Product;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  positionClassName?: string;
  initial: { opacity: number; y?: number; x?: number; scale?: number };
  delay: number;
  rotate?: number;
  floatOffset: number;
  sizes: string;
  shadowClassName: string;
  reduce: boolean | null;
  ready: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const hidden = reduce ? { opacity: 0 } : initial;
  const shown = reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <motion.div style={{ x: parallaxX, y: parallaxY }} className={positionClassName}>
      <motion.div
        initial={hidden}
        animate={loaded && ready ? shown : hidden}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        <motion.div animate={floatAnim(floatOffset, reduce)} className="will-change-transform">
          <Link href="/products" aria-label={`Shop ${product.name}`} className="block">
            <Image
              ref={imgRef}
              src={product.image as string}
              alt={product.name}
              width={640}
              height={620}
              sizes={sizes}
              priority
              onLoad={() => setLoaded(true)}
              // Standalone `rotate` (not `transform`) so the tilt composes with the
              // parallax/float/entrance transforms on the wrapping elements.
              style={{ rotate: `${rotate}deg` }}
              className={cn("h-full w-full object-contain", shadowClassName)}
            />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
