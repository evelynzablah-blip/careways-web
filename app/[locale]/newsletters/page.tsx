import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReportCard } from "@/components/site/cards";
import { Container, PageHeader, Section, cx } from "@/components/site/ui";
import { Link } from "@/i18n/navigation";
import { getReports } from "@/lib/data";
import { countryName, formatDate, localized } from "@/lib/localize";
import { pageMetadata } from "@/lib/seo";
import { reportPdfUrl } from "@/lib/storage";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsletters" });
  return pageMetadata({ locale, path: "/newsletters", title: t("title"), description: t("intro") });
}

export default async function NewslettersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ year?: string; country?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("newsletters");
  const common = await getTranslations("common");
  const all = await getReports();

  const years = [...new Set(all.map((r) => r.report_date.slice(0, 4)))].sort().reverse();
  const countries = [...new Set(all.flatMap((r) => r.country_codes ?? []))].sort((a, b) =>
    countryName(a, locale).localeCompare(countryName(b, locale)),
  );
  const reports = all.filter(
    (r) => (!sp.year || r.report_date.startsWith(sp.year)) && (!sp.country || r.country_codes?.includes(sp.country)),
  );

  const href = (patch: { year?: string; country?: string }) => {
    const next = { year: sp.year, country: sp.country, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/newsletters?${qs}` : "/newsletters";
  };

  const chip = (active: boolean) =>
    cx(
      "rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition-colors",
      active ? "bg-navy text-white ring-navy" : "bg-white text-navy ring-line hover:bg-sky-50",
    );

  return (
    <>
      <PageHeader eyebrow="CareWays" title={t("title")} lead={t("intro")} />

      <Section className="pt-2">
        <Container>
          <div className="space-y-4 rounded-[var(--radius-card)] bg-paper p-5 ring-1 ring-line">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("year")}>
              <span className="mr-2 w-16 text-sm font-semibold text-muted">{t("year")}</span>
              <Link href={href({ year: undefined })} className={chip(!sp.year)} aria-current={!sp.year ? "true" : undefined}>
                {t("all")}
              </Link>
              {years.map((y) => (
                <Link key={y} href={href({ year: y })} className={chip(sp.year === y)} aria-current={sp.year === y ? "true" : undefined}>
                  {y}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("country")}>
              <span className="mr-2 w-16 text-sm font-semibold text-muted">{t("country")}</span>
              <Link href={href({ country: undefined })} className={chip(!sp.country)} aria-current={!sp.country ? "true" : undefined}>
                {t("all")}
              </Link>
              {countries.map((c) => (
                <Link key={c} href={href({ country: c })} className={chip(sp.country === c)} aria-current={sp.country === c ? "true" : undefined}>
                  {countryName(c, locale)}
                </Link>
              ))}
            </div>
          </div>

          {reports.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <ReportCard key={r.id} report={r} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-[var(--radius-card)] bg-sky-50 p-10 text-center text-lg text-navy">{t("empty")}</p>
          )}
        </Container>
      </Section>

      {/* Compact, scannable PDF archive */}
      <Section id="archive" tone="paper" labelledBy="archive-title">
        <Container>
          <h2 id="archive-title" className="text-2xl font-extrabold text-navy">
            {t("archiveTitle")}
          </h2>
          <p className="mt-2 max-w-3xl text-muted">{t("archiveNote")}</p>
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-sky-50 text-sm text-navy">
                <tr>
                  <th scope="col" className="px-4 py-3">{t("series")}</th>
                  <th scope="col" className="px-4 py-3">{t("date")}</th>
                  <th scope="col" className="px-4 py-3">{t("countries")}</th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">PDF</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {all.map((r) => {
                  const pdf = reportPdfUrl(r);
                  const title = localized(r, "title", locale).value;
                  return (
                    <tr key={r.id}>
                      <th scope="row" className="px-4 py-3 font-semibold text-navy">
                        <Link href={`/newsletters/${r.slug}`} className="hover:underline">
                          {title}
                        </Link>
                        {r.series && <span className="block text-xs font-normal text-muted">{r.series}</span>}
                      </th>
                      <td className="px-4 py-3 text-muted">{formatDate(r.report_date, locale)}</td>
                      <td className="px-4 py-3 text-muted">{r.country_codes?.map((c) => countryName(c, locale)).join(", ")}</td>
                      <td className="px-4 py-3 text-right">
                        {pdf ? (
                          <a href={pdf} target="_blank" rel="noopener noreferrer" className="font-semibold text-link hover:underline">
                            {common("downloadPdf")}
                            <span className="sr-only"> — {title}</span>
                          </a>
                        ) : (
                          <span className="text-sm text-muted">{t("pdfMissing")}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>
    </>
  );
}
