"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Logo } from "@/components/visual/Logo";
import { FishMotif } from "@/components/visual/SeaMotif";

const EASE = [0.22, 1, 0.36, 1] as const;
/** Keep the splash up at least this long so it never flashes. */
const MIN_SHOW_MS = 1000;
/** Never hold the page hostage - bail out even if some asset hangs. */
const MAX_WAIT_MS = 4000;

/**
 * `true` once the splash has started lifting - entrance animations that
 * should wait for the reveal (e.g. the Hero) key off this. Defaults to
 * `true` so components behave normally where no preloader is mounted.
 */
const PreloaderDoneContext = createContext(true);

export function usePreloaderDone() {
  return useContext(PreloaderDoneContext);
}

/** Wraps the page so children can ask whether the splash has lifted. */
export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <PreloaderDoneContext.Provider value={done}>
      <Preloader onDone={() => setDone(true)} />
      {children}
    </PreloaderDoneContext.Provider>
  );
}

/**
 * Full-screen splash shown while the initial page load finishes.
 * Rendered in the server HTML so it covers the page from the first paint,
 * waits for `window` load (fonts, images), then wipes up with a wave edge.
 */
function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  // Progress crawls to 90% while assets load, then snaps to 100% when ready.
  const progress = useMotionValue(0);
  const barWidth = useTransform(progress, (p) => `${p * 100}%`);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();

    const crawl = reduce
      ? (progress.set(0.9), null)
      : animate(progress, 0.9, { duration: 2.4, ease: "easeOut" });

    function finish() {
      if (cancelled) return;
      cancelled = true;
      crawl?.stop();
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - started));
      window.setTimeout(() => {
        animate(progress, 1, { duration: 0.25, ease: "easeOut" });
        window.setTimeout(() => {
          setDone(true);
          onDone();
        }, 300);
      }, wait);
    }

    const failsafe = window.setTimeout(finish, MAX_WAIT_MS);
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }

    return () => {
      cancelled = true;
      crawl?.stop();
      window.clearTimeout(failsafe);
      window.removeEventListener("load", finish);
    };
  }, [progress, reduce]);

  // No scrolling underneath the splash.
  useEffect(() => {
    if (done) return;
    document.documentElement.classList.add("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading Serendib Prime"
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="grain fixed inset-0 z-100 flex flex-col items-center justify-center bg-night"
        >
          {/* Soft deep-sea glow */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgb(34 155 167 / 0.18) 0%, transparent 65%)",
            }}
          />

          {/* Rising bubbles */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { left: "20%", top: "68%", size: "h-2.5 w-2.5", delay: "0s" },
              { left: "78%", top: "30%", size: "h-2 w-2", delay: "1.2s" },
              { left: "64%", top: "74%", size: "h-3 w-3", delay: "2s" },
              { left: "32%", top: "22%", size: "h-2 w-2", delay: "0.6s" },
            ].map((b, i) => (
              <span
                key={i}
                className={`absolute ${b.size} animate-float rounded-full border border-seafoam/40 bg-seafoam/10`}
                style={{ left: b.left, top: b.top, animationDelay: b.delay }}
              />
            ))}
          </div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative flex flex-col items-center"
          >
            <Logo light className="h-14 sm:h-16" />

            {/* Progress line with a fish swimming along it */}
            <div className="relative mt-10 h-0.5 w-56 rounded-full bg-cream/15 sm:w-64">
              <motion.div
                style={{ width: barWidth }}
                className="h-full rounded-full bg-seafoam"
              />
              <motion.div
                style={{ left: barWidth }}
                className="absolute -top-3.25 -translate-x-1/2"
              >
                <FishMotif className="h-6 w-6 text-seafoam" />
              </motion.div>
            </div>

            <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-cream/50">
              Setting the table
            </p>
          </motion.div>

          {/* Wave edge that trails the overlay as it wipes up */}
          <svg
            aria-hidden
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            fill="currentColor"
            className="absolute left-0 top-full h-12 w-full text-night"
          >
            <path d="M0 0 L1440 0 L1440 18 C1200 54 960 6 720 28 C480 50 240 8 0 30 Z" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
