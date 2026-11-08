# DeveloperBro.: academic portfolio of Supriyo Sarkar

Live at **https://developerbro.vercel.app**

Research portfolio built with Next.js, TypeScript and Tailwind CSS. Content lives in typed data files and MDX,
so research, projects and articles can change without touching components.

- Research case studies generated from notebook logs, and 29 research notes with maths, code, charts and diagrams
- Research case studies with model-by-model results, the full Custom CNN architecture and figures exported from the thesis notebooks
- Cartoon SVG characters, an animated researcher story and a moving background, with a pause control and reduced-motion support
- A cookie notice with a real choice: no analytics or advertising, and preference storage only if allowed
- Bro, a chat assistant that runs entirely in the browser and answers only from the site's own content
- Strict per-request Content Security Policy, and unit, security and browser tests including WCAG 2.2 AA scans

## License

**All rights reserved.** © 2026 Supriyo Sarkar. This repository is public so the work can be read and reviewed, not
reused. You may view the site, link to it and cite its research with attribution. Copying, modifying, redeploying or
reusing any of its code, design, illustrations or content requires written permission. See [LICENSE](LICENSE).

Private notes are kept out of this repository.

## Run it

Needs Node.js 20.9 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site works with an empty `.env.local`. The contact form then reports that it is unavailable and offers the
email link, and GitHub data uses the unauthenticated API.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Unit, integration and security tests |
| `npm run test:e2e` | Browser tests against a production build |
| `npm run audit:deps` | Production dependency audit |

Run `npx playwright install chromium` once before the browser tests, and `npm run build` before each run.

## Documentation

- [Task checkpoint](TASK_CHECKPOINT.md)
- [Development guide](docs/DEVELOPMENT_GUIDE.md), including how to update content
- [Architecture](docs/ARCHITECTURE.md)
- [Content sources](docs/CONTENT_SOURCES.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Testing report](docs/TESTING.md)
