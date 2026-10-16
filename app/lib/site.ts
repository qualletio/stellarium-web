import type { Metadata } from "next";

export const siteUrl = "https://stellarium.sh";
export const siteName = "Stellarium";
export const siteTagline = "The programmable API network";
export const siteDescription =
  "Stellarium is a decentralized, programmable API network. Host an API on your own node, monetize it, and compose APIs with RequestScript.";

type PageMetadataInput = {
  // Rendered through the root layout's "%s | Stellarium" template unless `absoluteTitle` is set.
  title: string;
  absoluteTitle?: boolean;
  description: string;
  path: `/${string}`;
  // Set when the route has its own opengraph-image file; an explicit image would override it.
  ownImage?: boolean;
};

// Page metadata with a canonical URL and matching Open Graph fields.
// openGraph is merged shallowly, so each page has to restate the shared fields, including
// the root social image.
export function pageMetadata({ title, absoluteTitle, description, path, ownImage }: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteName}`;
  // Leave the key out entirely: even `images: undefined` hides the route's own image file.
  const image = ownImage ? {} : { images: "/opengraph-image" };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName, locale: "en_US", url: path, title: fullTitle, description, ...image },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...image },
  };
}
