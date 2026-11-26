export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True once the Supabase project exists and its keys are in the environment. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Search engines may index the site only when this is explicitly enabled.
 * Keep it off on the Vercel preview URL and turn it on at the domain cutover.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

export const storageBuckets = {
  media: "media",
  documents: "documents",
} as const;
