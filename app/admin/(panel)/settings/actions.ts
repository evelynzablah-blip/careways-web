"use server";

import type { SaveState } from "@/components/admin/fields";
import { defaultSettings } from "@/content/seed/settings";
import { requireStaff } from "@/lib/admin-auth";
import { revalidateSite } from "@/lib/admin-actions-util";

const KEYS = Object.keys(defaultSettings) as Array<keyof typeof defaultSettings>;

export async function saveSettings(_: SaveState, formData: FormData): Promise<SaveState> {
  const { supabase } = await requireStaff({ admin: true });
  const now = new Date().toISOString();
  const rows = KEYS.map((key) => ({ key, value: String(formData.get(key) ?? "").trim(), updated_at: now }));
  for (const r of rows) {
    if (r.key.endsWith("_url") && r.value && !/^https?:\/\//.test(r.value)) return { error: `${r.key}: https://…`, at: Date.now() };
    if (r.key === "contact_to_email" && r.value && !/^\S+@\S+\.\S+$/.test(r.value)) return { error: r.key, at: Date.now() };
  }
  const { error } = await supabase.from("site_settings").upsert(rows);
  if (error) return { error: error.message, at: Date.now() };
  revalidateSite();
  return { ok: true, at: Date.now() };
}
