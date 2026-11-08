import { z } from "zod";
import { profile } from "@/content/profile";

const API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;
const TIMEOUT_MS = 5000;

const excludedRepos = new Set(["renuka-medical-store"]);

const userSchema = z.object({
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
});

const repoSchema = z.object({
  name: z.string(),
  html_url: z.url({ protocol: /^https?$/ }),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  fork: z.boolean(),
  pushed_at: z.string(),
});

export type GithubRepo = z.infer<typeof repoSchema>;

export interface GithubSnapshot {
  user: z.infer<typeof userSchema>;
  repos: GithubRepo[];
}

async function githubGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "academic-portfolio",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
  return schema.parse(await response.json());
}

export function selectRepos(repos: GithubRepo[]): GithubRepo[] {
  return repos
    .filter((repo) => !repo.fork && !excludedRepos.has(repo.name))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
}

export async function getGithubSnapshot(): Promise<GithubSnapshot | null> {
  try {
    const [user, repos] = await Promise.all([
      githubGet(`/users/${profile.githubUser}`, userSchema),
      githubGet(`/users/${profile.githubUser}/repos?per_page=100&sort=pushed`, z.array(repoSchema)),
    ]);
    return { user, repos: selectRepos(repos) };
  } catch (error) {
    console.error("GitHub data unavailable:", error instanceof Error ? error.message : "unknown error");
    return null;
  }
}
