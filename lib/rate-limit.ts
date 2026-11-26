/**
 * Best-effort in-memory rate limiter for public form endpoints. On Vercel each
 * serverless instance has its own memory, so this only slows down bursts; the
 * honeypot and time-trap do most of the spam filtering.
 */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
