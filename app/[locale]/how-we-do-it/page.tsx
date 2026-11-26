import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ButtonLink, Container, PageHeader, Section, cx } from "@/components/site/ui";
import { getCopy } from "@/content/site/copy";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({ locale, path: "/how-we-do-it", title: t("howWeDoIt"), description: getCopy(locale as Locale).howWeDoIt.lead });
}

export default async function HowWeDoItPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const copy = getCopy(locale).howWeDoIt;

  return (
    <>
      <PageHeader eyebrow={nav("howWeDoIt")} title={copy.lead}>
        <nav aria-label={nav("howWeDoIt")} className="flex flex-wrap gap-2">
          {copy.sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy ring-1 ring-line hover:bg-sky-50">
              {i + 1}. {s.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <Section className="pt-6">
        <Container className="space-y-16 sm:space-y-24">
          {copy.sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={cx(i % 2 === 1 && "md:order-2")}>
                <Image src={s.image} alt="" width={500} height={500} className="mx-auto w-full max-w-sm rounded-[2rem] shadow-[var(--shadow-card)]" />
              </div>
              <div>
                <p aria-hidden className="text-5xl font-extrabold text-teal">0{i + 1}</p>
                <h2 id={`${s.id}-title`} className="mt-2 text-3xl font-extrabold text-navy">
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink">
                  {s.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
          <div className="text-center">
            <ButtonLink href="/contact" variant="primary" className="px-7 py-3 text-base">
              {copy.cta}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
