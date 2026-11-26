"use server";

import { revalidatePath } from "next/cache";
import type { SaveState } from "@/components/admin/fields";
import { requireStaff } from "@/lib/admin-auth";
import { str } from "@/lib/admin-actions-util";
import { siteUrl } from "@/lib/env";
import { getServiceClient } from "@/lib/supabase/admin";

export async function inviteUser(_: SaveState, formData: FormData): Promise<SaveState> {
  const { supabase } = await requireStaff({ admin: true });
  const service = getServiceClient();
  if (!service) return { error: "SUPABASE_SERVICE_ROLE_KEY", at: Date.now() };

  const email = str(formData, "email").toLowerCase();
  const full_name = str(formData, "full_name") || null;
  const role = str(formData, "role") === "admin" ? "admin" : "editor";
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "email", at: Date.now() };

  const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
    data: { full_name },
    redirectTo: `${siteUrl}/admin/auth/callback?next=/admin/reset-password`,
  });
  if (error) return { error: error.message, at: Date.now() };

  // The trigger created an inactive profile; the admin (via RLS) activates it with the chosen role.
  const { error: upErr } = await supabase
    .from("profiles")
    .update({ role, active: true, full_name, email })
    .eq("id", data.user.id);
  if (upErr) return { error: upErr.message, at: Date.now() };

  revalidatePath("/admin/users");
  return { ok: true, at: Date.now() };
}

export async function updateUser(formData: FormData) {
  const { supabase, user } = await requireStaff({ admin: true });
  const id = str(formData, "id");
  if (id === user.id) return; // admins can't demote or deactivate themselves
  const patch: Record<string, unknown> = {};
  if (formData.has("role")) patch.role = str(formData, "role") === "admin" ? "admin" : "editor";
  if (formData.has("active")) patch.active = str(formData, "active") === "true";
  await supabase.from("profiles").update(patch).eq("id", id);
  revalidatePath("/admin/users");
}
