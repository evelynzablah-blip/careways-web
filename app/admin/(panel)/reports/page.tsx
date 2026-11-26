import Link from "next/link";
import { StatusBadge } from "@/components/admin/fields";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { formatAdminDate } from "@/lib/admin-data";
import type { MissionReport } from "@/lib/types";

export default async function ReportsList() {
  const { supabase } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const { data } = await supabase
    .from("mission_reports")
    .select("id, slug, title_en, series, issue_number, report_date, status, pdf_path, country_codes")
    .order("report_date", { ascending: false });
  const reports = (data ?? []) as MissionReport[];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-navy">{dict.reports.title}</h1>
        <Link href="/admin/reports/new" className="rounded-full bg-sun px-5 py-2.5 font-semibold text-navy-900 hover:bg-sun-500">
          + {dict.reports.newTitle}
        </Link>
      </div>
      {reports.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-muted ring-1 ring-line">{dict.common.empty}</p>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {reports.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/reports/${r.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-sky-50">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-navy">
                    {r.title_en}
                    {r.series && <span className="font-normal text-muted"> · {r.series}</span>}
                  </span>
                  <span className="block text-sm text-muted">
                    {formatAdminDate(r.report_date, lang)} · {r.country_codes.join(", ") || "—"} · {r.pdf_path ? "PDF ✓" : "PDF —"}
                  </span>
                </span>
                <StatusBadge status={r.status} dict={dict} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
