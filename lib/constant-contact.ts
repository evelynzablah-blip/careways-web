import "server-only";
import { getServiceClient } from "@/lib/supabase/admin";

/**
 * Constant Contact v3 integration for newsletter sign-ups.
 *
 * Auth: OAuth2 refresh-token flow. Constant Contact rotates refresh tokens,
 * so the latest one is stored in the private `integration_secrets` table
 * (service role only) and CC_REFRESH_TOKEN is only the initial seed value.
 *
 * List: the current site uses the legacy list id 1431858810. v3 uses UUIDs;
 * a numeric CC_LIST_ID is translated with the list_id_xrefs endpoint.
 */
const TOKEN_URL = "https://authz.constantcontact.com/oauth2/default/v1/token";
const API = "https://api.cc.email/v3";
const SECRET_KEY = "constant_contact_refresh_token";

export function isConstantContactConfigured() {
  return Boolean(process.env.CC_CLIENT_ID && process.env.CC_CLIENT_SECRET && process.env.CC_REFRESH_TOKEN && process.env.CC_LIST_ID);
}

let cachedAccess: { token: string; expiresAt: number } | null = null;
let cachedListId: string | null = null;

async function getRefreshToken(): Promise<string> {
  const db = getServiceClient();
  if (db) {
    const { data } = await db.from("integration_secrets").select("value").eq("key", SECRET_KEY).maybeSingle();
    if (data?.value) return data.value as string;
  }
  return process.env.CC_REFRESH_TOKEN!;
}

async function saveRefreshToken(token: string) {
  const db = getServiceClient();
  if (!db) return;
  await db.from("integration_secrets").upsert({ key: SECRET_KEY, value: token, updated_at: new Date().toISOString() });
}

async function getAccessToken(): Promise<string> {
  if (cachedAccess && cachedAccess.expiresAt > Date.now() + 60_000) return cachedAccess.token;
  const basic = Buffer.from(`${process.env.CC_CLIENT_ID}:${process.env.CC_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: await getRefreshToken() }),
  });
  if (!res.ok) throw new Error(`Constant Contact token refresh failed (${res.status})`);
  const json = (await res.json()) as { access_token: string; refresh_token?: string; expires_in: number };
  if (json.refresh_token) await saveRefreshToken(json.refresh_token);
  cachedAccess = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function getListId(token: string): Promise<string> {
  if (cachedListId) return cachedListId;
  const configured = process.env.CC_LIST_ID!;
  if (!/^\d+$/.test(configured)) return (cachedListId = configured);
  const res = await fetch(`${API}/contact_lists/list_id_xrefs?sequence_ids=${configured}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Constant Contact list lookup failed (${res.status})`);
  const json = (await res.json()) as { xrefs?: Array<{ sequence_id: string; list_id: string }> };
  const id = json.xrefs?.[0]?.list_id;
  if (!id) throw new Error(`Constant Contact list ${configured} not found`);
  return (cachedListId = id);
}

export async function subscribeToConstantContact(email: string, firstName?: string) {
  const token = await getAccessToken();
  const listId = await getListId(token);
  const res = await fetch(`${API}/contacts/sign_up_form`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email_address: email,
      first_name: firstName || undefined,
      list_memberships: [listId],
    }),
  });
  if (!res.ok) throw new Error(`Constant Contact sign-up failed (${res.status}): ${await res.text()}`);
}
