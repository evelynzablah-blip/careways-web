import { getTranslations, setRequestLocale } from "next-intl/server";
import { PolicyPage } from "@/components/site/PolicyPage";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return pageMetadata({ locale, path: "/privacy-policy", title: t("privacy") });
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("footer");
  return <PolicyPage policy="privacy" title={t("privacy")} locale={locale} />;
}
