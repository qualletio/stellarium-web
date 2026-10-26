import Link from "next/link";
import JsonLd from "../../components/JsonLd";
import SiteFooter from "../../components/SiteFooter";
import SiteNav from "../../components/SiteNav";
import { formatDate, getPostSlugs, loadPost } from "../../lib/blog";
import { pageMetadata, siteUrl } from "../../lib/site";
import styles from "../../components/content.module.css";
import blog from "../blog.module.css";

// Only posts that exist in content/blog are routable; anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { meta } = await loadPost(slug);
  const metadata = pageMetadata({ title: meta.title, description: meta.description, path: `/blog/${slug}` });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: meta.date } };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { Content, meta } = await loadPost(slug);

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    url: `${siteUrl}/blog/${slug}`,
    ...(meta.author && { author: { "@type": "Person", name: meta.author } }),
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <article>
        <header className={`${styles.hero} ${blog.hero}`}>
          <div>
            <p className={styles.kicker}><Link className={blog.kickerLink} href="/blog">Blog</Link> / <time dateTime={meta.date}>{formatDate(meta.date)}</time></p>
            <h1 className={blog.title}>{meta.title}</h1>
            <p className={styles.lead}>{meta.description}</p>
            {meta.author && <p className={blog.byline}>By {meta.author}</p>}
          </div>
        </header>

        <div className={`${styles.section} ${blog.articleSection}`}>
          <div className={blog.prose}>
            <Content />
          </div>
          <p className={blog.back}><Link href="/blog">← All posts</Link></p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
