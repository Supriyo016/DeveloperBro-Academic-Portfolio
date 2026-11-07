# Testing report

Final run: 7 November 2026, on a clean production build, Node 26.13, Windows 10.

## Live site

The redesign was deployed to https://developerbro.vercel.app and tested there on 7 November 2026.

- Browser suite with one retry: 97 passed first time and 3 passed on retry after network timeouts
- The remaining test, no console errors or CSP violations, timed out waiting for network idle. Traced route by route: 18
  routes, 0 console problems, with only background link prefetches stalling. It now waits for page load and passes live
- All 24 pages, feeds and files checked returned 200, and unknown pages returned 404
- The served CV matches the local public copy exactly and contains no private fields or unsupported wording
- Private notes, env files, scripts and the old CV path are not served
- HSTS, CSP with a nonce, frame, content-type and referrer headers are present, and HTTP redirects to HTTPS

The test connection dropped requests throughout, including a failed first deploy caused by an unusable IPv6 route.

## Blog expansion, 7 November 2026

After adding 26 posts and the chart blocks: type check, lint and build pass, 63 of 63 unit tests and 107 of 107 browser
tests pass locally. The browser suite now opens every article, and runs overflow and axe checks on three chart-heavy
posts. All 69 reference links were requested: 60 returned 200, 2 were broken and have been fixed, and 7 doi.org links were
refused by publisher bot protection (403 or 202), so their pages were not opened.

Deployed the same day as `developerbro-6mthxv5f9-supriyo016.vercel.app`. On the live site, all 29 posts returned 200 with
a heading (one needed a retry after a network timeout), the feed and sitemap list 29 posts, blog images load, and
`/scripts` and `/docs/private` return 404. The blog, overflow, axe, CSP and link-crawl browser tests ran live: 23 passed,
2 passed on retry, and 2 hit the 60-second limit on the slow connection, then passed with a longer limit.

## Local build

## Results

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` (strict) | Passed |
| `npm run lint` | Passed, 0 problems |
| `npm run build` | Passed |
| `npm test` (unit, integration, security) | 63 of 63 passed |
| `npm run test:e2e` (Playwright, Chromium) | 101 of 101 passed |
| `npm audit` (production and development) | 0 vulnerabilities |

After the final dependency change, the build, unit tests and blog browser tests were rerun and passed.

## Lighthouse

Run against `next start` on localhost with installed Chrome.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home, mobile | 78 | 100 | 100 | 100 | 3.7 s | 0 | 450 ms |
| Research, mobile | 93 | 100 | 100 | 100 | 3.0 s | 0 | 140 ms |
| Case study, mobile | 87 | 100 | 100 | 100 | 3.2 s | 0 | 290 ms |
| Article, mobile | 88 | 100 | 100 | 100 | 3.4 s | 0 | 230 ms |
| About, mobile | 74 | 100 | 100 | 100 | 3.6 s | 0 | 630 ms |
| Home, desktop | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |

Mobile figures use simulated slow 4G and 4x CPU slowdown on a slow machine, and they vary between runs. Mobile LCP is
above the 2.5 s "good" threshold in this setup, so measure it again on the deployed site. `bf-cache` is the only failing
audit. It comes from per-request rendering for the nonce CSP.

## What the browser tests cover

- No horizontal overflow on 18 routes at 320, 375, 425, 768, 1024, 1440 and 1920 px
- axe WCAG 2.2 AA scan on 18 routes, in light and dark themes
- Navigation, redirects, mobile menu, skip link, focus return from dialogs
- Theme toggle, persistence, system preference, theme applied before first paint
- Carousel buttons, pause, reduced motion, no rotation under keyboard focus
- Global search, back to top, social link targets and attributes
- Research map, interest explorer, research filters, results explorer, pipeline viewer, table views
- Case study structure, citation controls, thesis figures, proposed research labels
- Project filters, repository stats, skill explorer, terminal
- Blog filters, maths, code copy, references, reading mode, bookmarks, previous and next, RSS, table of contents
- CV preview, download, print layout, private field absence
- Contact validation and failure states
- Live GitHub data, 404 pages, metadata, structured data, sitemap, robots, a crawl of all internal links
- Reduced motion, no JavaScript, failed JavaScript bundle
- Unique nonce per response, security headers, no console errors or CSP violations
- Injected markup and `javascript:` links blocked, with a no-CSP control
- Parser-inserted and foreign-origin scripts blocked, path traversal, private files not served

## Checked by hand

- PDF preview renders in real Chrome
- All five carousel slides and new illustrations in light mode, and the home page on a phone in dark mode

## Not verified

| Item | Why |
| --- | --- |
| Email delivery through Resend | Needs a real API key. The route is tested with a mocked provider |
| Firefox, Safari, real phones | Only Chromium was run |
| Screen reader use | axe checks structure, not real assistive technology use |
| OWASP ZAP scan | ZAP is not installed |
| Rate limiting across serverless instances | Per-instance by design. See SECURITY.md |
