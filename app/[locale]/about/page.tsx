import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapExplorer } from "@/components/map/MapExplorer";
import { TeamCard } from "@/components/site/cards";
import { ButtonLink, Container, Eyebrow, Section } from "@/components/site/ui";
import { mapCenter } from "@/content/seed/map";
import { getCopy } from "@/content/site/copy";
import { getTeam } from "@/lib/data";
import { getMapExplorerData } from "@/lib/map-data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: "/about", title: t("title"), description: getCopy(locale as Locale).about.definition });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const copy = getCopy(locale).about;
  const [team, map] = await Promise.all([getTeam(), getMapExplorerData(locale)]);

  return (
    <>
      {/* 1. Definition + mission + shortcuts, all above the fold */}
      <header className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mint/70 blur-3xl" />
        <Container className="relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <Eyebrow>{t("title")}</Eyebrow>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">CareWays Collaborative</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">{copy.definition}</p>
            <nav aria-label={t("title")} className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/team" variant="primary">
                {t("meetTeam")}
              </ButtonLink>
              <a href="#partners" className="inline-flex items-center rounded-full border-2 border-navy px-5 py-2.5 font-semibold text-navy hover:bg-navy hover:text-white">
                {t("seeMap")}
              </a>
              <ButtonLink href="/what-we-do" variant="ghost">
                {t("whatWeDo")} →
              </ButtonLink>
            </nav>
          </div>
          <div className="rounded-[var(--radius-card)] bg-navy p-8 text-white shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal">{t("missionLabel")}</p>
            <p className="mt-3 text-2xl font-semibold leading-snug">{copy.mission}</p>
          </div>
        </Container>
      </header>

      {/* 2. Facts at a glance */}
      <Section labelledBy="facts-title" className="pt-6 sm:pt-10">
        <Container>
          <h2 id="facts-title" className="sr-only">
            {t("factsTitle")}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.facts.map((f) => (
              <li key={f.title} className="rounded-2xl bg-paper p-6 ring-1 ring-line">
                <p className="text-lg font-bold text-navy">{f.title}</p>
                <p className="mt-1.5 text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3. Partners map */}
      <Section id="partners" tone="sky" labelledBy="partners-title">
        <Container>
          <h2 id="partners-title" className="text-3xl font-extrabold text-navy sm:text-4xl">
            {t("partnersTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-muted">{copy.partnersIntro}</p>
          <div className="mt-8">
            <MapExplorer locations={map.locations} related={map.related} center={mapCenter} />
          </div>
        </Container>
      </Section>

      {/* 4. Founding story — optional reading, broken into short sections */}
      <Section id="story" labelledBy="story-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="story-title" className="text-3xl font-extrabold text-navy sm:text-4xl">
              {t("storyTitle")}
            </h2>
            <Image src="/images/site/blue-hat-baby.jpg" alt="" width={500} height={500} className="mt-6 hidden rounded-[2rem] lg:block" />
          </div>
          <div className="space-y-10">
            {copy.story.map((s) => (
              <section key={s.id} aria-labelledby={`story-${s.id}`}>
                <h3 id={`story-${s.id}`} className="text-xl font-bold text-navy">
                  {s.title}
                </h3>
                <div className="mt-3 space-y-4 text-lg leading-relaxed text-ink">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Team strip */}
      <Section id="team" tone="paper" labelledBy="team-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="team-title" className="text-3xl font-extrabold text-navy sm:text-4xl">
              {t("teamTitle")}
            </h2>
            <ButtonLink href="/team" variant="outline">
              {t("teamCta")}
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.slice(0, 3).map((m) => (
              <TeamCard key={m.id} member={m} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
