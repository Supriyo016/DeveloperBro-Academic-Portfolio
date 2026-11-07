import { projects } from "@/content/projects";
import { studies } from "@/content/research";
import { getArticleMetas } from "@/lib/articles";
import type { SearchItem } from "@/lib/search";
import { primaryNav, secondaryNav } from "@/lib/site";

export function buildSearchIndex(): SearchItem[] {
  return [
    ...studies.map((study) => ({
      title: study.shortTitle,
      href: `/research/${study.slug}`,
      kind: "Research" as const,
      text: [study.title, study.abstract, ...study.domains, ...study.methods, ...study.technologies].join(" "),
    })),
    ...projects.map((project) => ({
      title: project.title,
      href: `/projects/${project.slug}`,
      kind: "Project" as const,
      text: [project.tagline, ...project.tech, ...project.categories].join(" "),
    })),
    ...getArticleMetas().map((article) => ({
      title: article.title,
      href: `/blogs/${article.slug}`,
      kind: "Article" as const,
      text: [article.description, article.category, ...article.tags].join(" "),
    })),
    ...[...primaryNav, ...secondaryNav].map((item) => ({ title: item.label, href: item.href, kind: "Page" as const, text: "" })),
  ];
}
