import type Lenis from "lenis";

/**
 * Module-level reference to the active Lenis instance so non-provider code
 * (e.g. the cart drawer) can pause/resume momentum scrolling without prop-drilling.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function stopLenis() {
  instance?.stop();
}

export function startLenis() {
  instance?.start();
}
