import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapExplorer } from "@/components/map/MapExplorer";
import { ReportCard } from "@/components/site/cards";
import { ButtonLink, Container, PageHeader, Section } from "@/components/site/ui";
import { mapCenter } from "@/content/seed/map";
import { getReports } from "@/lib/data";
import { getMapExplorerData } from "@/lib/map-data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "missions" });
  return pageMetadata({ locale, path: "/missions", title: t("title"), description: t("intro") });
}

export default async function MissionsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("missions");
  const nav = await getTranslations("nav");
  const [map, reports] = await Promise.all([getMapExplorerData(locale), getReports()]);

  return (
    <>
      <PageHeader eyebrow={nav("missions")} title={t("title")} lead={t("intro")} />
      <Section className="pt-2">
        <Container>
          <MapExplorer locations={map.locations} related={map.related} center={mapCenter} />
        </Container>
      </Section>
      <Section tone="paper" labelledBy="reports-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="reports-title" className="text-3xl font-extrabold text-navy">
              {t("reportsFor")}
            </h2>
            <ButtonLink href="/newsletters" variant="outline">
              {nav("newsletters")}
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.slice(0, 6).map((r) => (
              <ReportCard key={r.id} report={r} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
