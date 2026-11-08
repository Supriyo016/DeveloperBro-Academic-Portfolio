export type EvidenceLevel = "dissertation" | "ongoing" | "coursework" | "interest";

export interface WorkRef {
  type: "research" | "project" | "article";
  slug: string;
}

export interface ResearchArea {
  id: string;
  name: string;
  evidence: EvidenceLevel;
  summary: string;
  problems: string[];
  techniques: string[];
  directions: string[];
  related: WorkRef[];
}

export type ResearchStatus = "Completed" | "In progress";

export interface Reference {
  text: string;
  url: string;
}

export interface Citation {
  plain: string;
  bibtex: string;
}

export interface ResultStat {
  value: string;
  label: string;
}

export interface FigureAsset {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface ResearchStudy {
  slug: string;
  title: string;
  shortTitle: string;
  kind: "M.Tech dissertation" | "B.Tech dissertation" | "Ongoing research";
  /** Art shown beside the title on the study page */
  hero?: "mri" | "quantum" | "distill";
  status: ResearchStatus;
  period: string;
  institution?: string;
  supervisors?: string[];
  abstract: string;
  domains: string[];
  methods: string[];
  technologies: string[];
  motivation?: string[];
  problem?: string;
  questions?: string[];
  gaps?: { title: string; body: string }[];
  objectives?: string[];
  dataset?: {
    summary: string;
    source: { label: string; href: string };
    classes: { name: string; total: number; train: number; test: number }[];
  };
  models?: { name: string; role: string; detail: string }[];
  algorithms?: { name: string; detail: string }[];
  metrics?: string[];
  contributions?: string[];
  references?: Reference[];
  citation?: Citation;
  methodology?: { title: string; body: string }[];
  setup?: { label: string; value: string }[];
  stats?: ResultStat[];
  findings?: string[];
  limitations?: string[];
  future?: string[];
  figures?: FigureAsset[];
  conclusions?: string[];
  note?: { title: string; body: string };
  links?: { label: string; href: string }[];
}

export type PublicationStatus = "Published" | "Accepted" | "Under Review" | "Preprint" | "In Progress";

export interface Publication {
  title: string;
  status: PublicationStatus;
  authors: string[];
  venue?: string;
  year?: number;
  summary?: string;
  doi?: string;
  url?: string;
  researchSlug?: string;
}

export type ProjectCategory =
  | "Research Projects"
  | "Machine Learning"
  | "Deep Learning"
  | "Federated Learning"
  | "Medical Image Analysis"
  | "Quantum Computing"
  | "Web Development"
  | "Embedded Systems";

export type ProjectKind = "Research project" | "Academic project" | "Personal project";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  featured: boolean;
  kind: ProjectKind;
  categories: ProjectCategory[];
  tech: string[];
  overview: string[];
  problem?: string;
  objectives?: string[];
  architecture?: { title: string; body: string }[];
  highlights?: string[];
  implementation?: string[];
  learning?: string[];
  repo?: string;
  repoName?: string;
  live?: string;
  demo?: string;
  researchSlug?: string;
  image?: FigureAsset;
}

export interface TimelineEvent {
  id: string;
  period: string;
  kind: "degree" | "research" | "project";
  title: string;
  org?: string;
  detail?: string;
  result?: string;
  href?: string;
}

export interface Skill {
  name: string;
  usedIn?: WorkRef[];
}

export interface SkillGroup {
  id: string;
  name: string;
  blurb: string;
  skills: Skill[];
}

export interface Achievement {
  title: string;
  detail: string;
  year: string;
  group: "Academic achievements" | "Competitive examinations" | "Hackathons";
  href?: string;
}

export interface Course {
  title: string;
  platform: "NPTEL" | "Udemy";
  /** As written on the course list, e.g. "3+1" or "1 or 2" */
  credits: string;
  duration: string;
  verifyUrl: string;
  /** Year completed */
  year: string;
  topic: "Programming" | "Machine Learning" | "Data Science" | "Web Development" | "Professional Skills";
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  references: { text: string; url: string }[];
  readingMinutes: number;
}
