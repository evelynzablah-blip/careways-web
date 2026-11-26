import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminLang } from "@/lib/admin-i18n";

/** Country options for content forms, taken from the map pins. */
export async function getCountryOptions(supabase: SupabaseClient, lang: AdminLang) {
  const { data } = await supabase.from("map_locations").select("country_code, country_en, country_es").order("sort_order");
  const seen = new Map<string, string>();
  for (const row of data ?? []) {
    if (!seen.has(row.country_code)) seen.set(row.country_code, lang === "es" ? row.country_es : row.country_en);
  }
  // Boston missions / patients brought to the US appear in historic reports.
  if (!seen.has("US")) seen.set("US", lang === "es" ? "Estados Unidos (Boston)" : "United States (Boston)");
  return [...seen].map(([code, label]) => ({ code, label }));
}

export function formatAdminDate(iso: string | null | undefined, lang: AdminLang) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(lang === "es" ? "es" : "en-US", { dateStyle: "medium" }).format(new Date(iso));
}
