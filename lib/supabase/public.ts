import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

let client: SupabaseClient | null = null;

/**
 * Cookie-less anonymous client for public pages. Row Level Security only lets
 * it read published content, and pages that use it can be cached (ISR).
 */
export function getPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
