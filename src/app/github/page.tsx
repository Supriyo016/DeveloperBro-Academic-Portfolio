import { GitFork, Star } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CodeScene } from "@/components/illustrations/scenes-objects";
import { Badge, ExternalLink, PageHeader } from "@/components/ui/primitives";
import { profile } from "@/content/profile";
import { getGithubSnapshot } from "@/services/github";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "GitHub",
  description: "Public repositories of Supriyo Sarkar, fetched live from GitHub.",
  alternates: { canonical: "/github" },
};

function RepoSkeleton() {
  return (
    <ul className="grid gap-4 md:grid-cols-2" aria-label="Loading repositories">
      {[0, 1, 2, 3].map((item) => (
        <li key={item} className="card h-40 animate-pulse bg-surface-2" />
      ))}
    </ul>
  );
}

async function Repositories() {
  const snapshot = await getGithubSnapshot();

  if (!snapshot) {
    return (
      <div className="card p-6">
        <p className="font-medium">GitHub data is unavailable right now.</p>
        <p className="mt-1 text-ink-2">
          You can still browse my repositories directly on <ExternalLink href={profile.github}>GitHub</ExternalLink>.
        </p>
      </div>
    );
  }

  return (
    <>
      <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-3">
        <div>
          <dd className="text-3xl font-medium">{snapshot.user.public_repos}</dd>
          <dt className="text-sm text-muted">Public repositories</dt>
        </div>
        <div>
          <dd className="text-3xl font-medium">{snapshot.user.followers}</dd>
          <dt className="text-sm text-muted">Followers</dt>
        </div>
      </dl>
      <ul className="grid gap-4 md:grid-cols-2">
        {snapshot.repos.map((repo) => (
          <li key={repo.name} className="card flex flex-col p-5">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-serif text-xl leading-snug break-words hover:text-primary">
              {repo.name.replace(/[-_]/g, " ")}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {repo.description && <p className="mt-1.5 flex-1 text-[0.95rem] text-ink-2">{repo.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              {repo.language && <Badge>{repo.language}</Badge>}
              <span className="inline-flex items-center gap-1"><Star className="size-3.5" aria-hidden /> {repo.stargazers_count}<span className="sr-only"> stars</span></span>
              <span className="inline-flex items-center gap-1"><GitFork className="size-3.5" aria-hidden /> {repo.forks_count}<span className="sr-only"> forks</span></span>
              <span>Updated {formatDate(repo.pushed_at.slice(0, 10))}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function GithubPage() {
  return (
    <>
      <PageHeader
        eyebrow="GitHub"
        title="Public repositories"
        illustration={<CodeScene />}
        intro={
          <>
            Live from the GitHub API and refreshed hourly. My dissertation code is not public yet, so this shows earlier work. <ExternalLink href={profile.github}>@{profile.githubUser}</ExternalLink>
          </>
        }
      />
      <div className="container-page">
        <Suspense fallback={<RepoSkeleton />}>
          <Repositories />
        </Suspense>
      </div>
    </>
  );
}
