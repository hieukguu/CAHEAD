# CAhead agency website

A multi-page affiliate agency website for CAhead LLC, built with Next.js 16.4, React 19, TypeScript, and Tailwind CSS 4. This project has not been deployed to a public production domain.

## Run locally

Use Node.js 22 or newer and npm. The lockfile is included.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. To provide local configuration, copy `.env.example` to `.env.local` and fill in only the values you have. Do not commit credentials.

```sh
npm run typecheck
npm test
npm run build
npm start
```

`npm start` serves the production build on loopback; this is appropriate for local checks or a trusted local reverse proxy. Managed hosting may require its own interface and port settings; see [deployment](docs/deployment.md). The production contact endpoint intentionally returns an unavailable response until its delivery and protection services are configured.

## What is included

- Twelve main pages and two complete articles, with reusable navigation, footer, service layouts, and responsive components.
- Original SVG brand mark and geometric illustrations, editorial typography, and restrained motion with reduced-motion support.
- A validated contact form and server route with real email integration architecture, explicit error handling, spam checks, and production rate limiting requirements.
- Page metadata, canonical paths, generated Open Graph image, organization structured data, sitemap, and robots route.
- Optional GA4 or GTM loading after analytics opt-in, privacy controls, and a Search Console verification field.
- Research, business strategy, brand guidance, deployment instructions, and a launch checklist.

**Preview is the default:** indexing is disabled, robots disallows crawling, and the sitemap has no URLs until both `NEXT_PUBLIC_LAUNCH_READY=true` and `NEXT_PUBLIC_SITE_URL` are set before rebuilding. This prevents unfinished business and legal content from being presented as launch-ready. It is not access control: protect private previews at the hosting layer if needed.

## Edit content and identity

| File / directory | Purpose |
| --- | --- |
| `lib/site.ts` | Site settings, service content, navigation |
| `lib/articles.ts` | Typed article data with slug, title, excerpt, category, reading time, date, and sections |
| `app/` | Page copy, layouts, metadata routes, and contact endpoint |
| `components/` | Navigation, form, privacy controls, illustrations, shared UI |
| `app/globals.css` | Design tokens, responsive styles, motion, focus states |
| `public/logo.svg`, `app/icon.svg` | Original brand assets |
| `.env.example` | All supported configuration names; no live secrets |

Brand details are centralized where practical, but a repository search is still recommended after future naming changes. Approve business claims and service capacity before publishing them. The About page does not substitute for verified team biographies, and the case studies page does not contain verified client results.

## CMS and image approach

The blog is CMS-ready structured source content, not an installed CMS. Both the insight index and article route consume `articles` from `lib/articles.ts`; the article route also derives static slugs and metadata. A future CMS adapter should map approved entries to the existing `Article` type and replace those data reads consistently, including the sitemap. Add draft filtering, schema validation, access-controlled previews, cache/revalidation behavior, and slug redirect handling when integrating a provider. Current content changes require a rebuild.

The site currently uses local vectors and system fonts, avoiding stock-photo downloads and remote font requests. No raster-photo optimization is claimed. If real photography is added, use Next.js image handling with explicit dimensions and responsive sizes, meaningful alt text, and an approved remote-source allowlist when needed. Do not prioritize every image; reserve eager loading for a genuinely critical above-the-fold image.

## Documentation

- [Competitor research](docs/competitor-research.md)
- [Strategy, identity, architecture, and editorial plan](docs/strategy-and-brand.md)
- [Contact integration and protection behavior](docs/contact-integration.md)
- [Deployment and environment variables](docs/deployment.md)
- [Launch checklist](docs/launch-checklist.md)

Validation results and screenshots are recorded separately in the project documentation as they are obtained. Do not infer a Lighthouse score, inbox delivery result, completed legal review, or public deployment from a successful local build.
