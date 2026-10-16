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
          <p className={styles.kicker}>404 / Lost in space</p>
          <h1>Page not<br /><em>found.</em></h1>
          <p className={styles.lead}>This page doesn&apos;t exist or has moved. Try one of these instead.</p>
          <div className={styles.actions}>
            <Link className={styles.button} href="/">Go home <span>→</span></Link>
            <Link className={styles.textLink} href="/learn">What is Stellarium?</Link>
            <Link className={styles.textLink} href="/build">Run a node</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
