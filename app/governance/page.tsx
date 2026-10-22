import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import Spec from "../components/Spec";
import { links } from "../components/nav-data";
import { pageMetadata } from "../lib/site";
import styles from "../components/content.module.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Governance",
    description: "Stellarium's governance team is forming. Join the Discord to help decide how the decentralized API network and RequestScript evolve.",
    path: "/governance",
  }),
  // Placeholder page: keep it out of search results until it has real content.
  robots: { index: false, follow: true },
};

export default function GovernancePage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Participate / Governance</p>
          <h1>Governance</h1>
          <p className={styles.lead}>A governance team is being formed to make decisions about the direction of Stellarium and RequestScript. If you want to be involved, say so on Discord.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Governance status" items={[
          ["Status", "Forming"],
          ["Discussion", <a key="d" href={links.discord} target="_blank" rel="noreferrer">Discord</a>],
          ["Proposals", <Link key="s" href="/sips">SIPs</Link>],
        ]} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>Scope</p><h2>What governance is for</h2></div>
        <div className={styles.body}>
          <p>Governance will be where the people invested in Stellarium discuss changes and decide on the project&apos;s direction. The team is being formed now, and that discussion is happening on Discord.</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
