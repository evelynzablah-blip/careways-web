import Link from "next/link";
import { OrderedList } from "@/components/admin/OrderedList";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { mediaUrl } from "@/lib/storage";
import type { Partner } from "@/lib/types";

export default async function PartnersList() {
  const { supabase } = await requireStaff();
  const { dict } = await getAdminContext();
  const { data } = await supabase.from("partners").select("*").order("sort_order").order("created_at");
  const partners = (data ?? []) as Partner[];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-navy">{dict.partners.title}</h1>
        <Link href="/admin/partners/new" className="rounded-full bg-navy px-5 py-2.5 font-semibold text-white hover:bg-navy-700">
          + {dict.partners.newTitle}
        </Link>
      </div>
      <OrderedList
        table="partners"
        dict={dict}
        editHref={(id) => `/admin/partners/${id}`}
        rows={partners.map((p) => {
          const src = mediaUrl(p.logo_path);
          return {
            id: p.id,
            visible: p.visible,
            title: p.name,
            subtitle: p.type === "hospital" ? dict.partners.fields.hospital : dict.partners.fields.sponsor,
            // eslint-disable-next-line @next/next/no-img-element
            thumb: src ? <img src={src} alt="" className="h-10 w-20 object-contain" /> : <span className="h-10 w-20 rounded bg-sky" />,
          };
        })}
      />
    </div>
  );
}
