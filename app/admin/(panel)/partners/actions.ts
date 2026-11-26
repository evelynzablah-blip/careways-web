"use server";

import { redirect } from "next/navigation";
import type { SaveState } from "@/components/admin/fields";
import { requireStaff } from "@/lib/admin-auth";
import { friendlyDbError, optStr, revalidateSite, str } from "@/lib/admin-actions-util";

export async function savePartner(_: SaveState, formData: FormData): Promise<SaveState> {
  const { supabase } = await requireStaff();
  const id = str(formData, "id") || null;
  const name = str(formData, "name");
  if (!name) return { error: "name", at: Date.now() };
  const url = optStr(formData, "url");
  if (url && !/^https?:\/\//.test(url)) return { error: "URL (https://…)", at: Date.now() };

  const row = {
    name,
    type: str(formData, "type") === "hospital" ? "hospital" : "sponsor",
    logo_path: optStr(formData, "logo_path"),
    url,
    visible: formData.get("visible") === "on",
  };

  let result;
  if (id) {
    result = await supabase.from("partners").update(row).eq("id", id).select("id").single();
  } else {
    const { count } = await supabase.from("partners").select("id", { count: "exact", head: true });
    result = await supabase.from("partners").insert({ ...row, sort_order: (count ?? 0) + 1 }).select("id").single();
  }
  if (result.error) return { error: friendlyDbError(result.error.message), at: Date.now() };
  revalidateSite();
  if (!id) redirect(`/admin/partners/${result.data.id}`);
  return { ok: true, id: result.data.id, at: Date.now() };
}

export async function deletePartner(formData: FormData) {
  const { supabase } = await requireStaff({ admin: true });
  await supabase.from("partners").delete().eq("id", str(formData, "id"));
  revalidateSite();
  redirect("/admin/partners");
}
