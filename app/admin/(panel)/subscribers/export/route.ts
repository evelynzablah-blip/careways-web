import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

/** CSV export of newsletter sign-ups (admins only — enforced by RLS too). */
export async function GET() {
  const supabase = await getServerClient();
  if (!supabase) return new NextResponse("Not configured", { status: 503 });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role, active").eq("id", user.id).maybeSingle();
  if (!profile?.active || profile.role !== "admin") return new NextResponse("Forbidden", { status: 403 });

  const { data } = await supabase.from("newsletter_signups").select("email, first_name, locale, source, status, created_at").order("created_at");
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    // Prevent spreadsheet formula injection and quote every cell.
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const csv = [
    ["email", "first_name", "locale", "source", "status", "created_at"].join(","),
    ...(data ?? []).map((r) => [r.email, r.first_name, r.locale, r.source, r.status, r.created_at].map(esc).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="careways-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
