"use server";

import { requireStaff } from "@/lib/admin-auth";
import { revalidateSite, str } from "@/lib/admin-actions-util";
import { revalidatePath } from "next/cache";

const ORDERED_TABLES = {
  team_members: "/admin/team",
  partners: "/admin/partners",
  map_locations: "/admin/map",
} as const;
type OrderedTable = keyof typeof ORDERED_TABLES;

function table(formData: FormData): OrderedTable {
  const t = str(formData, "table");
  if (!(t in ORDERED_TABLES)) throw new Error("invalid table");
  return t as OrderedTable;
}

export async function toggleVisible(formData: FormData) {
  const { supabase } = await requireStaff();
  const t = table(formData);
  await supabase.from(t).update({ visible: str(formData, "visible") === "true" }).eq("id", str(formData, "id"));
  revalidateSite();
  revalidatePath(ORDERED_TABLES[t]);
}

/** Swaps sort_order with the neighbour above/below, then renumbers 1..n. */
export async function move(formData: FormData) {
  const { supabase } = await requireStaff();
  const t = table(formData);
  const id = str(formData, "id");
  const dir = str(formData, "dir") === "up" ? -1 : 1;
  const { data } = await supabase.from(t).select("id, sort_order").order("sort_order").order("created_at");
  const rows = data ?? [];
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await Promise.all(rows.map((r, idx) => supabase.from(t).update({ sort_order: idx + 1 }).eq("id", r.id)));
  revalidateSite();
  revalidatePath(ORDERED_TABLES[t]);
}
