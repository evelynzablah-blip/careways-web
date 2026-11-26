import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The admin panel is not localized by URL; it only needs the Supabase
  // session refreshed and a login guard.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return updateSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals and any path with a file extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
