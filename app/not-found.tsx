import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import styles from "./components/content.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Error 404</p>
          <h1>Page not found</h1>
          <p className={styles.lead}>This page doesn&apos;t exist or has moved.</p>
          <div className={styles.actions}>
            <Link className={styles.button} href="/">Home <span aria-hidden="true">→</span></Link>
            <Link className={styles.textLink} href="/learn">What is Stellarium?</Link>
            <Link className={styles.textLink} href="/build">Run a node</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
