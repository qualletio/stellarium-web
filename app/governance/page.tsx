import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import StarMark from "../components/StarMark";
import styles from "./page.module.css";

const discordInvite = "https://discord.gg/yDEBkaz6cB";

export const metadata: Metadata = {
  title: "Governance — Stellarium",
  description: "Help shape the governance of the Stellarium network.",
};

export default function GovernancePage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div className={styles.art} aria-hidden="true"><div className={styles.orbit} /><div className={styles.orbitTwo} /><div className={styles.core}><StarMark className={styles.starMark} /></div><span className={styles.dotOne} /><span className={styles.dotTwo} /><span className={styles.dotThree} /><div className={styles.status}><i /> GOVERNANCE / FORMING</div></div>
        <div className={styles.copy}><p className={styles.kicker}>A network is more than its code</p><h1>Governance is<br /><em>coming into focus.</em></h1><p>We’re working on building a governance team to help shape the future of Stellarium. Bring your perspective, your curiosity, and your care for an open network.</p><a className={styles.discordButton} href={discordInvite} target="_blank" rel="noreferrer"><span className={styles.discordMark}>◖◗</span> Join our Discord <b>↗</b></a></div>
      </section>

      <section className={styles.steps}><p className={styles.sectionKicker}>The invitation</p><div><span>01</span><h2>Help build<br />the <em>how.</em></h2></div><p className={styles.stepText}>Governance will be a place for the people invested in Stellarium to listen, discuss, and set a thoughtful direction together. The team is being formed now.</p><a href={discordInvite} target="_blank" rel="noreferrer">Meet the community on Discord <span>→</span></a></section>

      <section className={styles.callout}><StarMark className={styles.starMark} /><p>The constellation grows<br />when more people navigate.</p><a href={discordInvite} target="_blank" rel="noreferrer">Join Discord <span>↗</span></a></section>
      <SiteFooter />
    </main>
  );
}
