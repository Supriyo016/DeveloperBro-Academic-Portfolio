# Deployment

The site needs a Node runtime because pages render per request and the contact form has an API route. GitHub Pages
cannot host it.

## Current deployment

Live at https://developerbro.vercel.app, in Vercel project `developerbro` under team `supriyo016`.

Deployed from this folder with the Vercel CLI, with no Git connection, so a push does not redeploy. To publish a change:

```bash
npx vercel@latest deploy --prod --scope supriyo016
```

`vercel.json` declares the Next.js framework. Without it, a project created from the CLI serves only `public/` and
every page returns 404. `.vercelignore` keeps docs, tests and private files out of the upload.

If a deploy stops with `fetch failed`, the network may be offering an IPv6 route that does not work. Set
`NODE_OPTIONS=--dns-result-order=ipv4first` for that command.

To set a variable from PowerShell, use `--value` rather than a pipe. A pipe adds invisible characters that break the build.

## Connecting GitHub (optional)

For automatic deploys, push this repository to GitHub, confirm `docs/private/` and `private/` are absent from the
remote, and connect it in the Vercel project settings.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs and sitemap |
| `RESEND_API_KEY` | For contact form | Resend key, send-only permission |
| `CONTACT_TO_EMAIL` | For contact form | Where messages arrive |
| `CONTACT_FROM_EMAIL` | For contact form | Verified Resend sender |
| `GITHUB_TOKEN` | No | Raises API limits. Use a fine-grained token with no extra permissions |

Keep all of these in the host's secret settings. Only `NEXT_PUBLIC_SITE_URL` reaches the browser.

## After deploying

- Send a test message through the contact form.
- Check the headers at the live URL. `Strict-Transport-Security` appears only over HTTPS.
- Download the CV and confirm it is the public copy.
- Submit `/sitemap.xml` to Google Search Console.
- Only add the HSTS preload list entry if you are sure every subdomain will stay on HTTPS.

## Old site

`supriyo016.github.io/DeveloperBro._Portfolio_Website` stays live until you change it. Consider pointing it at
the new domain once this is deployed.
