// Facts the chat assistant may use. Everything is drawn from the site's own content files,
// so the assistant can never say more than the site already says.
import { timeline } from "@/content/education";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { studies } from "@/content/research";
import { skillGroups } from "@/content/skills";
import type { ArticleMeta } from "@/types/content";

export interface KnowledgeArticle {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  date: string;
}

export interface Knowledge {
  name: string;
  firstName: string;
  role: string;
  shortBio: string;
  openTo: string;
  email: string;
  cvPath: string;
  social: { label: string; url: string }[];
  languages: string[];
  hobbies: string[];
  supervisors: string[];
  studies: { slug: string; title: string; kind: string; period: string; institution?: string }[];
  projects: { slug: string; title: string; tagline: string; tech: string[]; repo?: string; live?: string; demo?: string }[];
  degrees: { title: string; org: string; period: string }[];
  skills: { group: string; names: string[] }[];
  articles: KnowledgeArticle[];
}

export function buildKnowledge(articles: ArticleMeta[]): Knowledge {
  const mtech = studies.find((study) => study.slug === "federated-alzheimers-detection");
  return {
    name: profile.name,
    firstName: profile.name.split(" ")[0] ?? profile.name,
    role: profile.role,
    shortBio: profile.shortBio,
    openTo: profile.openTo,
    email: profile.email,
    cvPath: profile.cvPath,
    social: profile.social.map(({ label, url }) => ({ label, url })),
    languages: profile.languages.map((language) => language.name),
    hobbies: [...profile.hobbies],
    supervisors: [...(mtech?.supervisors ?? [])],
    studies: studies.map(({ slug, title, kind, period, institution }) => ({ slug, title, kind, period, institution })),
    projects: projects.map(({ slug, title, tagline, tech, repo, live, demo }) => ({ slug, title, tagline, tech: [...tech], repo, live, demo })),
    degrees: timeline.filter((event) => event.kind === "degree").map((event) => ({ title: event.title, org: event.org ?? "", period: event.period })),
    skills: skillGroups.map((group) => ({ group: group.name, names: group.skills.map((skill) => skill.name) })),
    articles: articles.map(({ slug, title, description, tags, category, date }) => ({ slug, title, description, tags, category, date })),
  };
}
