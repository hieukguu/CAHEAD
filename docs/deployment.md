# Deployment guide

The repository is a full Next.js application with a server-side contact route. It is not configured as a static export. Uploading only HTML or a static output directory will not preserve contact submission. No hosting account, domain, email service, analytics property, or production deployment has been configured by this delivery.

## Configuration

Use the hosting provider's environment settings for production values and secrets. Use `.env.local` only for local work. Public variables are embedded at build time; rebuild after changing them. Set `NEXT_PUBLIC_SITE_URL=https://caheadagency.com` without a trailing slash, path, or query string, and set `NEXT_PUBLIC_CONTACT_EMAIL=info@caheadagency.com`.

| Variable | Purpose | Launch requirement |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, schema, origin checks, sitemap | `https://caheadagency.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public business contact address | `info@caheadagency.com` |
| `NEXT_PUBLIC_LAUNCH_READY` | Exact value `true` enables indexing when site URL is also set | Keep `false` until launch review is complete |
| `GOOGLE_SITE_VERIFICATION` | Search Console verification token | Optional; set before build |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID | Optional; use GA4 or GTM |
| `NEXT_PUBLIC_GTM_ID` | GTM container ID | Optional; takes precedence over direct GA4 if both set |
| `RESEND_API_KEY` | Email sending credential | Required for any real submission |
| `CONTACT_FROM` | Sender on a verified sending domain | Required for any real submission |
| `CONTACT_TO` | Monitored inquiry recipient | Required for any real submission |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser security widget key | Required with production Turnstile |
| `TURNSTILE_SECRET_KEY` | Server-side token verification secret | Required in production |
| `UPSTASH_REDIS_REST_URL` | HTTPS distributed rate-limit endpoint | Required in production |
| `UPSTASH_REDIS_REST_TOKEN` | Rate-limit credential | Required in production |

Do not use `NEXT_PUBLIC_` for secrets. Configure the Turnstile allowed hostnames to match the deployment. Verify the email sender domain and recipient. See [contact integration](contact-integration.md) for exact field limits, failure states, and the trusted-proxy requirement. The form does not store inquiries locally or simulate successful delivery.

## Vercel

Vercel provides native Next.js deployment support, including deployment from a project directory through its CLI and Git-connected preview deployments. See the [official Next.js deployment guide](https://vercel.com/docs/frameworks/full-stack/nextjs).

For this project:

1. Import an authorized repository into a Vercel project, selecting the directory containing `package.json` as the root. Use the Next.js preset and a supported Node.js version of at least 22.
2. Retain the normal Next.js build behavior: install from the lockfile and run `npm run build`. Do not set an `out` directory or configure static-only hosting.
3. Add the environment variables above to the appropriate preview or production environment. Keep launch readiness false for previews. Scope secrets to environments that need them.
4. Deploy a preview and check all page routes, error states, and metadata. A preview is not evidence that production delivery is configured: the contact route permits a development limiter for `VERCEL_ENV=preview`.
5. Configure production email, Turnstile, and Upstash, attach the verified domain, and perform the launch checklist. The production route uses Vercel's forwarded IP header for rate limiting.
6. Set launch readiness true only after identity, content, privacy, contact, and domain checks are complete. Rebuild, then verify canonical URLs, robots, sitemap, and the Open Graph image on the live domain.

The project is deployment-ready source; these instructions are not a report of a completed hosted deployment.

## Hostinger

Hostinger's documented Node.js web-app flow supports Next.js, GitHub import or a source ZIP, and configurable detected build settings. Its guide lists Business and Cloud hosting support and Node.js 22/24 options; verify availability in the actual account. Start with Websites → Create Website → Web App, import the source, review detected settings, and deploy. See the [official Hostinger Node.js guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

Project-specific checks:

- Choose the full server-side Next.js framework flow, Node.js 22 or newer, and the `npm run build` build command. Keep the lockfile in the source upload. Exclude `.env.local`, `.git`, `node_modules`, and local build/cache folders from a ZIP.
- The build directory is `.next`; it must be handled as framework output, not a standalone static website. Prefer the host's detected Next.js start configuration.
- The included `npm start` binds to `0.0.0.0` and uses the platform-provided `PORT`, which is appropriate for managed Node.js hosting. Do not expose an unmanaged development server.
- Add environment values in hosting settings before building. Configure the production domain and HTTPS, then verify routing to `/api/contact`.
- Verify the trusted proxy overwrites `x-forwarded-for`; the application relies on this header outside Vercel. A user-controlled value weakens per-client rate limiting. Confirm platform behavior or configure an appropriate trusted reverse proxy before making the form public.
- Set up Resend, Turnstile, and Upstash. A Hostinger production build requires all three protection/delivery configurations; it does not receive Vercel's preview exception.
- If the account cannot run this application's server routes, use a supported Node.js hosting product or Vercel. A static upload is not an equivalent deployment.

Hostinger account settings and listener behavior have not been tested against a real account. Preserve the full source and deploy from it; do not treat manual changes to generated hosting output as maintainable source changes.

## Final verification and rollback

Before publishing, run `npm ci`, `npm run typecheck`, `npm test`, and `npm run build`. Review the deployed preview at desktop, tablet, and phone widths. Test an authorized inquiry against a staging recipient and inspect the email provider's accepted and delivered events; acceptance by the provider does not guarantee delivery to the inbox.

Check that analytics requests are absent before opt-in and after declining. Review the GTM container itself if used: arbitrary tags may need additional consent handling and Content Security Policy destinations. The existing loader is an integration point, not a configured marketing measurement program. Define conversion events and verify them separately; do not send form values to analytics.

After public launch, inspect the actual response headers, canonical host, schema, robots, sitemap, external requests, and form failure behavior. Run performance and accessibility checks on the deployed production build. Keep the previous working deployment available and use the provider's rollback capability if release verification fails. Recheck environment values when rolling back; code rollback alone may not restore changed external configuration.
