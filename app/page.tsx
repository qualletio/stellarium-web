import Link from "next/link";
import CodeBlock from "./components/CodeBlock";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import { links } from "./components/nav-data";
import { pageMetadata, siteDescription, siteName, siteTagline } from "./lib/site";
import content from "./components/content.module.css";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: `${siteName} | ${siteTagline}`,
  absoluteTitle: true,
  description: siteDescription,
  path: "/",
});

const install = "npm install stellarium-ts fastify requestscript";

const resource = `await node.register({
  metadata: {},
  path: "com.example",
  name: "Weather",
  functions: [{
    name: "temperature",
    parameters: [{ name: "city", type: "string" }],
    returnType: "int32",
    exec: async (args) => 12,
  }],
});`;

const request = `request GetTemperature {
  const weather: com.example.Weather

  const reading = weather.temperature(city: "Oslo")
  if (reading.error != null) {
    return reading.error.message
  }

  return reading.value
}`;

const response = `{ "returnValue": 12 }`;

const manifest = `paymentManifest: {
  costMicroUsd: 10000, // $0.01 per call
}`;

const stateful = `contract com.example.Assistant(message: string): string {
  // One conversation per organization, kept between calls.
  var state(caller.org) history: string = ""

  const sonnet: sh.stellarium.inference.claude.Sonnet

  const prompt = "\${history}User: \${message}\\nAssistant:"
  const reply = sonnet.message(prompt: prompt, maxTokens: 1024)
  if (reply.error != null) {
    return reply.error.message
  }

  history = "\${prompt} \${reply.value}\\n\\n"
  return reply.value
}`;

const appPatterns = [
  { title: "Quotas and counters", text: "Keep one shared value for every caller, or a copy per organization with state(caller.org). The caller is verified, so no one can read or spend another organization's count." },
  { title: "Caches", text: "Store the last answer from a paid resource and return it until it goes stale, so callers pay for one upstream call instead of many." },
  { title: "Agent memory", text: "Give an agent a contract that remembers what it learned between runs, behind rules anyone can read in the contract's published source." },
];

const onOrder = `// com.example declares: event com.example.OrderPlaced(orderId: string, total: decimal)
// and its Checkout contract emits one with each order.

contract com.example.OnOrderPlaced consumes com.example.OrderPlaced {
  const receipts: com.example.Receipts
  receipts.send(orderId: orderId, total: total)
}`;

const eventPatterns = [
  { title: "Webhooks without servers", text: "Subscribe to another organization's events with a contract on any node, instead of exposing an endpoint and checking signatures yourself." },
  { title: "Pipelines", text: "An event contract can emit events of its own, so one event can start a chain of up to four steps across nodes." },
  { title: "Private workflows", text: "Mark an event type restricted, and only contracts your own organization deployed receive it." },
];

const shipStruct = `// com.example declares the shape once, on one of its nodes.
struct com.example.Address@1(street: string, city: string, postcode: string)

// Anyone, on any node, can then use it as a type.
contract com.acme.Ship(to: com.example.Address@1): string {
  const carrier: com.acme.Carrier
  return carrier.label(city: to.city, postcode: to.postcode)
}`;

const structPatterns = [
  { title: "Shared vocabularies", text: "Declare an Address, an Invoice or a Forecast once, and every organization's contracts, events and resources can speak it." },
  { title: "Typed events", text: "Give event type fields struct types, so every consumer on every node gets the shape it expects." },
  { title: "Safe upgrades", text: "Versions are immutable and never deleted. Declare @2 for a new shape, and nothing that names @1 changes." },
];

const features = [
  { title: "Self-hosted", text: "A node runs inside your own Fastify app. Resource functions execute in your process, and their code never leaves your server." },
  { title: "Called by name", text: "Programs refer to resources by full name, like com.example.Weather. Your node works out which peer hosts each one and forwards the call." },
  { title: "Peer discovery", text: "Start a node with the address of any running peer. It copies that peer's peer and resource lists, then announces itself to the network." },
];

