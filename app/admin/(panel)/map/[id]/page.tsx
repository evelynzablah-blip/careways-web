import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { MapLocationForm } from "@/components/admin/MapLocationForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import type { MapLocation } from "@/lib/types";
import { deleteMapLocation } from "../actions";

export default async function EditMapLocation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireStaff();
  const { dict } = await getAdminContext();
  const isNew = id === "new";
  let location: MapLocation | null = null;
  if (!isNew) {
    const { data } = await supabase.from("map_locations").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    location = data as MapLocation;
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/map" className="text-sm font-semibold text-link hover:underline">
            ← {dict.map.title}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-navy">{isNew ? dict.map.newTitle : dict.map.editTitle}</h1>
        </div>
        {location && profile.role === "admin" && <DeleteButton action={deleteMapLocation} id={location.id} dict={dict} />}
      </div>
      <div className="mt-6">
        <MapLocationForm location={location} dict={dict} />
      </div>
    </div>
  );
}
