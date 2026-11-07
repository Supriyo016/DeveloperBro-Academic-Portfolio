import { compileMDX } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "@/components/blogs/CodeBlock";
import { mdxBlocks } from "@/components/blogs/MdxBlocks";

export async function renderArticle(source: string) {
  const { content } = await compileMDX({
    source,
    components: { pre: CodeBlock, ...mdxBlocks },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeSlug, rehypeKatex, [rehypePrettyCode, { theme: { light: "github-light-high-contrast", dark: "github-dark" }, keepBackground: false }]],
      },
    },
  });
  return content;
}
