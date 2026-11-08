import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Search engines may index the site. Crawlers that collect training data for AI models are asked to stay away,
// in line with section 3(e) of the LICENSE. robots.txt is a request, not an enforcement mechanism.
const AI_TRAINING_CRAWLERS = ["GPTBot", "ClaudeBot", "anthropic-ai", "CCBot", "Google-Extended", "Applebot-Extended", "Bytespider", "meta-externalagent", "PerplexityBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_TRAINING_CRAWLERS, disallow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
