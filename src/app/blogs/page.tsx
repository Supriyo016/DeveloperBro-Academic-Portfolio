import type { Metadata } from "next";
import { ArticleList } from "@/components/blogs/ArticleList";
import { ReadingScene } from "@/components/illustrations/scenes-people";
import { PageHeader } from "@/components/ui/primitives";
import { getArticleMetas } from "@/lib/articles";
import { rssAlternate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Technical notes on federated learning, homomorphic encryption and deep learning.",
  alternates: { canonical: "/blogs", types: rssAlternate },
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blogs"
        title="Blogs and research notes"
        intro="Short technical notes on what I am working through, including what my experiments do not show."
        illustration={<ReadingScene />}
      />
      <div className="container-page">
        <ArticleList articles={getArticleMetas()} />
      </div>
    </>
  );
}
