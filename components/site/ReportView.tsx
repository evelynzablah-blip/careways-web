import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { countryName, formatDate, localized, localizedList } from "@/lib/localize";
import { sanitizeRichText } from "@/lib/sanitize";
import { mediaUrl, reportPdfUrl } from "@/lib/storage";
import type { Locale, MissionReport } from "@/lib/types";
import { Container, ExternalButton, FallbackNote } from "./ui";

/** Shared by the public report page and the admin preview. */
export async function ReportView({ report, locale }: { report: MissionReport; locale: Locale }) {
  const t = await getTranslations("newsletters");
  const common = await getTranslations("common");
  const title = localized(report, "title", locale);
  const body = localized(report, "body", locale);
  const excerpt = localized(report, "excerpt", locale).value;
  const highlights = localizedList(report, "highlights", locale);
  const pdf = reportPdfUrl(report);
  const img = mediaUrl(report.cover_image_path);

  return (
    <article>
      <header className="bg-gradient-to-b from-sky-50 to-white">
        <Container className="max-w-4xl py-12 sm:py-16">
          <Link href="/newsletters" className="text-sm font-semibold text-link hover:underline">
            ← {t("title")}
          </Link>
          {report.series && <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">{report.series}</p>}
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">{title.value}</h1>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-muted">
            <div>
              <dt className="sr-only">{t("date")}</dt>
              <dd>
                <time dateTime={report.report_date}>{formatDate(report.report_date, locale)}</time>
                {report.date_note && <span> · {t("dateNote")}</span>}
              </dd>
            </div>
            {report.country_codes?.length > 0 && (
              <div>
                <dt className="sr-only">{t("countries")}</dt>
                <dd>{report.country_codes.map((c) => countryName(c, locale)).join(" · ")}</dd>
              </div>
            )}
          </dl>
          {excerpt && !highlights.length && <p className="mt-5 text-xl leading-relaxed text-ink">{excerpt}</p>}
          {pdf && (
            <div className="mt-8">
              <ExternalButton href={pdf} target="_blank" rel="noopener noreferrer" variant="donate">
                {common("downloadPdf")}
              </ExternalButton>
            </div>
          )}
        </Container>
      </header>

      {img && (
        <Container className="max-w-4xl">
          <Image src={img} alt="" width={1200} height={700} priority className="aspect-[16/9] w-full rounded-[var(--radius-card)] object-cover" />
        </Container>
      )}

      <Container className="max-w-4xl py-12">
        <FallbackNote show={title.fallback || (Boolean(body.value) && body.fallback)}>{common("availableInEnglish")}</FallbackNote>

        {highlights.length > 0 && (
          <section aria-labelledby="highlights-title" className="rounded-[var(--radius-card)] bg-paper p-8 ring-1 ring-line">
            <h2 id="highlights-title" className="text-2xl font-extrabold text-navy">
              {t("inThisIssue")}
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {highlights.map((h, i) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky text-sm font-bold text-navy">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-ink">{h}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {body.value && <div className="prose-cw mt-10" dangerouslySetInnerHTML={{ __html: sanitizeRichText(body.value) }} />}

        {pdf && (
          <p className="mt-10 text-muted">
            <a href={pdf} target="_blank" rel="noopener noreferrer" className="font-semibold text-link hover:underline">
              {t("openPdf")} ↗
            </a>
          </p>
        )}
      </Container>
    </article>
  );
}
