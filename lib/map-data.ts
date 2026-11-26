import "server-only";
import { getMapLocations, getPublishedPosts, getReports } from "@/lib/data";
import { formatDate, localized } from "@/lib/localize";
import type { Locale } from "@/lib/types";
import type { RelatedSummary } from "@/components/map/MapExplorer";

/** Map pins plus a per-country summary of related reports/posts for the map cards. */
export async function getMapExplorerData(locale: Locale) {
  const [locations, reports, posts] = await Promise.all([getMapLocations(), getReports(), getPublishedPosts()]);
  const related: Record<string, RelatedSummary> = {};
  for (const loc of locations) {
    related[loc.country_code] = {
      reports: reports
        .filter((r) => r.country_codes?.includes(loc.country_code))
        .map((r) => ({
          slug: r.slug,
          title: localized(r, "title", locale).value,
          date: formatDate(r.report_date, locale, { month: "short", day: undefined }),
        })),
      postCount: posts.filter((p) => p.country_codes?.includes(loc.country_code)).length,
    };
  }
  return { locations, related };
}
