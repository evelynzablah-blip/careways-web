"use server";

import { redirect } from "next/navigation";
import type { SaveState } from "@/components/admin/fields";
import { requireStaff } from "@/lib/admin-auth";
import { friendlyDbError, optStr, revalidateSite, slugify, str } from "@/lib/admin-actions-util";

export async function saveTeamMember(_: SaveState, formData: FormData): Promise<SaveState> {
  const { supabase } = await requireStaff();
  const id = str(formData, "id") || null;
  const name = str(formData, "name");
  if (!name) return { error: "name", at: Date.now() };

  const row = {
    name,
    slug: slugify(name),
    role_en: optStr(formData, "role_en"),
    role_es: optStr(formData, "role_es"),
    affiliation_en: optStr(formData, "affiliation_en"),
    affiliation_es: optStr(formData, "affiliation_es"),
    bio_en: optStr(formData, "bio_en"),
    bio_es: optStr(formData, "bio_es"),
    photo_path: optStr(formData, "photo_path"),
    visible: formData.get("visible") === "on",
  };

  let result;
  if (id) {
    result = await supabase.from("team_members").update(row).eq("id", id).select("id").single();
  } else {
    const { count } = await supabase.from("team_members").select("id", { count: "exact", head: true });
    result = await supabase.from("team_members").insert({ ...row, sort_order: (count ?? 0) + 1 }).select("id").single();
  }
  if (result.error) return { error: friendlyDbError(result.error.message), at: Date.now() };
  revalidateSite();
  if (!id) redirect(`/admin/team/${result.data.id}`);
  return { ok: true, id: result.data.id, at: Date.now() };
}

export async function deleteTeamMember(formData: FormData) {
  const { supabase } = await requireStaff({ admin: true });
  await supabase.from("team_members").delete().eq("id", str(formData, "id"));
  revalidateSite();
  redirect("/admin/team");
}
