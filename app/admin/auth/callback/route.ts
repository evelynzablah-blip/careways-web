import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

/**
 * Landing point for links in Supabase emails:
 *  - ?code=…                     (PKCE: magic link / password reset started from this site)
 *  - ?token_hash=…&type=invite   (invite, magic link and recovery templates — see README)
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const rawNext = url.searchParams.get("next") ?? "/admin";
  const type = url.searchParams.get("type") as EmailOtpType | null;
  let next = rawNext.startsWith("/admin") && !rawNext.startsWith("//") ? rawNext : "/admin";
  if (type === "invite" || type === "recovery") next = "/admin/reset-password";

  const supabase = await getServerClient();
  if (!supabase) return NextResponse.redirect(new URL("/admin/setup", url));

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");

  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }

  return NextResponse.redirect(new URL(ok ? next : "/admin/login?link=expired", url));
}
