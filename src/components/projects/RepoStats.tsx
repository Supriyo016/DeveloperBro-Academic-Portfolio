import { GitFork, Star } from "lucide-react";
import { getGithubSnapshot } from "@/lib/github";
import { formatDate } from "@/lib/utils";

export async function RepoStats({ name }: { name: string }) {
  const snapshot = await getGithubSnapshot();
  const repo = snapshot?.repos.find((item) => item.name === name);

  if (!repo) return <p className="mt-4 text-sm text-muted">Live repository data is unavailable right now.</p>;

  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      {repo.language && <span>{repo.language}</span>}
      <span className="inline-flex items-center gap-1"><Star className="size-3.5" aria-hidden /> {repo.stargazers_count}<span className="sr-only"> stars</span></span>
      <span className="inline-flex items-center gap-1"><GitFork className="size-3.5" aria-hidden /> {repo.forks_count}<span className="sr-only"> forks</span></span>
      <span>Repository updated {formatDate(repo.pushed_at.slice(0, 10))}</span>
    </p>
  );
}
