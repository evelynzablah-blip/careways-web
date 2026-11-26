import Link from "next/link";
import { OrderedList } from "@/components/admin/OrderedList";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { mediaUrl } from "@/lib/storage";
import type { TeamMember } from "@/lib/types";

export default async function TeamList() {
  const { supabase } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const { data } = await supabase.from("team_members").select("*").order("sort_order").order("created_at");
  const members = (data ?? []) as TeamMember[];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-navy">{dict.team.title}</h1>
        <Link href="/admin/team/new" className="rounded-full bg-navy px-5 py-2.5 font-semibold text-white hover:bg-navy-700">
          + {dict.team.newTitle}
        </Link>
      </div>
      <OrderedList
        table="team_members"
        dict={dict}
        editHref={(id) => `/admin/team/${id}`}
        rows={members.map((m) => {
          const src = mediaUrl(m.photo_path);
          return {
            id: m.id,
            visible: m.visible,
            title: m.name,
            subtitle: (lang === "es" ? m.role_es || m.role_en : m.role_en) || dict.team.fields.rolePlaceholder,
            // eslint-disable-next-line @next/next/no-img-element
            thumb: src ? <img src={src} alt="" className="h-12 w-12 rounded-full object-cover object-top" /> : <span className="h-12 w-12 rounded-full bg-sky" />,
          };
        })}
      />
    </div>
  );
}
