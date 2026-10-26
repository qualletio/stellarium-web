import { readdir } from "node:fs/promises";
import path from "node:path";
import type { MDXContent } from "mdx/types";

// Each post is content/blog/<slug>.mdx and exports its metadata:
//   export const metadata = { title: "...", description: "...", date: "2026-10-25" }
const postsDir = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  title: string;
  description: string;
  // ISO date (YYYY-MM-DD), so posts sort as plain strings.
  date: string;
  author?: string;
};

export type Post = PostMeta & { slug: string };

export async function getPostSlugs(): Promise<string[]> {
  const files = await readdir(postsDir);
  return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));
}

export async function loadPost(slug: string): Promise<{ Content: MDXContent; meta: PostMeta }> {
  const mod = await import(`@/content/blog/${slug}.mdx`);
  const meta = mod.metadata as PostMeta | undefined;
  if (!meta?.title || !meta.description || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? "")) {
    throw new Error(`content/blog/${slug}.mdx must export metadata with a title, description, and YYYY-MM-DD date`);
  }
  return { Content: mod.default, meta };
}

// All posts, most recent first.
export async function getPosts(): Promise<Post[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(async (slug) => ({ slug, ...(await loadPost(slug)).meta })));
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

// Format at UTC so a YYYY-MM-DD date never shifts a day with the server's timezone.
export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
