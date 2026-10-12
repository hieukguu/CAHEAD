import assert from "node:assert/strict";
import test from "node:test";
import { contactEmailText, validateContact } from "../lib/contact";
import { POST } from "../app/api/contact/route";

const now = Date.now();
const good = { name: "Alex Example", email: "alex@example.com", company: "Example Company", website: "https://example.com", service: "Affiliate marketing", message: "We would like help developing our partner program.", consent: true, fax: "", startedAt: now - 5000 };

test("accepts a complete inquiry and normalizes optional fields", () => {
  const result = validateContact(good, now);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.budget, "");
});
test("requires company and website even when client validation is bypassed", () => {
  for (const value of [undefined, "", "   "]) {
    const result = validateContact({ ...good, company: value, website: value }, now);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.errors.company);
      assert.ok(result.errors.website);
    }
  }
});
test("rejects invalid inputs with field-specific errors", () => {
  const result = validateContact({ ...good, email: "invalid", consent: false, website: "javascript:alert(1)", service: "Invalid" }, now);
  assert.equal(result.success, false);
  if (!result.success) for (const field of ["email", "consent", "website", "service"]) assert.ok(result.errors[field]);
});
test("rejects honeypots, impossible timing, and overlong messages", () => {
  for (const change of [{ fax: "spam" }, { startedAt: now + 1 }, { startedAt: now }, { startedAt: now - 86400001 }, { message: "x".repeat(5001) }]) {
    assert.equal(validateContact({ ...good, ...change }, now).success, false);
  }
});
test("allows only HTTP or HTTPS websites and renders plain text", () => {
  const result = validateContact({ ...good, website: "https://example.com", name: "<b>Alex</b>" }, now);
  assert.equal(result.success, true);
  if (result.success) assert.ok(contactEmailText(result.data).includes("Name: <b>Alex</b>"));
});
test("route rejects foreign origins and incorrect content type before delivery", async () => {
  assert.equal((await POST(new Request("https://cahead.test/api/contact", { method: "POST", headers: { origin: "https://attacker.test", "content-type": "application/json" }, body: "{}" }))).status, 403);
  assert.equal((await POST(new Request("https://cahead.test/api/contact", { method: "POST", headers: { origin: "https://cahead.test", "content-type": "text/plain" }, body: "{}" }))).status, 415);
});
test("local origins tolerate loopback aliases only on the same protocol and port", async () => {
  const request = (url: string, origin: string) => new Request(url, { method: "POST", headers: { origin, "content-type": "text/plain" }, body: "{}" });
  for (const origin of ["http://127.0.0.1:3000", "http://[::1]:3000"]) {
    assert.equal((await POST(request("http://localhost:3000/api/contact", origin))).status, 415);
  }
  for (const origin of ["http://127.0.0.1:3001", "https://127.0.0.1:3000", "http://attacker.test:3000", "http://127.0.0.1:3000/path"]) {
    assert.equal((await POST(request("http://localhost:3000/api/contact", origin))).status, 403);
  }
  assert.equal((await POST(request("https://cahead.test/api/contact", "https://127.0.0.1"))).status, 403);
});
test("route bounds bodies and never reports success without delivery configuration", async () => {
  const names = ["NODE_ENV", "VERCEL_ENV", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "TURNSTILE_SECRET_KEY", "RESEND_API_KEY", "CONTACT_FROM", "CONTACT_TO"];
  const saved = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  try {
    for (const name of names) delete process.env[name];
    Object.assign(process.env, { NODE_ENV: "test" });
    const request = (body: string) => new Request("https://cahead.test/api/contact", { method: "POST", headers: { origin: "https://cahead.test", "content-type": "application/json", "x-forwarded-for": "contact-test" }, body });
    assert.equal((await POST(request("x".repeat(17000)))).status, 413);
    assert.equal((await POST(request("not-json"))).status, 400);
    const response = await POST(request(JSON.stringify(good)));
    assert.equal(response.status, 503);
    assert.match((await response.json()).message, /not been sent/);
    Object.assign(process.env, { NODE_ENV: "production" });
    const productionResponse = await POST(request(JSON.stringify(good)));
    assert.equal(productionResponse.status, 503);
    assert.equal((await productionResponse.json()).message, "The inquiry form is not connected yet. Your message has not been sent.");
  } finally {
    for (const name of names) { if (saved[name] === undefined) delete process.env[name]; else process.env[name] = saved[name]; }
  }
});

test("production uses security services and only reports confirmed provider acceptance", async () => {
  const values = { NODE_ENV: "production", VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://cahead.test", UPSTASH_REDIS_REST_URL: "https://redis.example.test", UPSTASH_REDIS_REST_TOKEN: "test-only", TURNSTILE_SECRET_KEY: "test-only", RESEND_API_KEY: "test-only", CONTACT_FROM: "test@example.test", CONTACT_TO: "recipient@example.test" };
  const saved = Object.fromEntries(Object.keys(values).map((name) => [name, process.env[name]]));
  const originalFetch = globalThis.fetch;
  let providerStatus = 200;
  let count = 1;
  const calls: string[] = [];
  try {
    Object.assign(process.env, values);
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      calls.push(url);
      if (url === values.UPSTASH_REDIS_REST_URL) return Response.json({ result: count });
      if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") return Response.json({ success: true, hostname: "cahead.test" });
      assert.equal(url, "https://api.resend.com/emails");
      const sent = JSON.parse(String(init?.body));
      assert.equal(sent.reply_to, good.email);
      assert.equal(sent.html, undefined);
      assert.ok(sent.text.includes(good.message));
      return Response.json(providerStatus === 200 ? { id: "mock-delivery-id" } : { error: "mock failure" }, { status: providerStatus });
    };
    const request = () => new Request("https://cahead.test/api/contact", { method: "POST", headers: { origin: "https://cahead.test", "content-type": "application/json" }, body: JSON.stringify({ ...good, turnstileToken: "mock-token" }) });
    for (const name of ["RESEND_API_KEY", "CONTACT_FROM", "CONTACT_TO", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "TURNSTILE_SECRET_KEY"] as const) {
      delete process.env[name];
      const unconfigured = await POST(request());
      assert.equal(unconfigured.status, 503);
      assert.equal((await unconfigured.json()).message, "The inquiry form is not connected yet. Your message has not been sent.");
      assert.equal(calls.length, 0);
      process.env[name] = values[name];
    }
    assert.equal((await POST(request())).status, 200);
    assert.equal(calls.length, 3);
    providerStatus = 500;
    assert.equal((await POST(request())).status, 502);
    count = 6;
    const limited = await POST(request());
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get("retry-after"), "600");
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of Object.keys(values)) { if (saved[name] === undefined) delete process.env[name]; else process.env[name] = saved[name]; }
  }
});
