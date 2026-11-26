import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ReportView } from "@/components/site/ReportView";
import { routing } from "@/i18n/routing";
import { getReportBySlug, getReports } from "@/lib/data";
import { localized, localizedList } from "@/lib/localize";
import { pageMetadata } from "@/lib/seo";
import { mediaUrl } from "@/lib/storage";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const reports = await getReports();
  return routing.locales.flatMap((locale) => reports.map((r) => ({ locale, slug: r.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const report = await getReportBySlug(slug);
  if (!report) return {};
  const l = locale as Locale;
  const title = [report.series, localized(report, "title", l).value].filter(Boolean).join(" — ");
  return pageMetadata({
    locale,
    path: `/newsletters/${slug}`,
    title,
    description: localized(report, "excerpt", l).value || localizedList(report, "highlights", l).join(" · "),
    image: mediaUrl(report.cover_image_path),
  });
}

export default async function ReportPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const report = await getReportBySlug(slug);
  if (!report) notFound();
  return <ReportView report={report} locale={locale} />;
}
