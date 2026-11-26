import { getTranslations, setRequestLocale } from "next-intl/server";
import { ButtonLink, Container, PageHeader, Section, StatCard } from "@/components/site/ui";
import { getCopy } from "@/content/site/copy";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({ locale, path: "/the-need", title: t("theNeed"), description: getCopy(locale as Locale).theNeed.lead });
}

function Quote({ text, by }: { text: string; by: string }) {
  return (
    <figure className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-10">
      <blockquote className="text-xl font-medium leading-relaxed text-navy sm:text-2xl">“{text}”</blockquote>
      <figcaption className="mt-5 font-semibold text-teal-700">— {by}</figcaption>
    </figure>
  );
}

export default async function TheNeedPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const copy = getCopy(locale).theNeed;

  return (
    <>
      <PageHeader eyebrow={nav("theNeed")} title={copy.lead} />

      <Section tone="navy" className="py-14">
        <Container className="grid gap-5 md:grid-cols-3">
          {copy.stats.map((s) => (
            <StatCard key={s.value} value={s.value} label={s.label} tone="navy" />
          ))}
        </Container>
      </Section>

      <Section tone="sky">
        <Container className="max-w-4xl">
          <Quote {...copy.quote1} />
        </Container>
      </Section>

      <Section labelledBy="gap-title">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="gap-title" className="text-3xl font-extrabold text-navy sm:text-4xl">
              {copy.gapTitle}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink">
              {copy.gap.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {copy.gapStats.map((s) => (
              <StatCard key={s.value} value={s.value} label={s.label} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container className="max-w-4xl space-y-10">
          <Quote {...copy.quote2} />
          <div className="space-y-4 text-lg leading-relaxed text-ink">
            {copy.closing.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="text-2xl font-extrabold text-navy">{copy.closingStrong}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/how-we-do-it" variant="primary">
              {nav("howWeDoIt")} →
            </ButtonLink>
            <ButtonLink href="/donate" variant="donate">
              {nav("donate")}
            </ButtonLink>
          </div>
          <aside aria-labelledby="sources-title" className="border-t border-line pt-6">
            <h2 id="sources-title" className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {copy.sourcesTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {copy.sources.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </aside>
        </Container>
      </Section>
    </>
  );
}
