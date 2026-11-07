import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { studies } from "@/content/research";
import { getArticleMetas } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/research", "/publications", "/projects", "/education", "/skills", "/achievements", "/blogs", "/github", "/cv", "/contact", "/cookies"];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
    ...studies.map((study) => ({ url: `${siteUrl}/research/${study.slug}` })),
    ...projects.map((project) => ({ url: `${siteUrl}/projects/${project.slug}` })),
    ...getArticleMetas().map((article) => ({ url: `${siteUrl}/blogs/${article.slug}`, lastModified: article.updated ?? article.date })),
  ];
}
