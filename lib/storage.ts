import { isSupabaseConfigured, storageBuckets, supabaseUrl } from "./env";
import type { MissionReport } from "./types";

/**
 * Resolves an image path to a URL. Paths starting with "/" are files in
 * /public (logos and photos migrated with the repo); anything else is an
 * object key in the public "media" Storage bucket (uploads from the admin).
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  if (!isSupabaseConfigured) return null;
  return `${supabaseUrl}/storage/v1/object/public/${storageBuckets.media}/${encodePath(path)}`;
}

export function documentUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  if (!isSupabaseConfigured) return null;
  return `${supabaseUrl}/storage/v1/object/public/${storageBuckets.documents}/${encodePath(path)}`;
}

/**
 * PDF link for a report. Served from our own Storage once the migration
 * script has run; before Supabase exists, the preview falls back to the
 * original public URL so the archive is still browsable.
 */
export function reportPdfUrl(report: Pick<MissionReport, "pdf_path" | "source_url">): string | null {
  return documentUrl(report.pdf_path) ?? report.source_url ?? null;
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}
