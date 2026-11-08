import { describe, expect, it } from "vitest";
import { filterArticles } from "@/components/blogs/ArticleList";
import { runCommand } from "@/components/fun/Terminal";
import { filterProjects } from "@/components/projects/ProjectExplorer";
import { filterExplorerItems } from "@/components/research/ResearchExplorer";
import { connectedNodes } from "@/components/research/ResearchMap";
import { projects } from "@/content/projects";
import { estimateReadingMinutes, extractHeadings, getAdjacentArticles, getArticleMetas, getArticles, getRelatedArticles } from "@/lib/articles";
import { selectRepos, type GithubRepo } from "@/services/github";
import { searchItems } from "@/lib/search";
import { buildSearchIndex } from "@/lib/search-index";

describe("articles", () => {
  it("loads and sorts articles newest first", () => {
    const dates = getArticles().map((article) => article.date);
    expect(dates.length).toBeGreaterThanOrEqual(3);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("extracts level two and three headings", () => {
    expect(extractHeadings("## One Two\n\ntext\n\n### Three\n\n#### Four")).toEqual([
      { id: "one-two", text: "One Two", level: 2 },
      { id: "three", text: "Three", level: 3 },
    ]);
  });

  it("ignores code when estimating reading time", () => {
    const words = "word ".repeat(440);
    expect(estimateReadingMinutes(words)).toBe(2);
    expect(estimateReadingMinutes(`${words}\n\`\`\`\n${"code ".repeat(4000)}\n\`\`\``)).toBe(2);
  });

  it("keeps non-ASCII letters in heading ids and skips comments inside code", () => {
    expect(extractHeadings("## What α = 0.5 produced")[0]?.id).toBe("what-α--05-produced");
    expect(extractHeadings("```python\n## not a heading\n```\n\n## Real")).toEqual([{ id: "real", text: "Real", level: 2 }]);
  });

  it("excludes the current article from related notes", () => {
    const [first] = getArticleMetas();
    if (!first) throw new Error("expected articles");
    expect(getRelatedArticles(first).map((item) => item.slug)).not.toContain(first.slug);
  });

  it("orders previous and next by date", () => {
    const [newest, middle, oldest] = getArticleMetas();
    if (!newest || !middle || !oldest) throw new Error("expected three articles");
    expect(getAdjacentArticles(middle.slug).next?.slug).toBe(newest.slug);
    expect(getAdjacentArticles(middle.slug).previous?.slug).toBe(oldest.slug);
    expect(getAdjacentArticles(newest.slug).next).toBeUndefined();
  });

  it("filters by category, tag and query", () => {
    const all = getArticleMetas();
    const privacy = filterArticles(all, "", "Privacy", null);
    expect(privacy.length).toBeGreaterThan(0);
    expect(privacy.every((article) => article.category === "Privacy")).toBe(true);
    expect(privacy).toHaveLength(all.filter((article) => article.category === "Privacy").length);
    const nonIid = filterArticles(all, "", null, "Non-IID data");
    expect(nonIid.length).toBeGreaterThan(1);
    expect(nonIid.every((article) => article.tags.includes("Non-IID data"))).toBe(true);
    const dirichlet = filterArticles(all, "dirichlet", null, null).map((article) => article.slug);
    expect(dirichlet).toContain("what-non-iid-looks-like");
    expect(dirichlet).toContain("dirichlet-alpha-playground");
    expect(filterArticles(all, "", "Privacy", "Non-IID data").every((article) => article.category === "Privacy" && article.tags.includes("Non-IID data"))).toBe(true);
    expect(filterArticles(all, "no such thing", null, null)).toHaveLength(0);
  });
});

describe("project filters", () => {
  it("filters by category, technology and text", () => {
    expect(filterProjects(projects, "", "All", null)).toHaveLength(projects.length);
    expect(filterProjects(projects, "", "Web Development", null).map((project) => project.slug)).toEqual(["tour-india", "developerbro-academic-portfolio"]);
    expect(filterProjects(projects, "", "All", "Arduino Uno").map((project) => project.slug)).toEqual(["third-hand-eye"]);
    expect(filterProjects(projects, "travel", "All", null).map((project) => project.slug)).toEqual(["tour-india"]);
  });
});

describe("research explorer", () => {
  const items = [
    { title: "A", href: "/a", kind: "x", summary: "alpha", domains: ["FL"], methods: ["CKKS"], technologies: ["Python"], statuses: ["Completed"] },
    { title: "B", href: "/b", kind: "x", summary: "beta", domains: ["QC"], methods: [], technologies: ["Python"], statuses: ["In progress"] },
  ];

  it("combines facets with AND", () => {
    expect(filterExplorerItems(items, "", { technologies: "Python" })).toHaveLength(2);
    expect(filterExplorerItems(items, "", { technologies: "Python", domains: "QC" }).map((item) => item.title)).toEqual(["B"]);
    expect(filterExplorerItems(items, "alpha", {})).toHaveLength(1);
    expect(filterExplorerItems(items, "", { statuses: "In progress" }).map((item) => item.title)).toEqual(["B"]);
  });
});

describe("global search", () => {
  const index = buildSearchIndex();

  it("covers research, projects, articles and pages", () => {
    expect(new Set(index.map((item) => item.kind))).toEqual(new Set(["Research", "Project", "Article", "Page"]));
  });

  it("ranks title matches and requires every term", () => {
    expect(searchItems(index, "arduino")[0]?.href).toBe("/projects/third-hand-eye");
    expect(searchItems(index, "ckks federated").length).toBeGreaterThan(0);
    expect(searchItems(index, "ckks zzzz")).toEqual([]);
    expect(searchItems(index, "   ")).toEqual([]);
  });
});

describe("research map", () => {
  it("traces forwards and backwards from a node", () => {
    const reached = connectedNodes("m-gates");
    expect(reached.has("w-qc")).toBe(true);
    expect(reached.has("a-qc")).toBe(true);
    expect(reached.has("w-kd")).toBe(false);
  });
});

describe("terminal", () => {
  it("navigates only to known pages", () => {
    expect(runCommand("open research").navigate).toBe("/research");
    expect(runCommand("open //evil.example").navigate).toBeUndefined();
    expect(runCommand("cd cv").navigate).toBe("/cv");
  });

  it("handles unknown and empty input", () => {
    expect(runCommand("").output).toEqual([]);
    expect(runCommand("rm -rf /").output[0]).toContain("Command not found");
    expect(runCommand("clear").clear).toBe(true);
  });
});

describe("GitHub repository selection", () => {
  const repo = (name: string, pushed: string, fork = false): GithubRepo => ({
    name,
    html_url: `https://github.com/x/${name}`,
    description: null,
    language: null,
    stargazers_count: 0,
    forks_count: 0,
    fork,
    pushed_at: pushed,
  });

  it("drops forks and the empty repository, newest first", () => {
    const result = selectRepos([repo("old", "2023-01-01"), repo("fork", "2026-01-01", true), repo("renuka-medical-store", "2026-02-01"), repo("new", "2024-01-01")]);
    expect(result.map((item) => item.name)).toEqual(["new", "old"]);
  });
});
