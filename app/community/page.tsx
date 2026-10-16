import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import StarMark from "../components/StarMark";
import { links } from "../components/nav-data";
import { pageMetadata } from "../lib/site";
import styles from "../components/content.module.css";

export const metadata = pageMetadata({
  title: "Community",
  description: "Join the Stellarium community on Discord and GitHub. Get help running a node, share what you're building, and follow the open source repositories.",
  path: "/community",
});

const repos = [
  { name: "stellarium-ts", text: "The TypeScript node. Start here if you want to run a node or work on the network itself.", href: links.github },
  { name: "requestscript-js", text: "The RequestScript language: parser, types, and runtime.", href: links.requestscript },
  { name: "SIPs", text: "Stellarium Improvement Proposals and the whitepaper. Where big ideas get written down and discussed.", href: links.sipsRepo },
  { name: "stellarium-web", text: "This website. Fix a typo, improve a page, or help build the docs and blog.", href: links.website },
];

export default function CommunityPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Participate / Find your people</p>
          <h1>The Stellarium<br /><em>community.</em></h1>
          <p className={styles.lead}>Stellarium is built in the open by people who want APIs to be as open as the web. The best way to get started is to join the Discord, say hello, and ask questions.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Join our Discord <span>↗</span></a>
            <Link className={styles.textLink} href="/join">Ways to help</Link>
          </div>
        </div>
        <div className={styles.art} aria-hidden="true"><div className={styles.ring} /><div className={styles.ringTilt} /><div className={styles.spark}>✦</div><div className={styles.badge}>community<b>open</b></div></div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.sectionHead}><p className={styles.kicker}>01 / Discord</p><h2>Where the<br /><em>talking</em> happens.</h2></div>
        <div className={styles.body}>
          <p>Our Discord server is the home base for the project. It&apos;s where you can:</p>
          <ul>
            <li>Ask for help running a node or writing RequestScript.</li>
            <li>Share what you&apos;re building and get feedback.</li>
            <li>Talk through ideas before writing them up as a SIP.</li>
            <li>Meet the people working on the network, the language, and this site.</li>
          </ul>
          <p><a href={links.discord} target="_blank" rel="noreferrer">Join the Discord ↗</a></p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>02 / GitHub</p><h2>Where the<br />code lives.</h2></div>
        <div className={styles.cards}>
          {repos.map((repo) => (
            <article key={repo.name} className={styles.card}>
              <span>qualletio/</span>
              <h3>{repo.name}</h3>
              <p>{repo.text}</p>
              <div className={styles.cardLinks}><a href={repo.href} target="_blank" rel="noreferrer">Open on GitHub ↗</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>03 / Shape the project</p><h2>Have a say.</h2></div>
        <div className={styles.cards}>
          <article className={styles.card}>
            <span>Proposals</span>
            <h3>SIPs</h3>
            <p>Got an idea to improve Stellarium or RequestScript? Write it up as a Stellarium Improvement Proposal.</p>
            <div className={styles.cardLinks}><Link href="/sips">Read the SIP guide</Link></div>
          </article>
          <article className={styles.card}>
            <span>Direction</span>
            <h3>Governance</h3>
            <p>A governance team is forming to help decide where the network goes next.</p>
            <div className={styles.cardLinks}><Link href="/governance">Learn about governance</Link></div>
          </article>
        </div>
      </section>

      <section className={styles.callout}><StarMark className={styles.starMark} /><p>The constellation grows<br />when more people navigate.</p><a className={styles.lightButton} href={links.discord} target="_blank" rel="noreferrer">Join Discord <span>↗</span></a></section>
      <SiteFooter />
    </main>
  );
}
