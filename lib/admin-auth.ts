import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { ADMIN_LANG_COOKIE, getAdminDict, type AdminLang } from "@/lib/admin-i18n";
import type { Profile } from "@/lib/types";

export async function getAdminLang(): Promise<AdminLang> {
  const value = (await cookies()).get(ADMIN_LANG_COOKIE)?.value;
  return value === "en" ? "en" : "es";
}

export async function getAdminContext() {
  const lang = await getAdminLang();
  return { lang, dict: getAdminDict(lang) };
}

/**
 * Loads the signed-in, active staff member or redirects. Used by every admin
 * page and server action (RLS enforces the same rules in the database).
 */
export async function requireStaff(opts: { admin?: boolean } = {}) {
  const supabase = await getServerClient();
  if (!supabase) redirect("/admin/setup");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile || !profile.active) redirect("/admin/login?inactive=1");
  if (opts.admin && profile.role !== "admin") redirect("/admin");
  return { supabase, user, profile: profile as Profile };
}
