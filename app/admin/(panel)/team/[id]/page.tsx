import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { TeamForm } from "@/components/admin/TeamForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import type { TeamMember } from "@/lib/types";
import { deleteTeamMember } from "../actions";

export default async function EditTeamMember({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireStaff();
  const { dict } = await getAdminContext();
  const isNew = id === "new";
  let member: TeamMember | null = null;
  if (!isNew) {
    const { data } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    member = data as TeamMember;
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/team" className="text-sm font-semibold text-link hover:underline">
            ← {dict.team.title}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-navy">{isNew ? dict.team.newTitle : dict.team.editTitle}</h1>
        </div>
        {member && profile.role === "admin" && <DeleteButton action={deleteTeamMember} id={member.id} dict={dict} />}
      </div>
      <div className="mt-6">
        <TeamForm member={member} dict={dict} />
      </div>
    </div>
  );
}
