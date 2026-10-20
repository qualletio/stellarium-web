import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import JsonLd from "../components/JsonLd";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import StarMark from "../components/StarMark";
import { links } from "../components/nav-data";
import { pageMetadata, siteUrl } from "../lib/site";
import styles from "../components/content.module.css";

export const metadata = pageMetadata({
  title: "AI on Stellarium",
  description: "Call AI models from RequestScript and host your own on the Stellarium network, with per-token pricing paid in USDC.",
  path: "/ai",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "AI on Stellarium",
  description: "An introduction to calling and hosting AI models on the Stellarium network.",
  url: `${siteUrl}/ai`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const sample = `request AskClaude {
  const sonnet: sh.stellarium.inference.claude.Sonnet

  const reply = sonnet.message(prompt: "Write a haiku about Oslo", maxTokens: 200)
  if (reply.error != null) {
    return reply.error.message
  }

  return reply.value
}`;

export default function AiPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>AI / The basics</p>
          <h1>AI on<br /><em>Stellarium.</em></h1>
          <p className={styles.lead}>AI models can be resources on Stellarium, just like any other API. You call them from RequestScript, pay per token in USDC, and don&apos;t need an account with each provider. Anyone who runs a model can offer it to the network and get paid for every call.</p>
          <div className={styles.actions}>
            <Link className={styles.button} href="/ai/inference-functions">Read about inference functions <span>→</span></Link>
            <a className={styles.textLink} href={links.registry} target="_blank" rel="noreferrer">Browse the registry ↗</a>
          </div>
        </div>
        <div className={styles.art} aria-hidden="true"><div className={styles.ring} /><div className={styles.ringTilt} /><div className={styles.spark}>✦</div><div className={styles.badge}>stellarium<b>ai</b></div></div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>01 / Models as resources</p><h2>A model is<br />just a resource.</h2></div>
        <div className={styles.body}>
          <p>On Stellarium, every API is a <strong>resource</strong> hosted by some node. A resource has a name, like <code>com.example.Weather</code>, and a list of functions that programs can call. See <Link href="/learn">What is Stellarium?</Link> if you&apos;re new to these ideas.</p>
          <p>An AI model fits the same shape. A provider wraps the model in a resource with a function that takes a prompt and returns text. For example, <code>sh.stellarium.inference.claude.Sonnet</code> offers Claude Sonnet through a <code>message</code> function. Its node tells the network about it, and every other node can route calls to it.</p>
          <p>So AI gets everything the network already does: discovery by name, routing between peers, results that carry a <code>value</code> or an <code>error</code>, and payment with no sign up or API keys.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.sectionHead}><p className={styles.kicker}>02 / Calling a model</p><h2>Ask a model<br /><em>from a script.</em></h2></div>
        <div className={styles.body}>
          <p>Calling a model looks like calling any other function. This request asks Claude Sonnet for a haiku. The one difference is <code>maxTokens</code>: every model function takes it, and it sets the most output tokens the call may produce.</p>
          <CodeBlock label="AskClaude.req" code={sample} />
          <p>Your node handles the rest. It finds the node that hosts the model, gets a price estimate, checks it against your spending limit, and pays for the call. If the model fails, you get an <code>error</code> your script can handle instead of a failed request.</p>
          <p>Because a model is a resource like the others, a single request can mix model calls with the rest of the network, such as a weather lookup or a price feed, and use their results together.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>03 / Paying per token</p><h2>Pay for what<br /><em>the model uses.</em></h2></div>
        <div className={styles.body}>
          <p>Most paid resources charge a flat amount per call. AI doesn&apos;t work that way, because a call&apos;s cost depends on how many tokens go in and come out. Model functions are <strong>inference functions</strong>, priced at a rate per million input tokens and a rate per million output tokens.</p>
          <ul>
            <li><strong>You set a ceiling.</strong> Before a call runs, your node gets an estimate of the most it can cost and refuses it if that&apos;s over your limit.</li>
            <li><strong>You pay for actual usage.</strong> You&apos;re charged for the tokens the call used, never more than the ceiling you signed.</li>
            <li><strong>Providers are covered.</strong> A provider checks that your payment covers the call before it spends anything on inference.</li>
          </ul>
          <p>Rates are public. Every model on the network lists its prices in <code>GET /v1/resources</code>, so you can compare models on the <a href={links.registry} target="_blank" rel="noreferrer">registry</a> before you call one.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>04 / Hosting a model</p><h2>Offer a model.<br /><em>Get paid for it.</em></h2></div>
        <div className={styles.body}>
          <p>If you can run a model, or call one you have access to, you can offer it on Stellarium. Run a <Link href="/build">node</Link>, register a resource whose function is declared as an inference function, and set your per-token rates. Your function reports the tokens each call used, and the network settles payment to your wallet in USDC.</p>
          <p>You only write two pieces of code: the function that runs the model, and an estimator that counts a call&apos;s input tokens. Billing, sign up, keys and discovery are handled by the network.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.kicker}>05 / Go deeper</p><h2>Keep reading.</h2></div>
        <div className={styles.cards}>
          <article className={styles.card}>
            <span>AI</span>
            <h3>Inference functions</h3>
            <p>How model functions are declared, priced and paid for, step by step.</p>
            <div className={styles.cardLinks}><Link href="/ai/inference-functions">Read the guide</Link></div>
          </article>
          <article className={styles.card}>
            <span>Build</span>
            <h3>Run a node</h3>
            <p>Set up the node that hosts your model, from an empty folder to a running server.</p>
            <div className={styles.cardLinks}><Link href="/build">Read the node guide</Link></div>
          </article>
          <article className={styles.card}>
            <span>Registry</span>
            <h3>Find models</h3>
            <p>Browse the resources on mainnet, including the models and their per-token rates.</p>
            <div className={styles.cardLinks}><a href={links.registry} target="_blank" rel="noreferrer">Browse the registry ↗</a></div>
          </article>
        </div>
      </section>

      <section className={styles.callout}><StarMark className={styles.starMark} /><p>Ready to put a model on the network?</p><Link className={styles.lightButton} href="/ai/inference-functions">Host a model <span>→</span></Link></section>
      <SiteFooter />
    </main>
  );
}
