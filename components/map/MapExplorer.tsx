"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale, MapLocation } from "@/lib/types";
import { cx } from "@/components/site/ui";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  const t = useTranslations("missions");
  return (
    <div className="flex h-full w-full items-center justify-center bg-sky-50 text-muted" role="status">
      {t("mapLoading")}
    </div>
  );
}

export interface RelatedSummary {
  reports: Array<{ slug: string; title: string; date: string }>;
  postCount: number;
}

export function MapExplorer({
  locations,
  related,
  center,
  height = "h-[420px] lg:h-[520px]",
}: {
  locations: MapLocation[];
  related: Record<string, RelatedSummary>;
  center: { lat: number; lng: number; zoom: number };
  height?: string;
}) {
  const t = useTranslations("missions");
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState<string | null>(null);
  const current = locations.find((l) => l.slug === selected) ?? null;
  const countryLabel = (l: MapLocation) => (locale === "es" ? l.country_es : l.country_en);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)] ring-1 ring-line">
        <div className={cx("relative z-0", height)}>
          <LeafletMap
            locations={locations}
            selected={selected}
            onSelect={setSelected}
            center={center}
            label={t("mapLabel")}
            countryLabel={countryLabel}
          />
        </div>
        {current && (
          <div
            className="absolute inset-x-3 bottom-3 z-[500] rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line sm:inset-x-auto sm:left-3 sm:w-80"
            role="dialog"
            aria-labelledby="map-card-title"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-sky-50"
            >
              <span className="sr-only">{t("closeCard")}</span>
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <LocationCard location={current} related={related[current.country_code]} countryLabel={countryLabel} />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{t("listTitle")}</h3>
        <ul className="mt-3 space-y-2">
          {locations.map((loc) => {
            const count = related[loc.country_code]?.reports.length ?? 0;
            const active = loc.slug === selected;
            return (
              <li key={loc.slug}>
                <div
                  className={cx(
                    "rounded-2xl p-4 ring-1 transition-colors",
                    active ? "bg-sky-50 ring-blue" : "bg-white ring-line",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(loc.slug)}
                    aria-pressed={active}
                    className="w-full text-left"
                  >
                    <span className="block font-bold text-navy">{countryLabel(loc)}</span>
                    <span className="block text-sm text-muted">{loc.hospital_name}</span>
                  </button>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <Link href={`/missions/${loc.slug}`} className="font-semibold text-link hover:underline">
                      {t("countryPage")} <span className="text-muted">({t("related", { count })})</span>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function LocationCard({
  location,
  related,
  countryLabel,
}: {
  location: MapLocation;
  related?: RelatedSummary;
  countryLabel: (l: MapLocation) => string;
}) {
  const t = useTranslations("missions");
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">{t("hospital")}</p>
      <h3 id="map-card-title" className="mt-1 pr-8 text-lg font-bold text-navy">
        {countryLabel(location)}
      </h3>
      <p className="text-muted">{location.hospital_name}</p>
      {related && related.reports.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {related.reports.slice(0, 3).map((r) => (
            <li key={r.slug}>
              <Link href={`/newsletters/${r.slug}`} className="text-link hover:underline">
                {r.title}
              </Link>{" "}
              <span className="text-muted">· {r.date}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/missions/${location.slug}`}
          className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
        >
          {t("countryPage")}
        </Link>
        {location.url && (
          <a
            href={location.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 text-sm font-semibold text-navy ring-1 ring-line hover:bg-sky-50"
          >
            {t("visitHospital")} ↗
          </a>
        )}
      </div>
    </div>
  );
}
