import Link from "next/link";
import { ReportForm } from "@/components/admin/ReportForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { getCountryOptions } from "@/lib/admin-data";

export default async function NewReport() {
  const { supabase } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const countries = await getCountryOptions(supabase, lang);

  return (
    <div className="max-w-6xl">
      <Link href="/admin/reports" className="text-sm font-semibold text-link hover:underline">
        ← {dict.reports.title}
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold text-navy">{dict.reports.newTitle}</h1>
      <ReportForm report={null} dict={dict} lang={lang} countries={countries} defaultSeries="" />
    </div>
  );
}
