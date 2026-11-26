import { getTranslations, setRequestLocale } from "next-intl/server";
import { TeamCard } from "@/components/site/cards";
import { Container, PageHeader, Section } from "@/components/site/ui";
import { getTeam } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return pageMetadata({ locale, path: "/team", title: t("title"), description: t("intro") });
}

export default async function TeamPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const team = await getTeam();

  return (
    <>
      <PageHeader eyebrow="CareWays Collaborative" title={t("title")} lead={t("intro")} />
      <Section className="pt-4">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <TeamCard key={m.id} member={m} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
