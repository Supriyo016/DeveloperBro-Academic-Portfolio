# Content sources

Every factual claim on the site traces to one of these sources. If something cannot be traced, it does not go on the site.

| Content | Source | Notes |
| --- | --- | --- |
| Education, CGPA, marks, courses, achievements, languages, hobbies | Academic CV, dated 6 November 2026 | Treated as the primary source |
| Dissertation titles | Academic CV | |
| M.Tech metrics | Saved dissertation notebooks | Generated into `src/content/data/alzheimers-results.json`, never typed by hand |
| M.Tech method, dataset counts, hyperparameters, gaps, future work | Dissertation source | Only where notebooks agree |
| Client partition | Dissertation table, confirmed by notebook logs | |
| References | Dissertation bibliography, checked against arXiv and DOI | One bibliography entry was wrong. See below |
| Ongoing distillation work | Owner approved listing the topic | No results on the research pages. Preliminary run outputs appear only in blog posts, labelled as such |
| Blog posts (29) | Thesis `main.tex`, the three thesis notebooks, `Research Paper\research-paperv1.ipynb` and its saved runs in `Research Paper\Versions`, cited papers | Every number is from a notebook output, the thesis, a cited paper, or a small simulation whose code is in the post |
| Blog dates | Chosen to match when each piece of work happened | Posts were written in November 2026. See `docs/private/CONTENT_REVIEW.md` |
| Third Hand-Eye details | Repository README, circuit diagram and source code | Pins, threshold and formula read from the code |
| Tour India details | Repository pages and README | Features limited to what the pages show |
| Social accounts | GitHub profile `social_accounts` API for Facebook, Instagram and X. CV for LinkedIn and GitHub | All belong to the verified GitHub account |
| GitHub statistics | Live GitHub API, cached hourly | Hidden if unavailable |

## Status labels

- **Completed**: submitted dissertations and finished projects.
- **In progress**: the distillation work.
- **Proposed**: directions listed under Proposed research. Nothing has been done on these.
- **Published**: nothing is labelled published, because nothing has been verified as published.

## Deliberately left out

These are hidden rather than invented. Add them to the data files if the facts exist.

- Challenges and learning outcomes for each project (`learning` field)
- Certificate verification links
- Dissertation PDF and public dissertation code
- Results, figures and detail for the B.Tech dissertation, whose source files were not found
- Results of the distillation work
- Thesis cost figures, timings, ANOVA and t-test values, which have no notebook source

## Corrections

Corrections made during the content audit, and how the public CV was produced, are recorded in `docs/private/`, which
is not part of the public repository. The public CV is built from the private original by a script kept in `private/`.
