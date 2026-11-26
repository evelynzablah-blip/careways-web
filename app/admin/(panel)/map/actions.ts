"use server";

import { redirect } from "next/navigation";
import type { SaveState } from "@/components/admin/fields";
import { requireStaff } from "@/lib/admin-auth";
import { friendlyDbError, optStr, revalidateSite, slugify, str } from "@/lib/admin-actions-util";

export async function saveMapLocation(_: SaveState, formData: FormData): Promise<SaveState> {
  const { supabase } = await requireStaff();
  const id = str(formData, "id") || null;
  const country_code = str(formData, "country_code").toUpperCase();
  const country_en = str(formData, "country_en");
  const hospital_name = str(formData, "hospital_name");
  const lat = Number(str(formData, "lat"));
  const lng = Number(str(formData, "lng"));
  if (!/^[A-Z]{2}$/.test(country_code)) return { error: "country code", at: Date.now() };
  if (!country_en || !hospital_name) return { error: "country / hospital", at: Date.now() };
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return { error: "lat / lng", at: Date.now() };
  const url = optStr(formData, "url");
  if (url && !/^https?:\/\//.test(url)) return { error: "URL (https://…)", at: Date.now() };

  const row = {
    slug: slugify(str(formData, "slug") || country_en),
    country_code,
    country_en,
    country_es: str(formData, "country_es") || country_en,
    hospital_name,
    lat,
    lng,
    url,
    summary_en: optStr(formData, "summary_en"),
    summary_es: optStr(formData, "summary_es"),
    visible: formData.get("visible") === "on",
  };

  let result;
  if (id) {
    result = await supabase.from("map_locations").update(row).eq("id", id).select("id").single();
  } else {
    const { count } = await supabase.from("map_locations").select("id", { count: "exact", head: true });
    result = await supabase.from("map_locations").insert({ ...row, sort_order: (count ?? 0) + 1 }).select("id").single();
  }
  if (result.error) return { error: friendlyDbError(result.error.message), at: Date.now() };
  revalidateSite();
  if (!id) redirect(`/admin/map/${result.data.id}`);
  return { ok: true, id: result.data.id, at: Date.now() };
}

export async function deleteMapLocation(formData: FormData) {
  const { supabase } = await requireStaff({ admin: true });
  await supabase.from("map_locations").delete().eq("id", str(formData, "id"));
  revalidateSite();
  redirect("/admin/map");
}
