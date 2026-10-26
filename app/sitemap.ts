import type { MetadataRoute } from "next";
import { navSections } from "./components/nav-data";
import { getPosts } from "./lib/blog";
import { siteUrl } from "./lib/site";

// Pages marked noindex until they have real content.
const unlisted = new Set(["/governance"]);

// Built from the nav so new pages are listed as soon as they're linked, plus every blog post.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = new Set(["/"]);
  for (const section of navSections) {
    for (const item of section.items) {
      if (!item.external && !item.soon && !item.href.includes("#") && !unlisted.has(item.href)) paths.add(item.href);
    }
  }
  const pages: MetadataRoute.Sitemap = [...paths].map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
  const posts: MetadataRoute.Sitemap = (await getPosts()).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
