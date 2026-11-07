# Architecture

## Overview

A server-rendered Next.js App Router site. Pages are server components that read typed content. Client components
exist only where interaction needs them. There is no database.

```
src/
  app/          Routes, metadata, API route, sitemap, robots, Open Graph image
  components/   UI by feature, plus illustrations, shared and primitives
  content/      All academic content: typed data, MDX articles, generated results
  lib/          Articles, GitHub client, validation, security helpers
  hooks/        Shared client hooks
  services/     Email delivery
  types/        Content types
  proxy.ts      Per-request nonce and security headers
scripts/        Public CV builder
tests/          unit, integration, security, e2e
```

## Decisions

### No database

All content is authored by one person and changes rarely, and the contact form only sends email. MongoDB would add
credentials, network exposure and a running cost with no feature behind it. Typed files give the same editing
convenience, with review through git. If visitor-generated data is ever needed, revisit this.

### Nonce-based CSP, so pages render per request

A strict script policy needs a fresh nonce per response, and static pages cannot carry one. Every HTML page is
therefore rendered on demand. The cost is slightly slower first byte and no CDN caching of HTML. For a low-traffic
site with no user content this is a fair trade for a CSP that blocks injected markup, inline handlers and
foreign scripts. Static assets, images and the PDF are still cached.

### Generated research data

`src/content/data/alzheimers-results.json` is extracted from notebook output, never typed by hand. Tests assert that
it agrees with the headline figures on the case study.

### Animation in CSS, with no animation library

Motion was built in first, then removed: Lighthouse showed about 42 KB of it unused on the home page, and every effect
here is a fade, a transform or a scroll-linked scale. Reveals use one IntersectionObserver and CSS transitions. They are gated on a `js` class, so content stays visible
without JavaScript, and the class is removed if the bundle has not started within four seconds. Page transitions and panel changes are pure CSS. `useScrollFrame` drives the timeline rail and
reading progress bar from one throttled listener.

### Illustrations as themed SVG

All illustrations are React SVG components that draw from `--il-*` tokens, so one drawing serves both themes with no
image requests.

### Theme without a library

A small inline script sets `data-theme` before first paint. `useSyncExternalStore` keeps the toggle in sync.

## Technologies evaluated and not used

| Technology | Why not |
| --- | --- |
| MongoDB, Mongoose | No dynamic data requirement |
| Redis, Upstash | One low-traffic form. See the limit noted in SECURITY.md |
| Three.js, React Three Fiber | Large bundle for no gain in understanding |
| Motion, GSAP, Lottie | Evaluated again for the redesign. CSS and one pointer listener cover the carousel, borders, spotlight and magnetic buttons at no bundle cost |
| React Hook Form | One four-field form. Zod already validates on both sides |
| LLM assistant | Ongoing cost and abuse surface. The content is small enough to browse |
| shadcn/ui | A few primitives were simpler than adopting the system |
| Root loading screen | Forces streaming, which broke 404 status codes and pages without JavaScript |
| Analytics | Avoids cookies and a consent banner. Vercel Analytics can be added later |
| Contribution graph | Needs an authenticated GraphQL token for little value at this repository count |

## Design references

Eight sites were studied for patterns, not copied: Karpathy, Olah, Lilian Weng, al-folio, BAIR, Stanford HAI, Dawn Song
and Nicolas Papernot. They put identity, specific research and dated evidence first, and they avoid heavy motion. The
carousel was a requirement, so it stays calm, with one heading per slide and controls below.

## Design system

Tokens are CSS variables in `src/app/globals.css`, mapped into Tailwind with `@theme inline`.

- Colour: warm ivory and deep navy surfaces, indigo primary, muted cyan accent, lavender support
- Type: Newsreader for headings, Geist for text, Geist Mono for labels and data
- Chart palette: validated for colour-vision deficiency on both surfaces. Light mode has contrast warnings on two
  series, so every chart has a table view
- Motion: transform and opacity only, with `prefers-reduced-motion` respected throughout
