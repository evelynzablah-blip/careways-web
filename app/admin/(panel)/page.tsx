import Link from "next/link";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";

export default async function Dashboard() {
  const { supabase, profile } = await requireStaff();
  const { dict } = await getAdminContext();

  const count = async (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return (await q).count ?? 0;
  };

  const [postsDraft, postsLive, reportsDraft, reportsLive, unread] = await Promise.all([
    count("posts", ["status", "draft"]),
    count("posts", ["status", "published"]),
    count("mission_reports", ["status", "draft"]),
    count("mission_reports", ["status", "published"]),
    profile.role === "admin" ? count("contact_messages", ["read", "false"]) : Promise.resolve(0),
  ]);

  const stats = [
    { label: `${dict.nav.posts} · ${dict.common.published}`, value: postsLive, href: "/admin/posts" },
    { label: `${dict.nav.posts} · ${dict.common.draft}`, value: postsDraft, href: "/admin/posts" },
    { label: `${dict.nav.reports} · ${dict.common.published}`, value: reportsLive, href: "/admin/reports" },
    { label: `${dict.nav.reports} · ${dict.common.draft}`, value: reportsDraft, href: "/admin/reports" },
    ...(profile.role === "admin" ? [{ label: `${dict.nav.messages} · ${dict.messages.unread}`, value: unread, href: "/admin/messages" }] : []),
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-extrabold text-navy">
        {dict.dashboard.title} {profile.full_name?.split(" ")[0] ?? ""}
      </h1>
      <p className="mt-2 text-lg text-muted">{dict.dashboard.intro}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/posts/new" className="rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-700">
          ✏️ {dict.dashboard.quickPost}
        </Link>
        <Link href="/admin/reports/new" className="rounded-full bg-sun px-6 py-3 font-semibold text-navy-900 hover:bg-sun-500">
          📄 {dict.dashboard.quickReport}
        </Link>
      </div>

      <section className="mt-10 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
        <h2 className="text-xl font-bold text-navy">{dict.dashboard.help.title}</h2>
        <ol className="mt-4 space-y-3">
          {dict.dashboard.help.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky font-bold text-navy">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">{dict.dashboard.help.note}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{dict.dashboard.counts}</h2>
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label}>
              <Link href={s.href} className="block rounded-2xl bg-white p-5 ring-1 ring-line hover:ring-blue">
                <p className="text-3xl font-extrabold text-navy">{s.value}</p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
