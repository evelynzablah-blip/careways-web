"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin-auth";
import { optStr, str } from "@/lib/admin-actions-util";

export async function updateAlt(formData: FormData) {
  const { supabase } = await requireStaff();
  await supabase
    .from("media_assets")
    .update({ alt_en: optStr(formData, "alt_en"), alt_es: optStr(formData, "alt_es") })
    .eq("id", str(formData, "id"));
  revalidatePath("/admin/media");
}

export async function deleteAsset(formData: FormData) {
  const { supabase } = await requireStaff({ admin: true });
  const id = str(formData, "id");
  const { data } = await supabase.from("media_assets").select("bucket, path").eq("id", id).maybeSingle();
  if (data) await supabase.storage.from(data.bucket).remove([data.path]);
  await supabase.from("media_assets").delete().eq("id", id);
  revalidatePath("/admin/media");
}
