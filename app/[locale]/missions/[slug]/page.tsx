import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostCard, ReportCard } from "@/components/site/cards";
import { ButtonLink, Container, ExternalButton, PageHeader, Section } from "@/components/site/ui";
import { routing } from "@/i18n/routing";
import { getMapLocationBySlug, getMapLocations, getRelatedForCountry } from "@/lib/data";
import { localized } from "@/lib/localize";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const locations = await getMapLocations();
  return routing.locales.flatMap((locale) => locations.map((l) => ({ locale, slug: l.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const loc = await getMapLocationBySlug(slug);
  if (!loc) return {};
  const country = locale === "es" ? loc.country_es : loc.country_en;
  return pageMetadata({ locale, path: `/missions/${slug}`, title: `${country} — ${loc.hospital_name}` });
}

export default async function MissionCountryPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = await getMapLocationBySlug(slug);
  if (!loc) notFound();

  const t = await getTranslations("missions");
  const nav = await getTranslations("nav");
  const { reports, posts } = await getRelatedForCountry(loc.country_code);
  const country = locale === "es" ? loc.country_es : loc.country_en;
  const summary = localized(loc, "summary", locale).value;

  return (
    <>
      <PageHeader eyebrow={`${nav("missions")} · ${t("hospital")}`} title={country} lead={loc.hospital_name}>
        {loc.url && (
          <ExternalButton href={loc.url} target="_blank" rel="noopener noreferrer" variant="primary">
            {t("visitHospital")} ↗
          </ExternalButton>
        )}
        <ButtonLink href="/missions" variant="outline">
          ← {nav("missions")}
        </ButtonLink>
      </PageHeader>
      {summary && (
        <Container>
          <p className="max-w-3xl text-lg leading-relaxed text-ink">{summary}</p>
        </Container>
      )}

      <Section className="pt-4" labelledBy="country-reports">
        <Container>
          <h2 id="country-reports" className="text-2xl font-extrabold text-navy">
            {t("reportsFor")}
          </h2>
          {reports.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <ReportCard key={r.id} report={r} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-muted">{t("noRelated")}</p>
          )}

          {posts.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-extrabold text-navy">{t("postsFor")}</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} locale={locale} />
                ))}
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
