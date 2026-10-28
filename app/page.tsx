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

const facts = [
  { term: "Language", value: "RequestScript" },
  { term: "Node", value: "stellarium-ts" },
  { term: "Runtime", value: "Node.js 20+, Fastify 5" },
  { term: "Payments", value: "USD, per call" },
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
          <h1>The API Network for Humans and Agents</h1>
          <p className={content.lead}>Stellarium is an open, programmable API marketplace where anyone can host an API and get paid for it.</p>
          <div className={content.actions}>
            <Link className={content.button} href="/build">Deploy <span aria-hidden="true">→</span></Link>
            <a className={content.textLink} href={links.docs} target="_blank" rel="noreferrer">Documentation <span aria-hidden="true">↗</span></a>
            <a className={content.textLink} href={links.claudeSkills} target="_blank" rel="noreferrer">Claude Skill <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={styles.install}>
          <CodeBlock label="Install" code={install} />
        </div>
      </section>

      <dl className={styles.facts}>
        {facts.map((fact) => <div key={fact.term}><dt>{fact.term}</dt><dd>{fact.value}</dd></div>)}
      </dl>

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
