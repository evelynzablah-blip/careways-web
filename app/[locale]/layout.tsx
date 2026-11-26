import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { MotionProvider } from "@/components/premium/motion";
import { getSettings } from "@/lib/data";
import { isIndexable, siteUrl } from "@/lib/env";
import "../globals.css";

// Design system fonts (platform layout.tsx): Public Sans for UI, body and figures;
// Newsreader only for marketing headlines (.cw-display).
const publicSans = Public_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-public-sans",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1F406F",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("siteName"), template: `%s | ${t("siteName")}` },
    description: t("defaultDescription"),
    openGraph: {
      siteName: t("siteName"),
      type: "website",
      locale: locale === "es" ? "es_419" : "en_US",
      images: [{ url: "/images/site/surgery-team.png", width: 500, height: 500, alt: t("siteName") }],
    },
    twitter: { card: "summary", title: t("siteName"), description: t("defaultDescription") },
    applicationName: t("siteName"),
    formatDetection: { telephone: false, address: false, email: false },
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [settings, t] = await Promise.all([getSettings(), getTranslations("nav")]);

  return (
    <html lang={locale} className={`${publicSans.variable} ${newsreader.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
          >
            {t("skip")}
          </a>
          <MotionProvider>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer settings={settings} />
          </MotionProvider>
        </NextIntlClientProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "NGO",
            "@id": `${siteUrl}/#organization`,
            name: "CareWays Collaborative",
            description:
              "CareWays Collaborative works to measurably improve outcomes for pediatric patients and their families in under-resourced countries around the world.",
            legalName: "CareWays Collaborative, Inc.",
            url: siteUrl,
            logo: `${siteUrl}/images/site/logo-full-color.png`,
            foundingDate: "2021-05",
            nonprofitStatus: "Nonprofit501c3",
            address: {
              "@type": "PostalAddress",
              postOfficeBoxNumber: "313",
              streetAddress: "277 Boston Post Road",
              addressLocality: "Wayland",
              addressRegion: "MA",
              postalCode: "01778",
              addressCountry: "US",
            },
            sameAs: [settings.facebook_url, settings.instagram_url, settings.youtube_url].filter(Boolean),
          }}
        />
      </body>
    </html>
  );
}
