import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, ExternalButton, PageHeader, Section } from "@/components/site/ui";
import { YouTubeEmbed } from "@/components/site/YouTubeEmbed";
import { supplyDonationPdf } from "@/content/seed/settings";
import { getCopy } from "@/content/site/copy";
import { getSettings, getSponsors } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { documentUrl, mediaUrl } from "@/lib/storage";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  return pageMetadata({ locale, path: "/donate", title: t("title"), description: getCopy(locale as Locale).donate.lead });
}

export default async function DonatePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("donate");
  const copy = getCopy(locale).donate;
  const [settings, sponsors] = await Promise.all([getSettings(), getSponsors()]);
  const supplyPdf = documentUrl(supplyDonationPdf.path) ?? supplyDonationPdf.source_url;

  return (
    <>
      <PageHeader eyebrow={t("title")} title={copy.lead}>
        {settings.givewp_url && (
          <ExternalButton href={settings.givewp_url} target="_blank" rel="noopener noreferrer" variant="donate" className="px-8 py-3 text-lg">
            {t("onlineButton")} <span className="sr-only">{t("opensNewTab")}</span>
          </ExternalButton>
        )}
      </PageHeader>

      <Section className="pt-2">
        <Container className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[var(--radius-card)] bg-navy p-8 text-white">
            <h2 className="text-2xl font-bold">{t("onlineTitle")}</h2>
            <p className="mt-2 text-white/85">{t("onlineBody")}</p>
            {settings.givewp_url && (
              <ExternalButton href={settings.givewp_url} target="_blank" rel="noopener noreferrer" variant="donate" className="mt-6">
                {t("onlineButton")} ↗ <span className="sr-only">{t("opensNewTab")}</span>
              </ExternalButton>
            )}
          </div>
          <div className="rounded-[var(--radius-card)] bg-paper p-8 ring-1 ring-line">
            <h2 className="text-2xl font-bold text-navy">{copy.mailTitle}</h2>
            <p className="mt-2 text-muted">{copy.mailIntro}</p>
            <address className="mt-4 whitespace-pre-line text-lg font-semibold not-italic text-navy">{settings.postal_address}</address>
          </div>
          <div className="rounded-[var(--radius-card)] bg-mint/60 p-8">
            <h2 className="text-2xl font-bold text-navy">{t("supplyTitle")}</h2>
            <p className="mt-2 text-ink">{t("supplyBody")}</p>
            <a href={supplyPdf} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-link underline underline-offset-4">
              {t("supplyLink")}
            </a>
          </div>
        </Container>
        <Container>
          <p className="mt-8 max-w-4xl text-sm leading-relaxed text-muted">{copy.taxNote}</p>
        </Container>
      </Section>

      <Section tone="sky" labelledBy="support-title">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="support-title" className="text-3xl font-extrabold text-navy">
              {copy.supportTitle}
            </h2>
            <ul className="mt-6 space-y-3">
              {copy.support.map((s) => (
                <li key={s} className="flex gap-3 text-lg text-ink">
                  <span aria-hidden className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-xs text-navy-900">
                    ✓
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          {settings.donate_video_id && <YouTubeEmbed id={settings.donate_video_id} title={t("videoTitle")} />}
        </Container>
      </Section>

      {sponsors.length > 0 && (
        <Section labelledBy="supporters-title">
          <Container>
            <h2 id="supporters-title" className="text-center text-xl font-bold text-navy">
              {copy.supportersTitle}
            </h2>
            <ul className="mt-8 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {sponsors.map((s) => {
                const logo = mediaUrl(s.logo_path);
                const content = logo ? (
                  <Image src={logo} alt={s.name} width={240} height={120} className="mx-auto h-16 w-auto object-contain" />
                ) : (
                  <span className="font-semibold text-navy">{s.name}</span>
                );
                return (
                  <li key={s.id} className="flex h-28 items-center justify-center rounded-2xl bg-white p-4 ring-1 ring-line">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
