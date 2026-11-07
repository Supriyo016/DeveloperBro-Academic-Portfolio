import { getProject } from "@/content/projects";
import { getStudy } from "@/content/research";
import { getArticle } from "@/lib/articles";
import type { WorkRef } from "@/types/content";

export interface ResolvedWork {
  title: string;
  href: string;
  type: WorkRef["type"];
}

export function resolveWork(ref: WorkRef): ResolvedWork {
  const found =
    ref.type === "research"
      ? { title: getStudy(ref.slug)?.shortTitle, href: `/research/${ref.slug}` }
      : ref.type === "project"
        ? { title: getProject(ref.slug)?.title, href: `/projects/${ref.slug}` }
        : { title: getArticle(ref.slug)?.title, href: `/blogs/${ref.slug}` };
  if (!found.title) throw new Error(`Unknown ${ref.type} reference: ${ref.slug}`);
  return { title: found.title, href: found.href, type: ref.type };
}
