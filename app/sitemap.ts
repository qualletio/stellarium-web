import type { MetadataRoute } from "next";
import { navSections } from "./components/nav-data";
import { siteUrl } from "./lib/site";

// Pages marked noindex until they have real content.
const unlisted = new Set(["/governance"]);

// Built from the nav so new pages are listed as soon as they're linked.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set(["/"]);
  for (const section of navSections) {
    for (const item of section.items) {
      if (!item.external && !item.soon && !item.href.includes("#") && !unlisted.has(item.href)) paths.add(item.href);
    }
  }
  return [...paths].map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
