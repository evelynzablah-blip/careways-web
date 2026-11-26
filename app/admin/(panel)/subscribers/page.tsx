import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { isConstantContactConfigured } from "@/lib/constant-contact";

type Signup = { id: string; email: string; first_name: string | null; locale: string | null; source: string | null; status: "stored" | "pending" | "synced" | "failed"; error: string | null; created_at: string };

export default async function SubscribersPage() {
  const { supabase } = await requireStaff({ admin: true });
  const { lang, dict } = await getAdminContext();
  const { data } = await supabase.from("newsletter_signups").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = (data ?? []) as Signup[];
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es" : "en-US", { dateStyle: "medium" });

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-navy">{dict.subscribers.title}</h1>
        <a href="/admin/subscribers/export" download className="rounded-full px-5 py-2.5 font-semibold text-navy ring-1 ring-line hover:bg-sky-50">
          ⬇ {dict.subscribers.export}
        </a>
      </div>
      <p className="mt-2 text-muted">{dict.subscribers.intro}</p>
      <p className="mt-1 text-sm text-muted">Constant Contact: {isConstantContactConfigured() ? "✓" : "—"}</p>
      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-muted ring-1 ring-line">{dict.common.empty}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-sky-50 text-navy">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">{dict.users.name}</th>
                <th className="px-4 py-3">{dict.common.status}</th>
                <th className="px-4 py-3">—</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2.5 font-medium">{r.email}</td>
                  <td className="px-4 py-2.5">{r.first_name}</td>
                  <td className="px-4 py-2.5" title={r.error ?? ""}>
                    {dict.subscribers.status[r.status]}
                  </td>
                  <td className="px-4 py-2.5 text-muted">
                    {fmt.format(new Date(r.created_at))} · {r.source} · {r.locale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
