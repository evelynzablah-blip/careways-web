import { getTranslations, setRequestLocale } from "next-intl/server";
import { ButtonLink, Container, PageHeader, Section, SideIndex } from "@/components/site/ui";
import { getCopy } from "@/content/site/copy";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({ locale, path: "/what-we-do", title: t("whatWeDo"), description: getCopy(locale as Locale).whatWeDo.lead });
}

export default async function WhatWeDoPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");
  const copy = getCopy(locale).whatWeDo;

  return (
    <>
      <PageHeader eyebrow={nav("whatWeDo")} title={copy.lead} lead={copy.intro} />

      {/* Overview cards: one line per area, jump to details */}
      <Section className="pt-4 sm:pt-6">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {copy.areas.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`} className="block h-full rounded-2xl bg-paper p-5 ring-1 ring-line transition-colors hover:bg-sky-50">
                  <p className="text-lg font-bold text-navy">{a.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.summary}</p>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="white" className="pt-0">
        <Container className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside>
            <SideIndex
              title={common("onThisPage")}
              items={[...copy.areas.map((a) => ({ id: a.id, label: a.title })), { id: "outcomes", label: copy.outcomesTitle }]}
            />
          </aside>
          <div className="space-y-16">
            {copy.areas.map((a) => (
              <section key={a.id} id={a.id} aria-labelledby={`${a.id}-title`} className="border-t border-line pt-10 first:border-0 first:pt-0">
                <h2 id={`${a.id}-title`} className="text-3xl font-extrabold text-navy">
                  {a.title}
                </h2>
                <p className="mt-3 text-xl leading-relaxed text-teal-700">{a.summary}</p>
                <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-ink">
                  {a.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {a.list && <Bullets items={a.list} />}
                  {a.listIntro2 && <p>{a.listIntro2}</p>}
                  {a.list2 && <Bullets items={a.list2} />}
                  {a.after?.map((p, i) => <p key={`after-${i}`}>{p}</p>)}
                </div>
              </section>
            ))}

            <section id="outcomes" aria-labelledby="outcomes-title" className="rounded-[var(--radius-card)] bg-navy p-8 text-white sm:p-10">
              <h2 id="outcomes-title" className="text-3xl font-extrabold">
                {copy.outcomesTitle}
              </h2>
              <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {copy.outcomes.map((o) => (
                  <div key={o.label} className="flex flex-col">
                    <dt className="order-2 mt-1 text-sm font-medium uppercase tracking-wide text-white/80">{o.label}</dt>
                    <dd className="order-1 text-4xl font-extrabold text-sun">{o.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/how-we-do-it" variant="primary">
                {nav("howWeDoIt")} →
              </ButtonLink>
              <ButtonLink href="/missions" variant="outline">
                {nav("missions")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl bg-sky-50 px-4 py-3 text-base">
          <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
