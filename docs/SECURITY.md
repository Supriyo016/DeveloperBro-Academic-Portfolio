# Security

No website is immune to attack. This records what is in place, how it was checked, and what remains.

## Attack surface

The application has one state-changing endpoint, `POST /api/contact`, and one outbound integration, the GitHub API,
with a fixed URL. Two read-only static routes serve `/search-index.json` and `/feed.xml`. There are no accounts,
sessions, cookies, database, file uploads or user-generated pages. Theme and article bookmarks stay in `localStorage`
and hold no personal data.

| Risk | Status | Control |
| --- | --- | --- |
| XSS | Mitigated | React escaping, nonce CSP with `strict-dynamic`, MDX from the repo only, JSON-LD escaped, plain-text email |
| CSRF | Mitigated | No cookies, Origin must match Host, JSON content type required |
| SQL or NoSQL injection | Not applicable | No database. Schema rejects operator objects |
| Broken access control | Not applicable | No protected resources |
| Authentication, session hijacking, brute force | Not applicable | No login |
| Clickjacking | Mitigated | `frame-ancestors 'none'`, `X-Frame-Options: DENY`. The CV PDF is same-origin only |
| SSRF | Mitigated | GitHub URL is fixed. No user input reaches it |
| Open redirect | Mitigated | No redirect takes user input. Terminal navigation uses an allowlist |
| Path traversal | Mitigated | Article files come from a directory listing, and lookups match known slugs |
| Insecure uploads | Not applicable | No uploads |
| Mass assignment | Mitigated | `strictObject` rejects unknown fields |
| Email header injection | Mitigated | Line breaks rejected in single-line fields |
| Information disclosure | Mitigated | Generic error messages, no `X-Powered-By`, secrets server-only |
| Denial of service, API abuse | Partly mitigated | Rate limit, 16 KB body limit, GitHub caching and timeout. See limits below |
| Spam | Partly mitigated | Honeypot, minimum fill time, rate limit |
| Supply chain | Partly mitigated | Lockfile, `npm audit`. See below |

## Headers

Set in `src/proxy.ts` through `src/lib/security/headers.ts`: Content-Security-Policy with a per-request nonce,
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`,
`Cross-Origin-Resource-Policy`, and HSTS over HTTPS.

`style-src-attr 'unsafe-inline'` remains because React, Motion and syntax highlighting set inline style attributes.
Style elements still need a nonce, and this does not allow script execution.

`'strict-dynamic'` deliberately extends trust to code that a trusted script loads. Browser tests confirm the CSP
blocks injected HTML with inline handlers, `javascript:` links, parser-inserted scripts without a nonce, and scripts
from other origins. It does not stop code that is already executing in the page from adding scripts, which is why
the first line of defence is that no untrusted input is ever rendered as HTML.

## Personal data

The public CV has the phone number, date of birth, father's name, address, marital status and signature removed from
the file itself, and PDF metadata was cleared. The unredacted original is not in this project. Checked by reading text and raw bytes of the output. The portrait has
no EXIF data. `tests/security` scans the source for phone patterns and private field labels without
containing those values. The email address is public by the owner's decision.

The contact form stores nothing and logs no message content.

## Known limits

- **Rate limiting is per server instance.** On serverless hosting, instances do not share counts and restarts clear
  them, so a determined sender can exceed the limit. Acceptable for this form. For stronger protection add a shared
  store such as Upstash Redis, or Vercel Firewall rules.
- **`x-forwarded-for` is trusted.** Correct behind Vercel. Behind another host, confirm that the proxy overwrites it.
- **Spam protection stops simple bots only.** Add Cloudflare Turnstile if spam becomes a problem.
- **No authenticated features.** Authentication testing does not apply, because nothing requires login.
- **MDX is trusted content.** Articles come from this repository. Never render MDX from visitors.

## Dependency upkeep

Run `npm audit --omit=dev` before each release, and update Next.js promptly when security releases appear.
