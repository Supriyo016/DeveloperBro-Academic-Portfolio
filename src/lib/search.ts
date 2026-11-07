export interface SearchItem {
  title: string;
  href: string;
  kind: "Research" | "Project" | "Article" | "Page";
  text: string;
}

export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const body = item.text.toLowerCase();
      const matched = terms.every((term) => title.includes(term) || body.includes(term));
      const score = terms.filter((term) => title.includes(term)).length;
      return { item, matched, score };
    })
    .filter((entry) => entry.matched)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
