"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_LANG_COOKIE } from "@/lib/admin-i18n";
import { siteUrl } from "@/lib/env";
import { getServerClient } from "@/lib/supabase/server";

export type AuthState = { ok?: boolean; error?: string; message?: string };

function safeNext(next: FormDataEntryValue | null) {
  const value = typeof next === "string" ? next : "";
  return value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}

export async function signInWithPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await getServerClient();
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "invalid" };
  redirect(safeNext(formData.get("next")));
}

export async function sendMagicLink(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await getServerClient();
  if (!supabase) return { error: "not_configured" };
  // shouldCreateUser: false — the panel is invitation-only.
  await supabase.auth.signInWithOtp({
    email: String(formData.get("email") ?? "").trim(),
    options: { shouldCreateUser: false, emailRedirectTo: `${siteUrl}/admin/auth/callback?next=/admin` },
  });
  // Same answer whether or not the account exists.
  return { ok: true, message: "magicSent" };
}

export async function sendPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await getServerClient();
  if (!supabase) return { error: "not_configured" };
  await supabase.auth.resetPasswordForEmail(String(formData.get("email") ?? "").trim(), {
    redirectTo: `${siteUrl}/admin/auth/callback?next=/admin/reset-password`,
  });
  return { ok: true, message: "resetSent" };
}

export async function setNewPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await getServerClient();
  if (!supabase) return { error: "not_configured" };
  const password = String(formData.get("password") ?? "");
  if (password.length < 10) return { error: "passwordRule" };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { ok: true, message: "passwordSaved" };
}

export async function signOut() {
  const supabase = await getServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function toggleAdminLang(formData: FormData) {
  const lang = formData.get("lang") === "en" ? "en" : "es";
  (await cookies()).set(ADMIN_LANG_COOKIE, lang, { path: "/admin", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
