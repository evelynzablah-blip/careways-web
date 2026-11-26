import { SettingsForm } from "@/components/admin/SettingsForm";
import { defaultSettings } from "@/content/seed/settings";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import type { SiteSettings } from "@/lib/types";

export default async function SettingsPage() {
  const { supabase } = await requireStaff({ admin: true });
  const { dict } = await getAdminContext();
  const { data } = await supabase.from("site_settings").select("key, value");
  const settings: SiteSettings = { ...defaultSettings };
  for (const row of data ?? []) {
    if (row.key in settings) (settings as unknown as Record<string, string>)[row.key] = row.value ?? "";
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold text-navy">{dict.settings.title}</h1>
      <SettingsForm settings={settings} dict={dict} />
    </div>
  );
}
