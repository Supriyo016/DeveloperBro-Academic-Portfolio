import { profile } from "@/content/profile";
import { getArticleMetas } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getArticleMetas()
    .map((article) => {
      const url = `${siteUrl}/blogs/${article.slug}`;
      return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(article.description)}</description></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(profile.siteName)} research notes</title><link>${siteUrl}/blogs</link><description>Research notes by ${escapeXml(profile.name)}</description>${items}</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
