import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { formatDate, getPosts } from "../lib/blog";
import { pageMetadata } from "../lib/site";
import styles from "../components/content.module.css";
import blog from "./blog.module.css";

export const metadata = pageMetadata({
  title: "Blog",
  description: "News, updates, and technical writing from the Stellarium project.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={`${styles.hero} ${blog.hero}`}>
        <div>
          <p className={styles.kicker}>Participate / Blog</p>
          <h1>Blog</h1>
          <p className={styles.lead}>News, updates, and technical writing from the people building Stellarium.</p>
        </div>
      </section>

      <section className={styles.section}>
        {posts.length === 0 ? (
          <p className={blog.empty}>No posts yet.</p>
        ) : (
          <ol className={blog.list}>
            {posts.map((post) => (
              <li key={post.slug}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <div>
                  <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p>{post.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
