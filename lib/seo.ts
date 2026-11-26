import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Canonical + hreflang alternates for a localized path such as "/about". */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: string;
  path: string;
  title?: string;
  description?: string;
  image?: string | null;
}): Metadata {
  const clean = path === "/" ? "" : path;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}${clean}`]));
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${clean}`,
      languages: { ...languages, "x-default": `/en${clean}` },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${clean}`,
      locale: locale === "es" ? "es_419" : "en_US",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    // Without this, X/Twitter cards fall back to the site-wide title and description.
    ...(title || description ? { twitter: { card: image ? "summary_large_image" : "summary", title, description } } : {}),
  };
}
