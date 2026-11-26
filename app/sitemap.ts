import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getMapLocations, getPublishedPosts, getReports } from "@/lib/data";
import { siteUrl } from "@/lib/env";

export const revalidate = 3600;

const staticPaths = [
  "",
  "/about",
  "/what-we-do",
  "/how-we-do-it",
  "/the-need",
  "/team",
  "/missions",
  "/blog",
  "/newsletters",
  "/contact",
  "/donate",
  "/privacy-policy",
  "/terms-of-service",
  "/disclaimer",
  "/cookie-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, reports, locations] = await Promise.all([getPublishedPosts(), getReports(), getMapLocations()]);

  const entries: Array<{ path: string; lastModified?: string }> = [
    ...staticPaths.map((path) => ({ path })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: p.updated_at })),
    ...reports.map((r) => ({ path: `/newsletters/${r.slug}`, lastModified: r.updated_at })),
    ...locations.map((l) => ({ path: `/missions/${l.slug}` })),
  ];

  return entries.flatMap(({ path, lastModified }) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
      },
    })),
  );
}
