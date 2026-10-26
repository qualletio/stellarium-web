import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Required by @next/mdx in the App Router. Article typography lives in blog.module.css.
const components: MDXComponents = {
  // Client-side navigation for internal links; external links open in a new tab.
  a: ({ href = "", ...props }) =>
    href.startsWith("/") || href.startsWith("#")
      ? <Link href={href} {...props} />
      : <a href={href} target="_blank" rel="noreferrer" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
