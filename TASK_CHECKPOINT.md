# Task checkpoint

Last updated: 7 November 2026, after publishing the redesign.

To resume: read this file, inspect the repository, confirm what is really done, then continue from Next exact steps.

## Project objective

Build DeveloperBro., a premium, research-oriented academic portfolio for Supriyo Sarkar, an M.Tech graduate seeking
doctoral positions. Accuracy of academic claims comes before decoration.

## Current architecture

Next.js 16 App Router, React 19, TypeScript 6 strict, Tailwind CSS 4, MDX with KaTeX and Shiki, Zod, Resend, Vitest,
Playwright, axe. Server components by default. No database and no animation library. Details are in `docs/ARCHITECTURE.md`.

## Task status

| Task | Status |
| --- | --- |
| Audit of site, repository, CV, GitHub | COMPLETED |
| Reference research, 8 sites | COMPLETED |
| Navigation: Home, Research Works, Projects, Blogs, About Me, Contact | COMPLETED |
| Home: accessible carousel and all required sections | COMPLETED |
| Research case study template and filters | COMPLETED |
| Project detail pages and filters | COMPLETED |
| Blog platform: maths, tags, RSS, bookmarks, reading mode | COMPLETED |
| About Me with all CV sections | COMPLETED |
| Public-safe CV, preview and download | COMPLETED |
| Social links, global search, copy controls, back to top | COMPLETED |
| Illustrations and interaction effects | COMPLETED |
| Security, accessibility, performance checks | COMPLETED |
| Independent code review | COMPLETED |
| Deploy this redesign to Vercel | COMPLETED |
| 26 new blog posts, chart and diagram blocks | COMPLETED, deployed 7 November 2026 |
| Real email delivery | BLOCKED (needs a Resend key) |
| Owner review of drafted wording | NOT STARTED |

## Files

Created: `src/components/home/HeroCarousel.tsx`, `src/components/search/GlobalSearch.tsx`, `src/components/shared/*`,
`src/components/layout/PageEnhancements.tsx`, `src/components/blogs/CodeBlock.tsx`,
`src/components/illustrations/scenes-research.tsx`, `src/components/research/ComparisonTable.tsx`,
`src/components/projects/RepoStats.tsx`, `src/content/home.ts`, `src/lib/search.ts`, `src/lib/search-index.ts`,
`src/app/feed.xml`, `src/app/search-index.json`, `private/scripts/build_public_cv.py` (not in the public repository), `public/documents/academic-cv-public.pdf`,
`docs/CONTENT_SOURCES.md`, `docs/DEVELOPMENT_GUIDE.md`.

Modified: home, about, contact, research, projects and blog pages, navigation, footer, styles, content files, tests, docs.

Removed: `scripts/redact_cv.py`, replaced by the new builder. `docs/COMPONENTS.md`, `docs/TASK_TRACKER.md` and the old
checkpoint, merged here and into the development guide. `src/app/blog` moved to `src/app/blogs`, with redirects.

## Bugs discovered and fixed in this phase

- Client search imported server file access, which crashed the build
- Root loading screen broke 404 status codes and pages without JavaScript, so it was removed
- Theme toggle and carousel grid caused overflow on phones
- Search could freeze the page in reading mode
- Carousel could rotate under keyboard focus, and the page lost its h1 after rotating
- Unsupported claim of a lesson learned from the B.Tech work
- Doubled anchor offsets, missing feed discovery, a low-severity KaTeX advisory

## Tests

Type check, lint and build pass. 63 of 63 unit tests and 101 of 101 browser tests pass. `npm audit` reports 0
vulnerabilities. Full results are in `docs/TESTING.md`.

Live site tested after deployment. Pending: Firefox, Safari, real phones, screen readers, OWASP ZAP.

## Known limitations

- The contact form is unavailable until Resend variables are set.
- The carousel is a requirement, though reference sites for individual researchers avoid them.
- Project challenges and learning outcomes are hidden because no source exists.
- Mobile Lighthouse performance is 74 to 93 in a throttled lab test.
- Rate limiting is per server instance.

## Unresolved decisions

- Whether to commit this work. Changes since commit `a809f5a` are uncommitted on disk
- Whether to connect a GitHub repository for automatic deploys

## Blog expansion, 7 November 2026

26 posts added to `src/content/articles` (29 in total), dated November 2024 to October 2026. New MDX blocks in
`src/components/blogs/MdxBlocks.tsx`: `BarChart`, `LineChart`, `Flow`, `Callout`, `Stats`, `Figure`. Props are plain
strings because MDX runs with JavaScript blocked. `scripts/check-mdx.mjs` compiles every article in about a second.
Figures in `public/images/blog`. The local build, 63 unit tests and 107 browser tests pass. Deployed on the owner's approval
and checked live (see `docs/TESTING.md`).

## Scope, animation and assistant update, 7 November 2026

- Projects: Third Hand-Eye, Tour India and this portfolio only. Research Works: the M.Tech and B.Tech dissertations only.
  Removed pages redirect (see `next.config.ts`).
- Academic journey: degrees, research works and projects. Marks appear only on About Me. The CV PDF keeps its marks.
- Continuous animation: `src/components/illustrations/base.tsx` (`Anim`, `Head`, `Robot`, `Laptop`, `Mug`, `Sparkle`),
  `scenes-extra.tsx` (quantum and footer scenes), `AmbientBackground`, `MotionToggle` (pause switch), `MotionScheduler`
  (pauses off-screen scenes). Seven home slides with staged entrances and a progress bar.
- Chat assistant "Bro": `src/lib/assistant/*` and `src/components/assistant/ChatAssistant.tsx`. Rule-based, runs in the
  browser, answers only from site content. 10 unit tests in `tests/unit/assistant.test.ts`.
- Tests: 73 unit, 115 browser, all passing locally. `npm audit` 0.
- Git: history restarted as one commit on `main`; the old history is kept locally on `backup/pre-github-history`.
  Public repository: https://github.com/Supriyo016/DeveloperBro-Academic-Portfolio (created, push waits on GitHub
  sign-in). The CV builder moved to `private/scripts/` and audit notes to `docs/private/`, both git-ignored.
- NOT yet done: push, Vercel Git connection, production deploy (blocked by a permission rule, needs the owner).

## Next exact steps

1. Owner reads `docs/private/CONTENT_REVIEW.md`, including the blog section, and removes or edits any post.
2. Commit the work.
3. Add Resend variables in Vercel to turn on the contact form.

## Commands to resume

```bash
cd "C:\Users\Supriyo Sarkar\Desktop\academic-portfolio"
npm install
npm run build
npm test
npm run test:e2e
npm run dev
```
