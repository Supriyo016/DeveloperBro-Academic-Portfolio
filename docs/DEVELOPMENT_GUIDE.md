# Development guide

## Setup

Needs Node.js 20.9 or later.

```bash
npm install
npx playwright install chromium
cp .env.example .env.local
npm run dev
```

## Everyday commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit, integration and security tests |
| `npm run test:e2e` | Browser tests against the last build |
| `npm audit` | Dependency audit |

Run the browser tests against a deployed site by setting `E2E_BASE_URL`.

## Where things live

| To change | Edit |
| --- | --- |
| Name, bio, social links, CV path | `src/content/profile.ts` |
| Hero slides | `src/content/home.ts` |
| Research case studies, proposed research | `src/content/research.ts` |
| Research interests and map | `src/content/research-areas.ts` |
| Publications | `src/content/publications.ts` |
| Projects and filters | `src/content/projects.ts` |
| Timeline | `src/content/education.ts` |
| Skills | `src/content/skills.ts` |
| Achievements and courses | `src/content/achievements.ts` |
| Articles | `src/content/articles/*.mdx` |
| Navigation | `src/lib/site.ts` |
| Colours and motion | `src/app/globals.css` |
| Security headers | `src/lib/security/headers.ts` |
| Illustrations | `src/components/illustrations/` |

## Adding an article

Add an `.mdx` file to `src/content/articles/`. The file name becomes the address.

```yaml
---
title: "Title"
description: "One sentence."
date: "2026-12-01"
updated: "2026-12-05"
category: "Federated Learning"
tags: ["Non-IID data"]
references:
  - text: "Author. Title. Venue, Year."
    url: "https://doi.org/..."
---
```

Maths uses `$...$` and `$$...$$`. Code fences get highlighting and a copy button. `updated` and `references` are optional.

## Adding a publication

Add an entry to `src/content/publications.ts` with its true status. Empty categories stay hidden.

## Adding a project

Add an entry to `src/content/projects.ts`. Optional sections appear only when filled in. Set `repoName` to show live
repository statistics.

## Updating the CV

Since 8 November 2026 the site serves the owner's original CV unchanged, by the owner's decision. Replace
`public/documents/Supriyo_Sarkar_Academic_CV.pdf` with the new file under the same name, then update `cvUpdated` in
`src/content/profile.ts`. Every download link, the PDF preview and the assistant read `profile.cvPath`, so nothing
else changes. The `/documents` path sends `X-Robots-Tag: noindex`, so search engines do not list the file.

## Rules worth keeping

- Add no claim without a source in `docs/CONTENT_SOURCES.md`.
- Keep server-only code, anything using `node:fs`, out of files imported by client components. `src/lib/search.ts` is
  the client half and `src/lib/search-index.ts` the server half for this reason.
- Do not add a root `loading.tsx`. It streams every page, which broke true 404 status codes and pages without JavaScript.
- Tailwind `scale-*` classes set the `scale` property, so they multiply with any JavaScript `transform`.
- Use `Suspense` only around data that may be slow, as on the GitHub page.
