import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import Spec from "../components/Spec";
import { links } from "../components/nav-data";
import { pageMetadata } from "../lib/site";
import styles from "../components/content.module.css";

const sipDocument = "https://github.com/qualletio/SIPs#readme";

export const metadata = pageMetadata({
  title: "Stellarium Improvement Proposals (SIPs)",
  absoluteTitle: true,
  description: "How to write, number, and discuss Stellarium Improvement Proposals (SIPs), the process for proposing changes to Stellarium and RequestScript.",
  path: "/sips",
});

export default function SipsPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Participate / SIPs</p>
          <h1>Stellarium Improvement Proposals</h1>
          <p className={styles.lead}>A SIP is a technical document that proposes a change to Stellarium or RequestScript. Proposals are written, numbered, and discussed in the SIPs repository.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={sipDocument} target="_blank" rel="noreferrer">SIPs repository <span aria-hidden="true">↗</span></a>
            <a className={styles.textLink} href={links.whitepaper} target="_blank" rel="noreferrer">Whitepaper <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="SIP basics" items={[
          ["Repository", <a key="r" href={links.sipsRepo} target="_blank" rel="noreferrer">qualletio/SIPs</a>],
          ["Naming", <><code>SIP</code> + next number</>],
          ["Covers", "Stellarium, RequestScript"],
        ]} />
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.sectionHead}><p className={styles.kicker}>Guidelines</p><h2>Writing and reviewing a SIP</h2></div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>What a SIP is</h3><p>A Stellarium Improvement Proposal (SIP) is a technical document that proposes an improvement to some part of Stellarium or RequestScript.</p></div></article>
          <article><span>02</span><div><h3>Naming</h3><p>Name a SIP with the prefix &ldquo;SIP&rdquo; followed by the next number after the most recent proposal.</p></div></article>
          <article><span>03</span><div><h3>Commenting</h3><p>Keep comments constructive. Everyone is working to improve the system, so don&apos;t belittle the author or take an overly negative tone.</p></div></article>
          <article><span>04</span><div><h3>Using AI</h3><p>You can use AI to help write a SIP, but make sure the result reads like a person wrote it. Edit out &ldquo;AI-isms&rdquo; such as heavy use of em dashes.</p></div></article>
        </div>
      </section>

      <section className={styles.callout}><p>Have an idea? Discuss it on Discord before writing it up.</p><div className={styles.actions}><a className={styles.button} href={sipDocument} target="_blank" rel="noreferrer">Read the SIP guide <span aria-hidden="true">↗</span></a><a className={styles.textLink} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
