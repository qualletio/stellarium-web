import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import StarMark from "../components/StarMark";
import { links } from "../components/nav-data";
import styles from "../components/content.module.css";

export const metadata: Metadata = {
  title: "What is Stellarium? | Stellarium",
  description: "Stellarium is a decentralized, programmable API network where anyone can host an API and get paid for it.",
};

const sample = `request GetTemperature {
  const weather: com.example.Weather

  return weather.temperature(
    city: "Oslo"
  )
}`;

export default function LearnPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Learn / The basics</p>
          <h1>What is<br /><em>Stellarium?</em></h1>
          <p className={styles.lead}>Stellarium is a decentralized, programmable API network. Anyone can host an API on it, and anyone can call those APIs with a small program written in RequestScript.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.whitepaper} target="_blank" rel="noreferrer">Read the whitepaper <span>↗</span></a>
            <Link className={styles.textLink} href="/build">Run a node</Link>
          </div>
        </div>
        <div className={styles.art} aria-hidden="true"><div className={styles.ring} /><div className={styles.ringTilt} /><div className={styles.spark}>✦</div></div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>01 / The network</p><h2>A network of APIs,<br />run by its users.</h2></div>
        <div className={styles.body}>
          <p>Most APIs live on one company&apos;s servers. If you want to use them, you sign up, get a key, and follow that company&apos;s rules. If the service changes or shuts down, everything built on it breaks.</p>
          <p>Stellarium works differently. It is made of many independent <strong>nodes</strong>. Each node can host its own APIs, which Stellarium calls <strong>resources</strong>. Nodes find each other, share the list of resources they know about, and pass requests along to whichever node hosts the resource you asked for.</p>
          <p>No single server is in charge. You don&apos;t need to know where a resource lives. You just ask for it by name, and the network routes your request.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.sectionHead}><p className={styles.kicker}>02 / Open to anyone</p><h2>Host an API.<br /><em>Get paid for it.</em></h2></div>
        <div className={styles.body}>
          <p>Anyone can run a node and offer resources on it. A resource can be anything you can write as a function: a weather lookup, a price feed, a translation service, a database query.</p>
          <p>When other people call your resource, you can charge for it. That means you can earn money from an API without building your own billing, sign up, or key management. The network handles discovery and payments so you can focus on what your API does.</p>
          <p><Link href="/build">Learn how to run a node</Link></p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>03 / RequestScript</p><h2>One small language<br />for every API.</h2></div>
        <div className={styles.body}>
          <p>Stellarium runs on <strong>RequestScript</strong>, a programming language built for querying Stellarium APIs. It is nearly Turing complete, so you can write real logic, not just single calls.</p>
          <p>A RequestScript program names the resources it wants and calls their functions. Here is a request that asks a weather resource for the temperature in Oslo:</p>
          <CodeBlock label="GetTemperature.req" code={sample} />
          <p>Notice what is missing. There are no URLs, no status codes, no auth headers, and no retry logic. You say what you want, and your node figures out which peer hosts <code>com.example.Weather</code> and forwards the request there.</p>
          <p>Want to dig into the language itself? See the <a href={links.requestscript} target="_blank" rel="noreferrer">RequestScript repository</a>.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>04 / Go deeper</p><h2>Keep reading.</h2></div>
        <div className={styles.cards}>
          <article className={styles.card}>
            <span>Whitepaper</span>
            <h3>The full design</h3>
            <p>How the network, payments, and RequestScript fit together, written out in detail.</p>
            <div className={styles.cardLinks}><a href={links.whitepaper} target="_blank" rel="noreferrer">Read the whitepaper ↗</a></div>
          </article>
          <article className={styles.card}>
            <span>Documentation</span>
            <h3>Guides and references</h3>
            <p>Quickstart, core concepts, configuration, and the full HTTP API for node operators and builders.</p>
            <div className={styles.cardLinks}><a href={links.docs} target="_blank" rel="noreferrer">Read the docs ↗</a></div>
          </article>
          <article className={styles.card}>
            <span>See it in action</span>
            <h3>How a request travels</h3>
            <p>A quick visual of one program running across several nodes.</p>
            <div className={styles.cardLinks}><Link href="/#how-it-works">See how it works</Link></div>
          </article>
        </div>
      </section>

      <section className={styles.callout}><StarMark className={styles.starMark} /><p>Ready to put an API on the network?</p><Link className={styles.lightButton} href="/build">Run a node <span>→</span></Link></section>
      <SiteFooter />
    </main>
  );
}
