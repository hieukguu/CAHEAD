# Contact integration

`POST /api/contact` accepts JSON and returns `{ message, errors? }`. Client code must check `response.ok`; preserve values on errors and only display success after a 200 response. No inquiry is stored locally, and no success is simulated.

Fields: `name` (2–100 characters), `email` (valid address, up to 254), `company` (required, 1–160), `website` (required absolute HTTP/HTTPS URL, up to 500), `service` (one of Affiliate marketing, Publisher partnerships, Performance marketing, Content & SEO, Not sure yet), `budget` (optional, 100), `message` (20–5000), `consent: true`, hidden `fax: ""`, `startedAt` (timestamp in milliseconds captured when the form mounts), and optional `turnstileToken`. Submissions must be between 1.5 seconds and 24 hours after mounting. Refresh the timestamp after confirmed success.

## Deployment variables

Set these through the deployment provider's secret manager. Never prefix secrets with `NEXT_PUBLIC_` or commit real values.

- `RESEND_API_KEY`: Resend API key with email sending access.
- `CONTACT_FROM`: sender on the verified domain, for example `CAhead <inquiries@caheadagency.com>`.
- `CONTACT_TO`: the monitored recipient, `info@caheadagency.com`.
- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS origin, `https://caheadagency.com`.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST connection (HTTPS required).
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: site key used by the frontend widget; pass its completed token as `turnstileToken`. Configure allowed domains in Cloudflare and reset the widget after each submission attempt.

Production (`NODE_ENV=production`, except Vercel preview deployments) fails closed without distributed rate limiting and Turnstile. All environments require actual Resend configuration to send. Local/preview testing may omit Turnstile; if its secret is present, the widget token is required. The in-memory development limiter is not safe across production workers or restarts. Production hosting must overwrite forwarded IP headers at its trusted proxy boundary: on Vercel the route reads `x-vercel-forwarded-for`, otherwise `x-forwarded-for`. Configure equivalent trust for other hosts before launch.

Production checks required email, limiter, and verification configuration before making external requests. Missing or blank values return HTTP 503 with “The inquiry form is not connected yet. Your message has not been sent.” All configured production submissions still pass the complete security checks before email delivery.

For local testing, `localhost`, `127.0.0.1`, and `[::1]` are treated as equivalent origins only when both the request URL and browser Origin use loopback addresses with the same protocol and port. Public origins receive no loopback exception.

The limiter allows five attempts per ten minutes per hashed IP (no raw IP is stored in Redis). The body is streamed with a 16 KiB cap. Requests require JSON and an allowed Origin. Honeypot, timing, schema, same-origin, Turnstile hostname, and email-provider checks run on the server. Messages go as plain text, never interpolated HTML. The route emits no personal data or provider secrets to logs. Rate-limit outages and verification outages fail closed. A provider accepting an email does not guarantee inbox delivery; monitor Resend delivery events operationally. Timeout responses can mean an email was accepted but the confirmation was lost; avoid automatically retrying client submissions.

## Verification

Run `npx tsx --test tests/contact.test.ts`. These tests do not send real email. Before launch, verify the sender domain, recipient ownership, production Turnstile widget, proxy headers, and Upstash connection. Perform one authorized staging inquiry and inspect delivery using the provider dashboard. Do not publish a working-form claim until configuration is complete.
