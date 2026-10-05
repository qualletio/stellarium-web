import type { Metadata } from "next";
import styles from "./page.module.css";

const discordInvite = "https://discord.gg/yDEBkaz6cB";

export const metadata: Metadata = {
  title: "Governance — Stellarium",
  description: "Help shape the governance of the Stellarium network.",
};

const StarMark = () => (
  <svg className={styles.starMark} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 2v44M2 24h44" stroke="currentColor" strokeWidth="1.5" />
    <path d="m7 7 34 34M41 7 7 41" stroke="currentColor" strokeWidth="1" opacity=".45" />
    <circle cx="24" cy="24" r="5.5" fill="currentColor" />
  </svg>
);

export default function GovernancePage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Main navigation">
        <a className={styles.brand} href="/"><StarMark /><span>stellarium</span></a>
        <div className={styles.navLinks}><a href="/#network">Network</a><a href="/#build">Developers</a><a href="/sips">SIPs</a><a className={styles.active} href="/governance">Governance</a></div>
        <a className={styles.navCta} href={discordInvite} target="_blank" rel="noreferrer">Join Discord <span>↗</span></a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.art} aria-hidden="true"><div className={styles.orbit} /><div className={styles.orbitTwo} /><div className={styles.core}><StarMark /></div><span className={styles.dotOne} /><span className={styles.dotTwo} /><span className={styles.dotThree} /><div className={styles.status}><i /> GOVERNANCE / FORMING</div></div>
        <div className={styles.copy}><p className={styles.kicker}>A network is more than its code</p><h1>Governance is<br /><em>coming into focus.</em></h1><p>We’re working on building a governance team to help shape the future of Stellarium. Bring your perspective, your curiosity, and your care for an open network.</p><a className={styles.discordButton} href={discordInvite} target="_blank" rel="noreferrer"><span className={styles.discordMark}>◖◗</span> Join our Discord <b>↗</b></a></div>
      </section>

      <section className={styles.steps}><p className={styles.sectionKicker}>The invitation</p><div><span>01</span><h2>Help build<br />the <em>how.</em></h2></div><p className={styles.stepText}>Governance will be a place for the people invested in Stellarium to listen, discuss, and set a thoughtful direction together. The team is being formed now.</p><a href={discordInvite} target="_blank" rel="noreferrer">Meet the community on Discord <span>→</span></a></section>

      <section className={styles.callout}><StarMark /><p>The constellation grows<br />when more people navigate.</p><a href={discordInvite} target="_blank" rel="noreferrer">Join Discord <span>↗</span></a></section>
      <footer className={styles.footer}><a className={styles.brand} href="/"><StarMark /><span>stellarium</span></a><p>Decentralized API infrastructure for an open internet.</p><div><a href="/sips">SIPs</a><a href="https://discord.gg/yDEBkaz6cB" target="_blank" rel="noreferrer">Discord</a><a href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">GitHub</a><span>© 2026</span></div></footer>
    </main>
  );
}
