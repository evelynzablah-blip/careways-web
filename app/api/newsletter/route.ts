import { NextResponse } from "next/server";
import { z } from "zod";
import { isConstantContactConfigured, subscribeToConstantContact } from "@/lib/constant-contact";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { getServiceClient } from "@/lib/supabase/admin";

const schema = z.object({
  email: z.string().trim().email().max(254),
  firstName: z.string().trim().max(100).optional().default(""),
  locale: z.enum(["en", "es"]).optional().default("en"),
  source: z.string().max(40).optional().default("footer"),
  website: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { email, firstName, locale, source, website } = parsed.data;

  // Bots fill the hidden field; answer OK and drop it.
  if (website) return NextResponse.json({ ok: true });
  if (rateLimited(`nl:${clientIp(request.headers)}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const db = getServiceClient();
  const ccConfigured = isConstantContactConfigured();
  if (!db && !ccConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // Always keep a log first so no subscriber is lost if the provider fails.
  let rowId: string | null = null;
  if (db) {
    const { data, error } = await db
      .from("newsletter_signups")
      .insert({ email, first_name: firstName || null, locale, source, status: ccConfigured ? "pending" : "stored" })
      .select("id")
      .single();
    if (error) console.error("[newsletter] log insert failed", error);
    rowId = data?.id ?? null;
  }

  if (ccConfigured) {
    try {
      await subscribeToConstantContact(email, firstName);
      if (db && rowId) await db.from("newsletter_signups").update({ status: "synced" }).eq("id", rowId);
    } catch (error) {
      console.error("[newsletter] Constant Contact failed", error);
      if (db && rowId) {
        await db.from("newsletter_signups").update({ status: "failed", error: String(error).slice(0, 500) }).eq("id", rowId);
      } else {
        return NextResponse.json({ error: "provider_failed" }, { status: 502 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
