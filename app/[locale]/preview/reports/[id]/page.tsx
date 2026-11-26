import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReportView } from "@/components/site/ReportView";
import { getServerClient } from "@/lib/supabase/server";
import type { Locale, MissionReport } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ReportPreview({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const supabase = await getServerClient();
  if (!supabase) notFound();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/admin/login?next=/admin/reports/${id}`);

  const { data } = await supabase.from("mission_reports").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const t = await getTranslations("preview");

  return (
    <>
      <p className="sticky top-20 z-40 bg-sun px-4 py-2 text-center font-semibold text-navy-900">{t("banner")}</p>
      <ReportView report={data as MissionReport} locale={locale} />
    </>
  );
}
