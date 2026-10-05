import type { Metadata } from "next";
import styles from "./page.module.css";

const sipDocument = "https://docs.google.com/document/d/1MSVPcHKmmP9lRa1CXqlPdnbkIMZDpEetcxoOmNtkeXA/edit?usp=sharing";

export const metadata: Metadata = {
  title: "SIPs — Stellarium Improvement Proposals",
  description: "Guidelines for Stellarium Improvement Proposals.",
};

const StarMark = () => (
  <svg className={styles.starMark} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 2v44M2 24h44" stroke="currentColor" strokeWidth="1.5" />
    <path d="m7 7 34 34M41 7 7 41" stroke="currentColor" strokeWidth="1" opacity=".45" />
    <circle cx="24" cy="24" r="5.5" fill="currentColor" />
  </svg>
);

export default function SipsPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Main navigation">
        <a className={styles.brand} href="/"><StarMark /><span>stellarium</span></a>
        <div className={styles.navLinks}><a href="/#network">Network</a><a href="/#build">Developers</a><a className={styles.active} href="/sips">SIPs</a></div>
        <a className={styles.navCta} href={sipDocument} target="_blank" rel="noreferrer">View canonical doc <span>↗</span></a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true"><div className={styles.ringOne} /><div className={styles.ringTwo} /><div className={styles.spark}>✦</div><div className={styles.sipBadge}>SIP<br /><b>001</b></div></div>
        <div><p className={styles.kicker}>Community governance / living guide</p><h1>Stellarium<br /><em>Improvement</em><br />Proposals</h1><p className={styles.summary}>A clear path for proposing thoughtful improvements to the Stellarium network.</p><a className={styles.documentLink} href={sipDocument} target="_blank" rel="noreferrer">Open the enshrined document <span>↗</span></a></div>
      </section>

      <section className={styles.guidelines}>
        <aside><span>BASICS</span><b>01 — 04</b><i /></aside>
        <div className={styles.items}>
          <article><span>01</span><div><h2>What is a Stellarium Improvement Proposal?</h2><p>A Stellarium Improvement Proposal, or SIPs for short, is a technical document that seeks to improve some aspects of the Stellarium and RequestScript platforms.</p></div></article>
          <article><span>02</span><div><h2>Notation</h2><p>SIPs should be named starting with “SIP” and the number of the proposal following logically from the last number.</p></div></article>
          <article><span>03</span><div><h2>Commenting on SIPs</h2><p>Be aware of the tone of your writing when commenting on an SIP. We are all here to improve the system, so do not take an overly negative tone or belittle the author.</p></div></article>
          <article><span>04</span><div><h2>AI Use</h2><p>AI can be used to help write SIPs, but be careful that the guide is human readable. You may want to reformat “AI-isms” like em dashes.</p></div></article>
        </div>
      </section>

      <section className={styles.callout}><StarMark /><p>Good ideas travel further when they are clear.</p><a href={sipDocument} target="_blank" rel="noreferrer">Read the SIP guide <span>→</span></a></section>
      <footer className={styles.footer}><a className={styles.brand} href="/"><StarMark /><span>stellarium</span></a><p>Decentralized API infrastructure for an open internet.</p><div><a href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">GitHub</a><span>© 2026</span></div></footer>
    </main>
  );
}
