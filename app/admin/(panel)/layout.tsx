import { AdminNav, type NavItem } from "@/components/admin/AdminNav";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { signOut, toggleAdminLang } from "../auth-actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const isAdmin = profile.role === "admin";

  const items: NavItem[] = [
    { href: "/admin", label: dict.nav.dashboard },
    { href: "/admin/posts", label: dict.nav.posts },
    { href: "/admin/reports", label: dict.nav.reports },
    { href: "/admin/media", label: dict.nav.media },
    { href: "/admin/team", label: dict.nav.team },
    { href: "/admin/partners", label: dict.nav.partners },
    { href: "/admin/map", label: dict.nav.map },
    ...(isAdmin
      ? [
          { href: "/admin/messages", label: dict.nav.messages },
          { href: "/admin/subscribers", label: dict.nav.subscribers },
          { href: "/admin/users", label: dict.nav.users },
          { href: "/admin/settings", label: dict.nav.settings },
        ]
      : []),
  ];

  return (
    <div className="lg:flex">
      <AdminNav
        items={items}
        footer={
          <>
            <p className="truncate px-3 text-sm text-white/70" title={profile.email ?? ""}>
              {profile.full_name || profile.email}
            </p>
            <a href={`/${lang}`} target="_blank" rel="noopener noreferrer" className="block rounded-xl px-3 py-2 text-white/85 hover:bg-white/10">
              {dict.nav.viewSite} ↗
            </a>
            <form action={toggleAdminLang}>
              <input type="hidden" name="lang" value={lang === "es" ? "en" : "es"} />
              <button className="w-full rounded-xl px-3 py-2 text-left text-white/85 hover:bg-white/10">🌐 {dict.nav.language}</button>
            </form>
            <form action={signOut}>
              <button className="w-full rounded-xl px-3 py-2 text-left text-white/85 hover:bg-white/10">{dict.nav.logout}</button>
            </form>
          </>
        }
      />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
