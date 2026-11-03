import Link from "next/link";
import CodeBlock from "../../components/CodeBlock";
import JsonLd from "../../components/JsonLd";
import SiteFooter from "../../components/SiteFooter";
import SiteNav from "../../components/SiteNav";
import Spec from "../../components/Spec";
import { links } from "../../components/nav-data";
import { pageMetadata, siteUrl } from "../../lib/site";
import styles from "../../components/content.module.css";

export const metadata = pageMetadata({
  title: "Events",
  description: "Let RequestScript contracts react to each other: declare an event type, emit it from your scripts, and run event contracts on any node with each event, paid for by whoever deployed them.",
  path: "/build/events",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Events",
  description: "How events let contracts on any Stellarium node react to each other.",
  url: `${siteUrl}/build/events`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const reference = `${links.github}/blob/main/docs/events.md`;

const eventType = `event com.example.OrderPlaced@1(orderId: string, total: decimal)
restricted event com.example.AuditEntry(entry: object)`;

const declare = `curl -X POST https://node.example/v1/events \\
  -H 'Content-Type: application/json' \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{"source": "event com.example.OrderPlaced(orderId: string, total: decimal)"}'`;

const emit = `contract com.example.Checkout(orderId: string, total: decimal): string {
  emit com.example.OrderPlaced(orderId: orderId, total: total)
  return orderId
}`;

const consume = `contract com.example.OnOrderPlaced consumes com.example.OrderPlaced@1 {
  var state(orderId) seen: int32 = 0
  seen = seen + 1

  const logger: com.example.Logger
  logger.info(message: "Order \${orderId}: \${total}, from \${caller.org}")
}`;

const limitsEnv = `# The most events one run may emit. Defaults to 16.
MAX_EVENTS_PER_RUN=16
# The most one event's data may take, as JSON, in bytes. Defaults to 32 KiB.
MAX_EVENT_DATA_BYTES=32768`;

export default function EventsPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Build / Events</p>
          <h1>Events</h1>
          <p className={styles.lead}>Events let contracts react to each other. An organization declares an event type and emits it from its scripts. Anyone can deploy an event contract, on any node, that runs with each event it consumes, and pays for its own runs.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#what">How it works <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={reference} target="_blank" rel="noreferrer">Reference <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Events summary" items={[
          ["Language", "RequestScript 1.6+"],
          ["Declare", <code key="d">POST /v1/events</code>],
          ["Emit", <code key="e">emit</code>],
          ["Consume", <code key="c">consumes</code>],
        ]} />
      </section>

      <section className={styles.section} id="what">
        <div className={styles.sectionHead}><p className={styles.kicker}>01</p><h2>What is an event?</h2></div>
        <div className={styles.body}>
          <p>A <Link href="/build/contracts">contract</Link> runs when someone calls it. An <strong>event contract</strong> runs when something happens instead: an order is placed, a payment clears, a record changes. Three pieces make that work:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th></th><th>What it is</th><th>Who can use it</th></tr></thead>
              <tbody>
                <tr><td>Event type</td><td>a named, versioned set of fields</td><td>declared by an organization, on one of its nodes</td></tr>
                <tr><td><code>emit</code></td><td>publishes an event of that type from a run</td><td>only the type&apos;s owner, from its own nodes</td></tr>
                <tr><td>Event contract</td><td>a contract that <code>consumes</code> one type</td><td>anyone, on any node, unless the type is <code>restricted</code></td></tr>
              </tbody>
            </table>
          </div>
          <p>Publishers never pay for consumers, so anyone can subscribe to an event without costing the organization that emits it.</p>
        </div>
      </section>

      <section className={styles.section} id="declare">
        <div className={styles.sectionHead}><p className={styles.kicker}>02</p><h2>Declare an event type</h2></div>
        <div className={styles.body}>
          <p>An event type is a script of its own. It names the fields its events carry and has no body. Names, paths and versions work as they do for contracts, and versions are immutable.</p>
          <CodeBlock label="OrderPlaced.req" code={eventType} />
          <p>A <strong><code>restricted</code></strong> event type is consumed only by event contracts its owner deployed, for events you want to keep inside your organization.</p>
          <p>Declare it on a node of your organization with its API key, or a run token from one of its own API clients. The node&apos;s organization owns the type, because it&apos;s the organization whose nodes may emit it.</p>
          <CodeBlock label="Terminal" code={declare} />
          <p><code>GET /v1/events</code> lists the event types a node knows, its own and those it learned from peers. <code>DELETE /v1/events/com.example.OrderPlaced@1</code> deletes one.</p>
        </div>
      </section>

      <section className={styles.section} id="emit">
        <div className={styles.sectionHead}><p className={styles.kicker}>03</p><h2>Emit events</h2></div>
        <div className={styles.body}>
          <p>A request or a contract emits an event with <code>emit</code>, naming every field:</p>
          <CodeBlock label="Checkout.req" code={emit} />
          <ul>
            <li><strong>Fields are checked.</strong> Each one is converted to its declared type, and a missing or unknown field is a runtime error.</li>
            <li><strong>Events are published only when a run succeeds.</strong> Like contract state, a run that fails publishes nothing.</li>
            <li><strong>Only the owner emits.</strong> The script must belong to the type&apos;s organization: a run with the node&apos;s API key or one of its API clients, or a contract it owns. Other organizations can still trigger events through your contracts: anyone can call <code>Checkout</code>, and it emits as you.</li>
            <li><strong>Runs have limits.</strong> A run emits at most 16 events, each with at most 32 KiB of data.</li>
          </ul>
          <CodeBlock label=".env" code={limitsEnv} />
        </div>
      </section>

      <section className={styles.section} id="consume">
        <div className={styles.sectionHead}><p className={styles.kicker}>04</p><h2>Consume events</h2></div>
        <div className={styles.body}>
          <p>An event contract names the type it <code>consumes</code>. The event&apos;s fields are its parameters, so it declares none of its own, and it has no return type.</p>
          <CodeBlock label="OnOrderPlaced.req" code={consume} />
          <ul>
            <li><strong>It consumes one version:</strong> the one it names, or the latest its node knows when it&apos;s deployed.</li>
            <li><strong>It reads two built-ins</strong> besides its fields: <code>event</code>, with its <code>id</code>, <code>type</code>, <code>version</code>, <code>publishedAt</code> and <code>depth</code>, and <code>caller</code>, the event&apos;s owner and the node that published it.</li>
            <li><strong>It isn&apos;t a resource.</strong> It runs only with real events, so nobody can call it with made-up data. A contract keeps its kind across versions.</li>
            <li><strong>It can keep state</strong> like any contract, here one counter per order.</li>
          </ul>
          <p>Deploy it like any contract, with <code>POST /v1/contracts</code>.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="travel">
        <div className={styles.sectionHead}><p className={styles.kicker}>05</p><h2>How events travel</h2></div>
        <div className={styles.body}>
          <p>An event can be emitted on one node and consumed on many others. Every hop is signed, and receivers check the publisher against the operator, so no node has to take another&apos;s word for who owns an event.</p>
        </div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>Nodes announce</h3><p>Each node signs and announces its event types and event contracts to its peers, with a membership token from the operator. Peers learn a type only if the token says the node belongs to its owner.</p></div></article>
          <article><span>02</span><div><h3>The run publishes</h3><p>When a run succeeds, its node signs each event and queues it for its own event contracts, and once for each peer subscribed to it. Restricted events go only to the owner&apos;s contracts.</p></div></article>
          <article><span>03</span><div><h3>Peers receive it</h3><p>A worker delivers each event, retrying with backoff for up to a day. The receiver checks the signature, the membership token, the event&apos;s age and depth, and that it knows the type.</p></div></article>
          <article><span>04</span><div><h3>Event contracts run</h3><p>The receiver queues the event once for each local event contract and runs it, retrying a failure up to 3 times in all.</p></div></article>
        </div>
        <div className={styles.body}>
          <p className={styles.afterSteps}>Delivery is at least once, and each event contract runs once per event id. Events may arrive in any order. Admins follow deliveries at <code>GET /v1/admin/events/outbox</code> and runs at <code>GET /v1/admin/events/inbox</code>.</p>
        </div>
      </section>

      <section className={styles.section} id="paying">
        <div className={styles.sectionHead}><p className={styles.kicker}>06</p><h2>Who pays</h2></div>
        <div className={styles.body}>
          <ul>
            <li><strong>Emitting</strong> costs only the publishing run&apos;s tokens.</li>
            <li><strong>Your own event contracts run free</strong> on your organization&apos;s nodes.</li>
            <li><strong>Others pay through a mandate.</strong> When another organization&apos;s API client deploys an event contract, the node asks the operator for an <strong>event mandate</strong>. Each event then runs under a hold on that organization&apos;s balance, within its API client&apos;s limits and monthly cap, at the node&apos;s price per million tokens.</li>
            <li><strong>Charges stop when you say so.</strong> An organization sees its mandates under API clients on the <a href={links.platform} target="_blank" rel="noreferrer">Stellarium Platform</a>, and stops one by revoking the mandate or the API client. Deploying the contract again renews it.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="chains">
        <div className={styles.sectionHead}><p className={styles.kicker}>07</p><h2>Chains</h2></div>
        <div className={styles.body}>
          <p>An event contract may emit events of its own, so one event can set off another. Each event carries its chain, and a few rules keep a chain from looping:</p>
          <ul>
            <li><strong>At most 4 deep.</strong> An event three hops from the first can&apos;t emit another.</li>
            <li><strong>No repeated types.</strong> A contract can&apos;t emit an event type already in its chain, and an event contract can&apos;t emit the type it consumes.</li>
            <li><strong>No calls back.</strong> A contract can&apos;t call a contract already in its chain, on any node.</li>
          </ul>
          <p>For example, contract A emits <code>Event1</code>, and event contract B consumes it. If B emits <code>Event2</code>, event contract C may consume that, but C can&apos;t emit <code>Event1</code> or <code>Event2</code>, or call A or B.</p>
        </div>
      </section>

      <section className={styles.section} id="reference">
        <div className={styles.sectionHead}><p className={styles.kicker}>08</p><h2>Reference</h2></div>
        <div className={styles.body}>
          <p>Read the full reference, including how nodes sign and check events, in the <a href={reference} target="_blank" rel="noreferrer">stellarium-ts events guide</a> and the <a href={links.docs} target="_blank" rel="noreferrer">documentation</a>. Events need RequestScript 1.6.0, which adds event declarations, <code>consumes</code> and <code>emit</code>; learn the language at <a href={links.requestscriptSite} target="_blank" rel="noreferrer">requestscript.org</a>.</p>
        </div>
      </section>

      <section className={styles.callout}><p>Built something with events? Show it off on Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/build/contracts">Contracts</Link></div></section>
      <SiteFooter />
    </main>
  );
}
