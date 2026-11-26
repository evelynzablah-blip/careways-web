import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ReportForm } from "@/components/admin/ReportForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { getCountryOptions } from "@/lib/admin-data";
import type { MissionReport } from "@/lib/types";
import { deleteReport } from "../actions";

export default async function EditReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const [{ data }, countries] = await Promise.all([
    supabase.from("mission_reports").select("*").eq("id", id).maybeSingle(),
    getCountryOptions(supabase, lang),
  ]);
  if (!data) notFound();
  const report = data as MissionReport;

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/reports" className="text-sm font-semibold text-link hover:underline">
            ← {dict.reports.title}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-navy">{dict.reports.editTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          {report.status === "published" && (
            <a href={`/${lang}/newsletters/${report.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-link hover:underline">
              {dict.nav.viewSite} ↗
            </a>
          )}
          {profile.role === "admin" && <DeleteButton action={deleteReport} id={report.id} dict={dict} />}
        </div>
      </div>
      <div className="mt-6">
        <ReportForm report={report} dict={dict} lang={lang} countries={countries} defaultSeries="" />
      </div>
    </div>
  );
}
