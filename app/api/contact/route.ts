import { createHash } from "node:crypto";
import { CONTACT_BODY_LIMIT, contactEmailText, validateContact } from "../../../lib/contact";

export const runtime = "nodejs";
const WINDOW_SECONDS = 600;
const REQUEST_LIMIT = 5;
const localLimits = new Map<string, { count: number; expires: number }>();

function reply(status: number, message: string, errors?: Record<string, string>) {
  return Response.json({ message, ...(errors ? { errors } : {}) }, {
    status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": String(WINDOW_SECONDS) } : {}) },
  });
}

function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    const allowed = new Set([requestUrl.origin]);
    if (process.env.NEXT_PUBLIC_SITE_URL) allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    if (allowed.has(origin)) return true;
    // Next may normalize the local request URL to localhost while the browser
    // opens 127.0.0.1. Only equivalent loopback origins may use this exception.
    const loopbacks = new Set(["localhost", "127.0.0.1", "[::1]"]);
    return originUrl.origin === origin && loopbacks.has(requestUrl.hostname)
      && loopbacks.has(originUrl.hostname) && requestUrl.protocol === originUrl.protocol
      && requestUrl.port === originUrl.port;
  } catch { return false; }
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get("content-length"));
  if (length > CONTACT_BODY_LIMIT) throw new Error("oversize");
  if (!request.body) throw new Error("invalid-json");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > CONTACT_BODY_LIMIT) { await reader.cancel(); throw new Error("oversize"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const joined = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(joined));
}

async function withinRateLimit(request: Request, production: boolean) {
  // Forwarding headers must be overwritten by the trusted deployment proxy.
  const ip = (request.headers.get(process.env.VERCEL ? "x-vercel-forwarded-for" : "x-forwarded-for") || "unknown").split(",")[0].trim();
  const key = `cahead:contact:${createHash("sha256").update(ip).digest("hex")}`;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    if (new URL(url).protocol !== "https:") throw new Error("limiter-config");
    const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
    const response = await fetch(url, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", script, "1", key, String(WINDOW_SECONDS)]),
      signal: AbortSignal.timeout(5000), cache: "no-store",
    });
    if (!response.ok) throw new Error("limiter-unavailable");
    const result = await response.json() as { result?: unknown; error?: unknown };
    if (result.error || typeof result.result !== "number") throw new Error("limiter-unavailable");
    return result.result <= REQUEST_LIMIT;
  }
  if (production) throw new Error("limiter-config");
  const now = Date.now();
  for (const [entryKey, entry] of localLimits) if (entry.expires <= now) localLimits.delete(entryKey);
  if (localLimits.size >= 10000 && !localLimits.has(key)) return false;
  const entry = localLimits.get(key) ?? { count: 0, expires: now + WINDOW_SECONDS * 1000 };
  entry.count += 1;
  localLimits.set(key, entry);
  return entry.count <= REQUEST_LIMIT;
}

export async function POST(request: Request) {
  if (!validOrigin(request)) return reply(403, "This submission must come from the CAhead website.");
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply(415, "Please submit this form as JSON.");
  }
  const production = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";
  if (production && ["RESEND_API_KEY", "CONTACT_FROM", "CONTACT_TO", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "TURNSTILE_SECRET_KEY"].some((name) => !process.env[name]?.trim())) {
    return reply(503, "The inquiry form is not connected yet. Your message has not been sent.");
  }
  try {
    if (!await withinRateLimit(request, production)) return reply(429, "Too many attempts. Please try again in 10 minutes.");
  } catch { return reply(503, "The inquiry form is temporarily unavailable. Please try again later."); }
  let body: unknown;
  try { body = await readBoundedJson(request); }
  catch (error) {
    return error instanceof Error && error.message === "oversize"
      ? reply(413, "Your message is too large. Please shorten it and try again.")
      : reply(400, "We could not read this submission. Please refresh the page and try again.");
  }
  const validated = validateContact(body);
  if (!validated.success) return reply(400, validated.message, validated.errors);
  const data = validated.data;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (production && !secret) return reply(503, "The inquiry form is not configured yet. Please try again later.");
  if (secret) {
    if (!data.turnstileToken) return reply(400, "Please complete the security check.", { turnstileToken: "Complete the security check." });
    try {
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST", body: new URLSearchParams({ secret, response: data.turnstileToken }),
        signal: AbortSignal.timeout(8000), cache: "no-store",
      });
      const result = await verification.json() as { success?: boolean; hostname?: string };
      const allowedHosts = new Set([new URL(request.url).hostname]);
      if (process.env.NEXT_PUBLIC_SITE_URL) allowedHosts.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname);
      if (!verification.ok || !result.success || !result.hostname || !allowedHosts.has(result.hostname)) {
        return reply(400, "Security verification failed. Please try the check again.", { turnstileToken: "Please try the security check again." });
      }
    } catch { return reply(503, "Security verification is temporarily unavailable. Please try again later."); }
  }
  const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) return reply(503, "The inquiry form is not connected yet. Your message has not been sent.");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: CONTACT_FROM, to: [CONTACT_TO], reply_to: data.email,
        subject: "New CAhead website inquiry", text: contactEmailText(data) }),
      signal: AbortSignal.timeout(10000), cache: "no-store",
    });
    if (!response.ok) return reply(502, "We could not send your inquiry. Please try again later.");
    const result = await response.json() as { id?: unknown };
    if (typeof result.id !== "string" || !result.id) return reply(502, "We could not confirm your inquiry was sent. Please try again later.");
    return reply(200, "Thank you. Your inquiry has been sent to CAhead.");
  } catch { return reply(502, "We could not confirm delivery. Please try again later."); }
}
