import Link from "next/link";
import { OrderedList } from "@/components/admin/OrderedList";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import type { MapLocation } from "@/lib/types";

export default async function MapList() {
  const { supabase } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const { data } = await supabase.from("map_locations").select("*").order("sort_order").order("created_at");
  const locations = (data ?? []) as MapLocation[];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-navy">{dict.map.title}</h1>
        <Link href="/admin/map/new" className="rounded-full bg-navy px-5 py-2.5 font-semibold text-white hover:bg-navy-700">
          + {dict.map.newTitle}
        </Link>
      </div>
      <OrderedList
        table="map_locations"
        dict={dict}
        editHref={(id) => `/admin/map/${id}`}
        rows={locations.map((l) => ({
          id: l.id,
          visible: l.visible,
          title: `${lang === "es" ? l.country_es : l.country_en} — ${l.hospital_name}`,
          subtitle: `${l.country_code} · ${l.lat.toFixed(3)}, ${l.lng.toFixed(3)}`,
          thumb: <span aria-hidden className="text-2xl">📍</span>,
        }))}
      />
    </div>
  );
}
