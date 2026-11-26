import type { Locale } from "./types";

type Localizable = object;

/**
 * Returns `obj[field_<locale>]`, falling back to English when the Spanish
 * version is empty. `fallback` tells the UI to show an "available in English" note.
 */
export function localized<T extends Localizable>(
  obj: T,
  field: string,
  locale: Locale,
): { value: string; fallback: boolean } {
  const record = obj as Record<string, unknown>;
  const wanted = record[`${field}_${locale}`];
  if (typeof wanted === "string" && wanted.trim()) return { value: wanted, fallback: false };
  const en = record[`${field}_en`];
  return { value: typeof en === "string" ? en : "", fallback: locale !== "en" };
}

export function t<T extends Localizable>(obj: T, field: string, locale: Locale): string {
  return localized(obj, field, locale).value;
}

export function localizedList<T extends Localizable>(obj: T, field: string, locale: Locale): string[] {
  const record = obj as Record<string, unknown>;
  const wanted = record[`${field}_${locale}`];
  if (Array.isArray(wanted) && wanted.length) return wanted as string[];
  const en = record[`${field}_en`];
  return Array.isArray(en) ? (en as string[]) : [];
}

export function formatDate(iso: string | null | undefined, locale: Locale, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return "";
  // Dates without a time are stored as YYYY-MM-DD; parse as UTC noon to avoid off-by-one.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return new Intl.DateTimeFormat(locale === "es" ? "es" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(d);
}

export const countryNames: Record<string, { en: string; es: string }> = {
  SV: { en: "El Salvador", es: "El Salvador" },
  DO: { en: "Dominican Republic", es: "República Dominicana" },
  GT: { en: "Guatemala", es: "Guatemala" },
  CO: { en: "Colombia", es: "Colombia" },
  EC: { en: "Ecuador", es: "Ecuador" },
  US: { en: "United States", es: "Estados Unidos" },
};

export function countryName(code: string, locale: Locale) {
  return countryNames[code]?.[locale] ?? code;
}
