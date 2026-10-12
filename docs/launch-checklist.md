# Launch checklist

This separates implemented functionality from the evidence and configuration required to operate the business publicly. The working site is not a verified agency identity, a connected lead-delivery service, a legal review, or a completed deployment.

## Implemented in source

- [x] Next.js, TypeScript, React, Tailwind CSS, package lockfile, and local run/build scripts.
- [x] Twelve main pages plus two complete initial articles with real internal routes.
- [x] Reusable responsive header, mobile menu, footer, service components, and contact form.
- [x] Original CAhead SVG logo, geometric illustrations, color system, typography, and responsive styling.
- [x] Core affiliate and publisher positioning, optional extended services, and explicit evidence limitations.
- [x] CMS-ready typed article structure; no CMS is installed or connected.
- [x] Contact client/server validation, field errors, submission feedback, honeypot, timing check, request-body limit, origin checks, email adapter, Turnstile verification, and distributed limiter integration.
- [x] Unconfigured delivery fails visibly; no fake success response or local lead storage.
- [x] Metadata, Open Graph image, canonical paths, organization schema, sitemap, robots, and noindex-by-default launch guard.
- [x] Optional analytics consent UI and GA4/GTM loading points; Search Console verification setting.
- [x] Security headers, skip navigation, focus styles, semantic page structure, and reduced-motion handling.
- [x] Competitor research, strategy/brand documentation, article concepts, configuration instructions, and deployment guide.

These checks describe code presence. Consult recorded QA results for actual test outcomes; they do not imply that every external integration or browser has been tested.

## Business owner and content approval — pending

- [ ] Confirm CAhead trademark and domain availability.
- [ ] Provide the legal entity, approved professional contact address, and actual business details.
- [ ] Search the full source for the working brand; it is not entirely centralized in `lib/site.ts`.
- [ ] Verify delivery people, expertise, capacity, and contracts for every advertised service. Narrow any unsubstantiated offer.
- [ ] Approve final About copy. Add genuine biographies/photos only when supplied and approved.
- [ ] Supply authorized client evidence before adding logos, testimonials, results, or published case studies. Preserve clear labels on illustrative material.
- [ ] Review article authorship, publication dates, commercial claims, and service language.
- [ ] Review and finalize the draft privacy policy and terms against the entity, vendors, jurisdictions, data retention, and actual operations.

## Contact delivery and production protections — pending credentials

- [ ] Verify Resend sender domain and configure `RESEND_API_KEY`, `CONTACT_FROM`, and `CONTACT_TO`.
- [ ] Configure the public contact email and confirm somebody monitors it.
- [ ] Configure both Turnstile keys and exact allowed hostnames.
- [ ] Configure the Upstash HTTPS endpoint and secret; verify the five-attempt/ten-minute policy in staging.
- [ ] Verify that the deployment's trusted proxy overwrites the IP header used by the route.
- [ ] Run one authorized staging submission with real services; confirm recipient delivery and provider events.
- [ ] Check incorrect input, security verification failure, provider failure, oversized input, and rate limiting without losing the typed message.
- [ ] Establish lead-access rules, retention/deletion practices, service monitoring, and an incident owner. The application itself does not archive leads.

## Domain, SEO, analytics, and hosting — pending configuration

- [ ] Choose the host, connect the source, and deploy a protected or noindex preview.
- [ ] Configure HTTPS for `caheadagency.com` and set `NEXT_PUBLIC_SITE_URL=https://caheadagency.com`.
- [ ] Keep `NEXT_PUBLIC_LAUNCH_READY=false` until content and integrations are approved.
- [ ] Configure GA4 **or** GTM only if required; audit tags, consent behavior, and the privacy text. Define and test meaningful conversion events separately.
- [ ] Add Search Console verification if used and verify ownership.
- [ ] After approval, set `NEXT_PUBLIC_LAUNCH_READY=true` and rebuild. Both readiness and site URL are needed for indexing and a populated sitemap.
- [ ] Verify canonical URLs, metadata, organization details, Open Graph rendering, `/robots.txt`, and `/sitemap.xml` on the final domain. Remove localhost references.
- [ ] Submit the verified sitemap and watch indexing/reporting after launch. No ranking or traffic result is guaranteed.

## Release QA — record outcomes rather than assume completion

- [ ] Record results for `npm run typecheck`, `npm test`, and `npm run build` against the final source.
- [ ] Check all navigation destinations, service pages, article pages, footer links, and unknown-page handling.
- [ ] Inspect desktop, tablet, and phone layouts for clipping, unreadable text, touch targets, and horizontal overflow.
- [ ] Check keyboard-only navigation, visible focus, menu state, form labels/errors, reading order, and color contrast.
- [ ] Test privacy choices in a fresh browser and confirm optional analytics network requests obey the selection.
- [ ] Run measured performance/accessibility checks on a production build. Record environment, URL, viewport, date, and limitations; do not claim unmeasured Core Web Vitals.
- [ ] Repeat the essential route, form, metadata, and header checks after the actual deployment.
- [ ] Keep a rollback path and confirm who will maintain content, dependencies, integrations, and inquiries.

The last group is a release record for the final deployer. Local test results obtained during implementation can be documented separately without marking credential-dependent production checks complete.
