import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import StarMark from "../components/StarMark";
import { links } from "../components/nav-data";
import styles from "../components/content.module.css";

export const metadata: Metadata = {
  title: "How to Join | Stellarium",
  description: "All the ways you can get involved with Stellarium: research, language design, web development, and decentralized architecture.",
};

type Area = {
  title: string;
  intro: string;
  tasks: string[];
  links: { label: string; href: string; external?: boolean }[];
};

const areas: Area[] = [
  {
    title: "Research",
    intro: "Stellarium is still young, and plenty of questions are open. If you like reading papers, comparing designs, and writing down what you find, this is for you.",
    tasks: [
      "Study how other networks handle discovery, routing, and payments.",
      "Poke holes in the whitepaper and suggest fixes.",
      "Turn your findings into a SIP.",
    ],
    links: [
      { label: "Read the whitepaper ↗", href: links.whitepaper, external: true },
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
    intro: "This site is how most people meet Stellarium. The blog and the documentation haven't launched yet, so you can help shape them from the start.",
    tasks: [
      "Improve pages on this website.",
      "Write guides, tutorials, and reference docs.",
      "Help launch the blog and write the first posts.",
    ],
    links: [{ label: "Website on GitHub ↗", href: links.website, external: true }],
  },
  {
    title: "Decentralized architectures",
    intro: "Make the network itself faster, safer, and harder to break. This is the place for people who enjoy distributed systems.",
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
          <p className={styles.kicker}>Participate / How to join</p>
          <h1>There&apos;s room<br />for <em>you here.</em></h1>
          <p className={styles.lead}>You don&apos;t need permission to help. Pick an area below, take a look around, and jump into the Discord to tell us what you&apos;d like to work on.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Say hi on Discord <span>↗</span></a>
            <a className={styles.textLink} href="#areas">See the areas</a>
          </div>
        </div>
        <div className={styles.art} aria-hidden="true"><div className={styles.ring} /><div className={styles.ringTilt} /><div className={styles.spark}>✦</div><div className={styles.badge}>areas<b>04</b></div></div>
      </section>

      <section className={styles.section} id="areas">
        <div className={styles.sectionHead}><p className={styles.kicker}>Ways to help</p><h2>Pick a place<br /><em>to start.</em></h2></div>
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
        <div className={styles.sectionHead}><p className={styles.kicker}>Getting started</p><h2>Your first<br />contribution.</h2></div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>Join the Discord</h3><p>Introduce yourself and say which area interests you. Someone will point you in the right direction.</p></div></article>
          <article><span>02</span><div><h3>Look around the repos</h3><p>Read the README, try running the code, and check the open issues.</p></div></article>
          <article><span>03</span><div><h3>Start small</h3><p>Fix a typo, improve an example, or answer a question. Small changes are a great way to learn how things work.</p></div></article>
          <article><span>04</span><div><h3>Go bigger</h3><p>Once you know your way around, take on a feature or write a <Link href="/sips">SIP</Link>.</p></div></article>
        </div>
      </section>

      <section className={styles.callout}><StarMark className={styles.starMark} /><p>Good ideas travel further<br />with more people.</p><a className={styles.lightButton} href={links.discord} target="_blank" rel="noreferrer">Join Discord <span>↗</span></a></section>
      <SiteFooter />
    </main>
  );
}
