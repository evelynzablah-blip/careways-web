import "server-only";
import { cache } from "react";
import { getPublicClient } from "@/lib/supabase/public";
import type { MapLocation, MissionReport, Partner, Post, SiteSettings, TeamMember } from "@/lib/types";
import { seedTeam } from "@/content/seed/team";
import { seedMapLocations } from "@/content/seed/map";
import { seedReports } from "@/content/seed/reports";
import { seedPartners } from "@/content/seed/partners";
import { defaultSettings } from "@/content/seed/settings";

/**
 * Public read layer. When Supabase is configured, everything is read from
 * the database (RLS returns only published/visible rows). Before that, or if
 * a query fails, pages fall back to the seed content in /content/seed so the
 * preview always renders.
 */

function warn(scope: string, error: unknown) {
  console.error(`[data:${scope}]`, error);
}

export const POSTS_PER_PAGE = 9;

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const settings: SiteSettings = { ...defaultSettings };
  const db = getPublicClient();
  if (db) {
    const { data, error } = await db.from("site_settings").select("key, value");
    if (error) warn("settings", error);
    for (const row of data ?? []) {
      if (row.key in settings && typeof row.value === "string") {
        (settings as unknown as Record<string, string>)[row.key] = row.value;
      }
    }
  }
  if (process.env.GIVEWP_DONATION_URL) settings.givewp_url = process.env.GIVEWP_DONATION_URL;
  return settings;
});

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const db = getPublicClient();
  if (!db) return seedTeam.filter((m) => m.visible);
  const { data, error } = await db.from("team_members").select("*").eq("visible", true).order("sort_order");
  if (error) {
    warn("team", error);
    return seedTeam;
  }
  return data as TeamMember[];
});

export const getMapLocations = cache(async (): Promise<MapLocation[]> => {
  const db = getPublicClient();
  if (!db) return seedMapLocations.filter((m) => m.visible);
  const { data, error } = await db.from("map_locations").select("*").eq("visible", true).order("sort_order");
  if (error) {
    warn("map", error);
    return seedMapLocations;
  }
  return data as MapLocation[];
});

export async function getMapLocationBySlug(slug: string) {
  return (await getMapLocations()).find((l) => l.slug === slug) ?? null;
}

export const getSponsors = cache(async (): Promise<Partner[]> => {
  const db = getPublicClient();
  if (!db) return seedPartners.filter((p) => p.visible && p.type === "sponsor");
  const { data, error } = await db
    .from("partners")
    .select("*")
    .eq("visible", true)
    .eq("type", "sponsor")
    .order("sort_order");
  if (error) {
    warn("partners", error);
    return seedPartners;
  }
  return data as Partner[];
});

export const getReports = cache(async (): Promise<MissionReport[]> => {
  const db = getPublicClient();
  if (!db) return seedReports;
  const { data, error } = await db
    .from("mission_reports")
    .select("*")
    .eq("status", "published")
    .order("report_date", { ascending: false });
  if (error) {
    warn("reports", error);
    return seedReports;
  }
  return data as MissionReport[];
});

export async function getReportBySlug(slug: string) {
  return (await getReports()).find((r) => r.slug === slug) ?? null;
}

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const db = getPublicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    warn("posts", error);
    return [];
  }
  return data as Post[];
});

export async function getPostBySlug(slug: string) {
  return (await getPublishedPosts()).find((p) => p.slug === slug) ?? null;
}

export interface PostFilters {
  q?: string;
  category?: string;
  country?: string;
  page?: number;
}

export async function searchPosts(filters: PostFilters) {
  const all = await getPublishedPosts();
  const q = filters.q?.trim().toLowerCase();
  const filtered = all.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.country && !p.country_codes?.includes(filters.country)) return false;
    if (q) {
      const hay = [p.title_en, p.title_es, p.excerpt_en, p.excerpt_es, p.author_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const page = Math.max(1, filters.page ?? 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  return {
    posts: filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    total: filtered.length,
    page,
    totalPages,
    categories: [...new Set(all.map((p) => p.category).filter((c): c is string => Boolean(c)))].sort(),
    countries: [...new Set(all.flatMap((p) => p.country_codes ?? []))].sort(),
  };
}

export async function getRelatedForCountry(code: string) {
  const [reports, posts] = await Promise.all([getReports(), getPublishedPosts()]);
  return {
    reports: reports.filter((r) => r.country_codes?.includes(code)),
    posts: posts.filter((p) => p.country_codes?.includes(code)),
  };
}
