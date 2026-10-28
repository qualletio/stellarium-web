import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import Spec from "../components/Spec";
import { links } from "../components/nav-data";
import { pageMetadata } from "../lib/site";
import styles from "../components/content.module.css";

export const metadata = pageMetadata({
  title: "How to Join",
  description: "All the ways you can get involved with Stellarium: research, language design, web development, and decentralized architecture.",
  path: "/join",
});

type Area = {
  title: string;
  intro: string;
  tasks: string[];
  links: { label: string; href: string; external?: boolean }[];
};

const areas: Area[] = [
  {
    title: "Research",
    intro: "Many design questions are still open. Research means reading prior work, comparing designs, and writing up what you find.",
    tasks: [
      "Study how other networks handle discovery, routing, and payments.",
      "Find gaps in the current design and suggest fixes.",
      "Turn your findings into a SIP.",
    ],
    links: [
      { label: "Browse SIPs ↗", href: links.sipsRepo, external: true },
    ],
  },
  {
    title: "Programming language development",
    intro: "RequestScript is the language every Stellarium request is written in. Help design it and build the tools around it.",
    tasks: [
      "Work on the parser, type checker, and runtime.",
      "Propose new language features.",
      "Write examples and test cases.",
    ],
    links: [{ label: "RequestScript on GitHub ↗", href: links.requestscript, external: true }],
  },
  {
    title: "Website, blog, and docs",
    intro: "The website and docs are open source, and the blog hasn't launched yet. All three need writers, editors, and developers.",
    tasks: [
      "Improve pages on this website.",
      "Write guides, tutorials, and reference docs.",
      "Help launch the blog and write the first posts.",
    ],
    links: [
      { label: "Website on GitHub ↗", href: links.website, external: true },
      { label: "Read the docs ↗", href: links.docs, external: true },
    ],
  },
  {
    title: "Decentralized architectures",
    intro: "Work on the node itself: peer discovery, routing, signing, and payments between nodes.",
    tasks: [
      "Work on peer discovery, routing, and syncing in the node.",
      "Think through trust, signing, and payments between nodes.",
      "Run nodes and report what breaks.",
    ],
    links: [
      { label: "stellarium-ts on GitHub ↗", href: links.github, external: true },
      { label: "Run a node", href: "/build" },
    ],
  },
];

export default function JoinPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Participate / Contributing</p>
          <h1>Contribute to Stellarium</h1>
          <p className={styles.lead}>Contributions are open to anyone. Pick an area below, read through the relevant repository, and post in the Discord about what you want to work on.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a>
            <a className={styles.textLink} href="#areas">Areas</a>
          </div>
        </div>
        <Spec label="Contribution areas" items={areas.map((area, i): [string, string] => [String(i + 1).padStart(2, "0"), area.title])} />
      </section>

      <section className={styles.section} id="areas">
        <div className={styles.sectionHead}><p className={styles.kicker}>Areas</p><h2>Where help is needed</h2></div>
        <div className={styles.cards}>
          {areas.map((area, i) => (
            <article key={area.title} className={styles.card}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{area.title}</h3>
              <p>{area.intro}</p>
              <ul>{area.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
              <div className={styles.cardLinks}>
                {area.links.map((link) => link.external
                  ? <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                  : <Link key={link.label} href={link.href}>{link.label}</Link>)}
                <a href={links.discord} target="_blank" rel="noreferrer">Discuss on Discord ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.sectionHead}><p className={styles.kicker}>Getting started</p><h2>Your first contribution</h2></div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>Join the Discord</h3><p>Introduce yourself and say which area you want to work in.</p></div></article>
          <article><span>02</span><div><h3>Look around the repos</h3><p>Read the README, try running the code, and check the open issues.</p></div></article>
          <article><span>03</span><div><h3>Start small</h3><p>Fix a typo, improve an example, or answer a question. Small changes are the quickest way to learn the codebase.</p></div></article>
          <article><span>04</span><div><h3>Take on something larger</h3><p>Once you know your way around, take on a feature or write a <Link href="/sips">SIP</Link>.</p></div></article>
        </div>
      </section>

      <section className={styles.callout}><p>Tell us what you want to work on.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/sips">Write a SIP</Link></div></section>
      <SiteFooter />
    </main>
  );
}
