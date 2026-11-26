import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/site/ContactForm";
import { Container, PageHeader, Section } from "@/components/site/ui";
import { getCopy } from "@/content/site/copy";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/contact", title: t("title"), description: getCopy(locale as Locale).contact.cta });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ reason?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { reason } = await searchParams;
  const t = await getTranslations("contact");
  const copy = getCopy(locale).contact;

  return (
    <>
      <PageHeader eyebrow={t("title")} title={copy.title} lead={copy.cta} />
      <Section className="pt-2">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <ul className="space-y-3">
            {copy.questions.map((q) => (
              <li key={q} className="rounded-2xl bg-sky-50 px-5 py-4 text-lg font-medium text-navy">
                {q}
              </li>
            ))}
          </ul>
          <div id="form" className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
            <h2 className="text-2xl font-extrabold text-navy">{t("formTitle")}</h2>
            <p className="mt-1 text-sm text-muted">{copy.noSolicitations}</p>
            <div className="mt-6">
              <ContactForm defaultReason={reason} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