type LinkRow = { label: string; href: string; external?: boolean };

const linkGroups: { title: string; rows: LinkRow[] }[] = [
  {
    title: "Build",
    rows: [
      { label: "Run a node", href: "/build" },
      { label: "Deploy a contract", href: "/build/contracts" },
      { label: "React to events", href: "/build/events" },
      { label: "Share types with structs", href: "/build/structs" },
      { label: "HTTP API reference", href: "/build#http-api" },
      { label: "Stellarium Explorer", href: "/build/explorer" },
    ],
  },
  {
    title: "Learn",
    rows: [
      { label: "What is Stellarium?", href: "/learn" },
      { label: "Documentation", href: links.docs, external: true },
    ],
  },
  {
    title: "Contribute",
    rows: [
      { label: "stellarium-ts on GitHub", href: links.github, external: true },
      { label: "Discord", href: links.discord, external: true },
      { label: "Improvement proposals", href: "/sips" },
    ],
  },
];

export default function Home() {
  return (
    <main className={content.page}>
      <SiteNav />

      <section className={`${content.hero} ${styles.hero}`} id="top">
        <div>
          <p className={content.kicker}>Open source · Peer-to-peer</p>
          <h1>The World Computer for Humans and Agents</h1>
          <p className={content.lead}>Stellarium is an open, programmable API marketplace where anyone can host an API and get paid for it.</p>
          <div className={content.actions}>
            <a className={content.button} href={links.registry} target="_blank" rel="noreferrer">Explore <span aria-hidden="true">↗</span></a>
            <Link className={content.textLink} href="/build">Deploy <span aria-hidden="true">→</span></Link>
            <a className={content.textLink} href={links.claudeSkills} target="_blank" rel="noreferrer">Claude Skill <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={styles.install}>
          <CodeBlock label="Install" code={install} />
        </div>
      </section>

      <section className={content.section} id="network">
        <div className={content.sectionHead}><p className={content.kicker}>Overview</p><h2>Every API is a resource on the network</h2></div>
        <div className={content.body}>
          <p>A <strong>resource</strong> is a named object with typed functions, hosted on a node. Nodes share the resources they know about with their peers. Programs call resources by name, and each call is routed to the node that hosts it.</p>
        </div>
        <div className={styles.features}>
          {features.map((feature) => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></article>)}
        </div>
      </section>

      <section className={`${content.section} ${content.dark}`} id="how-it-works">
        <div className={content.sectionHead}><p className={content.kicker}>How it works</p><h2>One request, any number of nodes</h2></div>
        <div className={styles.columns}>
          <div>
            <h3><span>1</span> Host a resource</h3>
            <p>Register functions on your node. They run locally when called.</p>
            <CodeBlock label="server.ts" code={resource} />
          </div>
          <div>
            <h3><span>2</span> Write a request</h3>
            <p>Name the resources you need and call them. No URLs or API keys.</p>
            <CodeBlock label="GetTemperature.req" code={request} />
          </div>
          <div>
            <h3><span>3</span> Get one response</h3>
            <p>Send the request to <code>POST /v1/run</code> on any node.</p>
            <CodeBlock label="200 OK" code={response} />
            <p>A failed resource call returns an <code>error</code> value the script can check. It doesn&apos;t fail the whole request.</p>
          </div>
        </div>
      </section>

      <section className={content.section} id="payments">
        <div className={content.sectionHead}><p className={content.kicker}>Payments</p><h2>Charge per call, paid in USD</h2></div>
        <div className={content.body}>
          <p>Add a payment manifest to any function on a resource you host. Callers pay per successful call from their organization&apos;s prepaid balance, and you&apos;re paid out through Stripe. A valid payment also authorizes the call, so there is no billing system or key management to run.</p>
          <CodeBlock label="Function payment manifest" code={manifest} />
          <p><a href={`${links.docs}/concepts/payments`} target="_blank" rel="noreferrer">How payments work ↗</a></p>
        </div>
      </section>

      <section className={content.section} id="contracts">
        <div className={content.sectionHead}><p className={content.kicker}>Contracts</p><h2>Build applications on the network</h2></div>
        <div className={content.body}>
          <p>A <strong>contract</strong> is a RequestScript program you deploy to any node with <code>POST /v1/contracts</code>. It becomes a resource like any other: anyone can call it, and it can call any resource itself. You don&apos;t write TypeScript or run a server, and every call is paid for by whoever made it.</p>
          <p>Contracts can keep <strong>state between calls</strong>. Declare a variable with <code>var state</code> and it&apos;s saved each time a call succeeds. Only the contract&apos;s own code can change it, so its published source is also the policy for its data.</p>
          <CodeBlock label="Assistant.req" code={stateful} />
          <p>This contract is a long-lived assistant. Each call adds the new message to the conversation it has stored, sends the whole history to Claude Sonnet through an <Link href="/ai/inference-functions">inference function</Link>, and saves the reply. Every organization gets its own conversation, and the caller pays for the tokens. A call that fails saves nothing, and calls to a stateful contract take turns, so no message is lost.</p>
          <p><Link href="/build/contracts">How contracts work →</Link></p>
        </div>
        <div className={styles.features}>
          {appPatterns.map((pattern) => <article key={pattern.title}><h3>{pattern.title}</h3><p>{pattern.text}</p></article>)}
        </div>
      </section>

      <section className={content.section} id="events">
        <div className={content.sectionHead}><p className={content.kicker}>Events</p><h2>Contracts that react to each other</h2></div>
        <div className={content.body}>
          <p>An organization declares an <strong>event type</strong> and its scripts <code>emit</code> events of that type. Anyone can deploy an <strong>event contract</strong> on any node that <code>consumes</code> it, and runs with each event, wherever it was published.</p>
          <CodeBlock label="OnOrderPlaced.req" code={onOrder} />
          <p>Events are signed by the node that published them and checked by every node that receives them, so only the type&apos;s owner can emit it. A run that fails publishes nothing, and each event contract runs once per event. Whoever deploys an event contract pays for its runs, so subscribing never costs the publisher.</p>
          <p><Link href="/build/events">How events work →</Link></p>
        </div>
        <div className={styles.features}>
          {eventPatterns.map((pattern) => <article key={pattern.title}><h3>{pattern.title}</h3><p>{pattern.text}</p></article>)}
        </div>
      </section>

      <section className={content.section} id="structs">
        <div className={content.sectionHead}><p className={content.kicker}>Structs</p><h2>A Universal Type-System for the Internet</h2></div>
        <div className={content.body}>
          <p>A <strong>struct</strong> names the shape of an object: its fields and the type of each. An organization declares it once, and anyone on the network can use it as a type in contracts, event types and resource functions, so values are checked wherever they&apos;re passed, returned or emitted, instead of travelling as an unchecked <code>object</code>.</p>
          <CodeBlock label="Ship.req" code={shipStruct} />
          <p>Every reference names a version, and versions never change or go away, so <code>com.example.Address@1</code> means the same fields on every node, forever. Nodes learn structs from their peers through signed announcements, and only the organization that owns a path can declare it. Checking is structural, so any value with the right fields fits.</p>
          <p><Link href="/build/structs">How structs work →</Link></p>
        </div>
        <div className={styles.features}>
          {structPatterns.map((pattern) => <article key={pattern.title}><h3>{pattern.title}</h3><p>{pattern.text}</p></article>)}
        </div>
      </section>

      <section className={content.section} id="get-started">
        <div className={content.sectionHead}><p className={content.kicker}>Get started</p><h2>Next steps</h2></div>
        <div className={styles.linkGrid}>
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.rows.map((row) => (
                  <li key={row.label}>
                    {row.external
                      ? <a href={row.href} target="_blank" rel="noreferrer">{row.label}<span aria-hidden="true">↗</span></a>
                      : <Link href={row.href}>{row.label}<span aria-hidden="true">→</span></Link>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
