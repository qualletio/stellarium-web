import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import Spec from "../components/Spec";
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
  { name: "SIPs", text: "Stellarium Improvement Proposals. Where big ideas get written down and discussed.", href: links.sipsRepo },
  { name: "stellarium-web", text: "This website. Fix a typo, improve a page, or help build the docs and blog.", href: links.website },
];

export default function CommunityPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Participate / Find your people</p>
          <h1>Community</h1>
          <p className={styles.lead}>Stellarium is developed in the open. Questions, design discussion, and help with running nodes happen on Discord. Code, issues, and proposals are on GitHub.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a>
            <Link className={styles.textLink} href="/join">Ways to contribute</Link>
          </div>
        </div>
        <Spec label="Where to find the project" items={[
          ["Chat", <a key="d" href={links.discord} target="_blank" rel="noreferrer">Discord</a>],
          ["Code", <a key="g" href="https://github.com/qualletio" target="_blank" rel="noreferrer">github.com/qualletio</a>],
          ["Proposals", <Link key="s" href="/sips">SIPs</Link>],
          ["Roadmap", <a key="r" href={links.roadmap} target="_blank" rel="noreferrer">GitHub project</a>],
        ]} />
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.sectionHead}><p className={styles.kicker}>01 / Discord</p><h2>Discord</h2></div>
        <div className={styles.body}>
          <p>The Discord server is where most project discussion happens. Use it to:</p>
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
        <div className={styles.sectionHead}><p className={styles.kicker}>02 / GitHub</p><h2>Repositories</h2></div>
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
        <div className={styles.sectionHead}><p className={styles.kicker}>03 / Shape the project</p><h2>Proposals and governance</h2></div>
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

      <section className={styles.callout}><p>Questions about Stellarium? Ask on Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><a className={styles.textLink} href={links.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
