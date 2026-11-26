import { NextResponse } from "next/server";
import { z } from "zod";
import { CONTACT_REASONS } from "@/lib/contact";
import { getSettings } from "@/lib/data";
import { sendEmail } from "@/lib/email";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { getServiceClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  reason: z.enum(CONTACT_REASONS).catch("general"),
  message: z.string().trim().min(5).max(5000),
  locale: z.enum(["en", "es"]).optional().default("en"),
  website: z.string().optional(), // honeypot
  elapsedMs: z.number().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { website, elapsedMs, ...msg } = parsed.data;

  // Honeypot filled, or submitted faster than a person can type: drop silently.
  if (website || (elapsedMs !== undefined && elapsedMs < 2500)) return NextResponse.json({ ok: true });
  if (rateLimited(`contact:${clientIp(request.headers)}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const db = getServiceClient();
  let stored = false;
  if (db) {
    const { error } = await db.from("contact_messages").insert({ ...msg, phone: msg.phone || null });
    if (error) console.error("[contact] insert failed", error);
    stored = !error;
  }

  const settings = await getSettings();
  const to = process.env.CONTACT_TO_EMAIL || settings.contact_to_email;
  const emailed = await sendEmail({
    to,
    replyTo: msg.email,
    subject: `[CareWays website] ${msg.reason} — ${msg.name}`,
    text: [
      `Name: ${msg.name}`,
      `Email: ${msg.email}`,
      msg.phone ? `Phone: ${msg.phone}` : null,
      `Reason: ${msg.reason}`,
      `Language: ${msg.locale}`,
      "",
      msg.message,
    ]
      .filter((l) => l !== null)
      .join("\n"),
  });

  if (!stored && !emailed) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  return NextResponse.json({ ok: true });
}
