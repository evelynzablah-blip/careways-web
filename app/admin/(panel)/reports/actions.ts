"use server";

import { redirect } from "next/navigation";
import type { SaveState } from "@/components/admin/fields";
import { requireStaff } from "@/lib/admin-auth";
import { friendlyDbError, lines, list, optStr, resolvePublishing, revalidateSite, slugify, str } from "@/lib/admin-actions-util";

export async function saveReport(_: SaveState, formData: FormData): Promise<SaveState> {
  const { supabase, user } = await requireStaff();
  const id = str(formData, "id") || null;
  const intent = str(formData, "intent") || "save";

  const title_en = str(formData, "title_en");
  const report_date = str(formData, "report_date");
  if (!title_en) return { error: "title (EN)", at: Date.now() };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(report_date)) return { error: "date", at: Date.now() };
  const issueRaw = str(formData, "issue_number");
  const issue_number = issueRaw ? Number.parseInt(issueRaw, 10) : null;
  const slug = slugify(str(formData, "slug") || (issue_number ? `issue-${issue_number}` : `${title_en}-${report_date.slice(0, 7)}`));

  let current: { status: "draft" | "published"; published_at: string | null } | null = null;
  if (id) {
    const { data } = await supabase.from("mission_reports").select("status, published_at").eq("id", id).maybeSingle();
    current = data;
  }

  const row = {
    slug,
    issue_number: Number.isFinite(issue_number) ? issue_number : null,
    series: optStr(formData, "series"),
    title_en,
    title_es: optStr(formData, "title_es"),
    excerpt_en: optStr(formData, "excerpt_en"),
    excerpt_es: optStr(formData, "excerpt_es"),
    body_en: optStr(formData, "body_en"),
    body_es: optStr(formData, "body_es"),
    highlights_en: lines(formData, "highlights_en"),
    highlights_es: lines(formData, "highlights_es"),
    report_date,
    date_note: optStr(formData, "date_note"),
    country_codes: list(formData, "country_codes"),
    cover_image_path: optStr(formData, "cover_image_path"),
    pdf_path: optStr(formData, "pdf_path"),
    ...resolvePublishing(intent, current),
  };

  const result = id
    ? await supabase.from("mission_reports").update(row).eq("id", id).select("id, status").single()
    : await supabase.from("mission_reports").insert({ ...row, created_by: user.id }).select("id, status").single();

  if (result.error) return { error: friendlyDbError(result.error.message), at: Date.now() };
  revalidateSite();
  return { ok: true, id: result.data.id, status: result.data.status, intent, at: Date.now() };
}

export async function deleteReport(formData: FormData) {
  const { supabase } = await requireStaff({ admin: true });
  await supabase.from("mission_reports").delete().eq("id", str(formData, "id"));
  revalidateSite();
  redirect("/admin/reports");
}
