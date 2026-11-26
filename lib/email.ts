import "server-only";

/**
 * Sends a plain-text email through Resend (https://resend.com) when
 * RESEND_API_KEY is set. Returns false if email is not configured or fails.
 * CONTACT_FROM_EMAIL must use a domain verified in Resend (e.g.
 * "CareWays website <website@careways.world>").
 */
export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject, text, reply_to: replyTo }),
    });
    if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("[email] send failed", error);
    return false;
  }
}
