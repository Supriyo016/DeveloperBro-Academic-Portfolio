// Compiles every article with the same remark plugins as the site, to catch MDX syntax errors quickly.
// Usage: node scripts/check-mdx.mjs
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const dir = path.join(process.cwd(), "src/content/articles");
const allowed = new Set(["BarChart", "LineChart", "Flow", "Callout", "Stats", "Figure"]);
let failed = 0;

for (const file of readdirSync(dir).filter((name) => name.endsWith(".mdx"))) {
  const { content } = matter(readFileSync(path.join(dir, file), "utf8"));
  try {
    await compile(content, { remarkPlugins: [remarkGfm, remarkMath] });
    const unknown = [...content.replace(/```[\s\S]*?```/g, "").matchAll(/<([A-Z][A-Za-z]*)/g)].map((m) => m[1]).filter((name) => !allowed.has(name));
    if (unknown.length) throw new Error(`unknown components: ${[...new Set(unknown)].join(", ")}`);
    if (/=\{/.test(content.replace(/```[\s\S]*?```/g, ""))) throw new Error("JavaScript expression in a prop");
  } catch (error) {
    failed += 1;
    console.error(`${file}: ${error.message}`);
  }
}
console.log(failed ? `${failed} file(s) failed` : "All articles compile");
process.exit(failed ? 1 : 0);
