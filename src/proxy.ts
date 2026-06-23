import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Coming Soon gate.
 *
 * While the storefront is being finished, every public page is rewritten to
 * `/coming-soon`. The admin panel and API stay reachable so the site can keep
 * being built and managed behind the placeholder.
 *
 * In Next.js 16 the old `middleware` file convention is renamed to `proxy`.
 *
 * Toggle:
 *   - On by default (any value except "false").
 *   - Set COMING_SOON=false in the environment to take the site fully live.
 *
 * Preview the in-progress site:
 *   - Visit any page with `?preview=1` to drop a cookie that bypasses the gate.
 *   - Visit with `?preview=0` to clear it.
 */
const COMING_SOON = process.env.COMING_SOON !== "false";

const PREVIEW_COOKIE = "sp_preview";

// Prefixes that stay reachable even while the gate is up.
const ALLOWED_PREFIXES = ["/coming-soon", "/admin"];

export function proxy(request: NextRequest) {
  if (!COMING_SOON) return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;

  // Owner preview toggle via ?preview=1 / ?preview=0
  const previewParam = searchParams.get("preview");
  if (previewParam !== null) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    if (previewParam === "0") {
      response.cookies.delete(PREVIEW_COOKIE);
    } else {
      response.cookies.set(PREVIEW_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    return response;
  }

  // Bypass the gate for owners who enabled preview mode.
  if (request.cookies.get(PREVIEW_COOKIE)?.value === "1") {
    return NextResponse.next();
  }

  // Always let allowed sections through.
  if (
    ALLOWED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
    )
  ) {
    return NextResponse.next();
  }

  // Everything else shows the coming soon page (URL stays the same).
  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything except API routes, Next internals, and static files
  // (any path containing a "." — e.g. /logo.svg, /favicon.ico, images).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
