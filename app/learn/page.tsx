import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import JsonLd from "../components/JsonLd";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import Spec from "../components/Spec";
import { links } from "../components/nav-data";
import { pageMetadata, siteUrl } from "../lib/site";
import styles from "../components/content.module.css";

export const metadata = pageMetadata({
  title: "What is Stellarium? The decentralized API network",
  absoluteTitle: true,
  description: "Stellarium is a decentralized, programmable API network where anyone can host an API, get paid for it, and call it with RequestScript.",
  path: "/learn",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "What is Stellarium?",
  description: "An introduction to Stellarium, a decentralized, programmable API network built on RequestScript.",
  url: `${siteUrl}/learn`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const sample = `request GetTemperature {
  const weather: com.example.Weather

  const reading = weather.temperature(city: "Oslo")
  if (reading.error != null) {
    return reading.error.message
  }

  return reading.value
}`;

export default function LearnPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Learn / The basics</p>
          <h1>What is Stellarium?</h1>
          <p className={styles.lead}>Stellarium is a decentralized, programmable API network. Anyone can host an API on it, and anyone can call those APIs with a small program written in RequestScript.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.whitepaper} target="_blank" rel="noreferrer">Whitepaper <span aria-hidden="true">↗</span></a>
            <Link className={styles.textLink} href="/build">Run a node</Link>
          </div>
        </div>
        <Spec label="Stellarium at a glance" items={[
          ["Topology", "Peer-to-peer nodes"],
          ["Unit", "Resource: named, typed functions"],
          ["Language", "RequestScript"],
          ["Payments", "USD, per call"],
        ]} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>01 / The network</p><h2>A network of APIs run by its users</h2></div>
        <div className={styles.body}>
          <p>Most APIs live on one company&apos;s servers. If you want to use them, you sign up, get a key, and follow that company&apos;s rules. If the service changes or shuts down, everything built on it breaks.</p>
          <p>Stellarium works differently. It is made of many independent <strong>nodes</strong>. Each node can host its own APIs, which Stellarium calls <strong>resources</strong>. Nodes find each other, share the list of resources they know about, and pass requests along to whichever node hosts the resource you asked for.</p>
          <p>No single server is in charge. You don&apos;t need to know where a resource lives: you ask for it by name, and the network routes the request.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.sectionHead}><p className={styles.kicker}>02 / Open to anyone</p><h2>Host an API and charge for it</h2></div>
        <div className={styles.body}>
          <p>Anyone can run a node and offer resources on it. A resource can be anything you can write as a function: a weather lookup, a price feed, a translation service, a database query.</p>
          <p>When other people call your resource, you can set a price for each call. The caller pays you in USD from their organization&apos;s prepaid balance, and only for calls that succeed. A valid payment is also the caller&apos;s permission to call, so you can earn money from an API without building your own billing, sign up, or key management.</p>
          <p><Link href="/build">Learn how to run a node</Link></p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>03 / RequestScript</p><h2>One small language for every API</h2></div>
        <div className={styles.body}>
          <p>Stellarium runs on <strong>RequestScript</strong>, a programming language built for querying Stellarium APIs. It has variables, objects, exact decimals, and <code>if</code>/<code>else</code>, so you can write real logic, not just single calls. It deliberately has no loops, so every request finishes, and your node knows the most a request can cost before it runs.</p>
          <p>A RequestScript program names the resources it wants and calls their functions. Here is a request that asks a weather resource for the temperature in Oslo:</p>
          <CodeBlock label="GetTemperature.req" code={sample} />
          <p>There are no URLs, no per-API keys, and no HTTP status codes to decode. Every call comes back as a result with either a <code>value</code> or an <code>error</code>, so your program decides what to do when something fails. Your node works out which peer hosts <code>com.example.Weather</code> and forwards the request there.</p>
          <p>Want to dig into the language itself? See the <a href={links.requestscript} target="_blank" rel="noreferrer">RequestScript repository</a>.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>04 / Go deeper</p><h2>Further reading</h2></div>
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
            <p>One program, its resource calls, and the response, step by step.</p>
            <div className={styles.cardLinks}><Link href="/#how-it-works">See how it works</Link></div>
          </article>
        </div>
      </section>

      <section className={styles.callout}><p>Put an API on the network.</p><div className={styles.actions}><Link className={styles.button} href="/build">Run a node <span aria-hidden="true">→</span></Link><a className={styles.textLink} href={links.docs} target="_blank" rel="noreferrer">Documentation <span aria-hidden="true">↗</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
