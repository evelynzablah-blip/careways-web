"use server";

import { redirect } from "next/navigation";
import type { SaveState } from "@/components/admin/fields";
import { requireStaff } from "@/lib/admin-auth";
import { friendlyDbError, list, optStr, resolvePublishing, revalidateSite, slugify, str } from "@/lib/admin-actions-util";

export async function savePost(_: SaveState, formData: FormData): Promise<SaveState> {
  const { supabase, user } = await requireStaff();
  const id = str(formData, "id") || null;
  const intent = str(formData, "intent") || "save";

  const title_en = str(formData, "title_en");
  if (!title_en) return { error: "title (EN)", at: Date.now() };
  const slug = slugify(str(formData, "slug") || title_en);

  let current: { status: "draft" | "published"; published_at: string | null } | null = null;
  if (id) {
    const { data } = await supabase.from("posts").select("status, published_at").eq("id", id).maybeSingle();
    current = data;
  }
  const publishing = resolvePublishing(intent, current);

  const row = {
    slug,
    title_en,
    title_es: optStr(formData, "title_es"),
    excerpt_en: optStr(formData, "excerpt_en"),
    excerpt_es: optStr(formData, "excerpt_es"),
    body_en: optStr(formData, "body_en"),
    body_es: optStr(formData, "body_es"),
    cover_image_path: optStr(formData, "cover_image_path"),
    cover_alt_en: optStr(formData, "cover_alt_en"),
    cover_alt_es: optStr(formData, "cover_alt_es"),
    category: optStr(formData, "category"),
    author_name: optStr(formData, "author_name"),
    country_codes: list(formData, "country_codes"),
    ...publishing,
  };

  const result = id
    ? await supabase.from("posts").update(row).eq("id", id).select("id, status").single()
    : await supabase.from("posts").insert({ ...row, created_by: user.id }).select("id, status").single();

  if (result.error) return { error: friendlyDbError(result.error.message), at: Date.now() };
  revalidateSite();
  return { ok: true, id: result.data.id, status: result.data.status, intent, at: Date.now() };
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireStaff({ admin: true });
  await supabase.from("posts").delete().eq("id", str(formData, "id"));
  revalidateSite();
  redirect("/admin/posts");
}
