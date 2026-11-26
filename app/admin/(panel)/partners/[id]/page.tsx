import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import type { Partner } from "@/lib/types";
import { deletePartner } from "../actions";

export default async function EditPartner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireStaff();
  const { dict } = await getAdminContext();
  const isNew = id === "new";
  let partner: Partner | null = null;
  if (!isNew) {
    const { data } = await supabase.from("partners").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    partner = data as Partner;
  }

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/partners" className="text-sm font-semibold text-link hover:underline">
            ← {dict.partners.title}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-navy">{isNew ? dict.partners.newTitle : dict.partners.editTitle}</h1>
        </div>
        {partner && profile.role === "admin" && <DeleteButton action={deletePartner} id={partner.id} dict={dict} />}
      </div>
      <div className="mt-6">
        <PartnerForm partner={partner} dict={dict} />
      </div>
    </div>
  );
}
