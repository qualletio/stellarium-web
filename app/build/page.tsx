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
  title: "Run a node",
  description: "Step by step guide to running a Stellarium node with stellarium-ts and Fastify: install, register API resources, join a network, and use the HTTP API.",
  path: "/build",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Run a Stellarium node",
  description: "Step by step guide to running a Stellarium node with stellarium-ts and Fastify.",
  url: `${siteUrl}/build`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const readme = `${links.github}#running-a-node`;

const install = "npm install stellarium-ts fastify requestscript";

const startNode = `import Fastify from "fastify";
import { StellariumNode } from "stellarium-ts";
import type { Resource } from "requestscript";

const weather: StellariumResource = {
  metadata: {},
  path: "com.example",
  name: "Weather",
  functions: [
    {
      name: "temperature",
      parameters: [{ name: "city", type: "string" }],
      returnType: "int32",
      exec: async (args) => {
        const city = args.find((arg) => arg.name === "city")?.value;
        return city === "Oslo" ? 12 : 20;
      },
    },
  ],
};

const node = new StellariumNode();
await node.register(weather);

const fastify = Fastify({ logger: true });
await node.start(fastify, {
  port: 3000,
  // Omit this to run standalone. Set it to copy peers and resources
  // from a node that is already up.
  startingPeer: "http://127.0.0.1:3001",
});`;

const envFile = `BASE_URL=http://127.0.0.1:3000
SIGNING_PRIVATE_KEY=<your base64url private key>
SIGNING_PUBLIC_KEY=<your base64url public key>
API_KEY=<a secret your clients send to this node>`;

const keygen = `node --input-type=module -e '
import { generateKeyPairSync } from "node:crypto";

const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
  publicKeyEncoding: { type: "spki", format: "der" },
  privateKeyEncoding: { type: "pkcs8", format: "der" },
});

console.log(JSON.stringify({
  publicKey: publicKey.toString("base64url"),
  privateKey: privateKey.toString("base64url"),
}, null, 2));
'`;

const curl = `curl -X POST http://127.0.0.1:3000/v1/run \\
  -H 'Content-Type: application/json' \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{"source": "request GetTemperature {\\n  const weather: com.example.Weather\\n  const reading = weather.temperature(city: \\"Oslo\\")\\n  return reading.value\\n}"}'`;

const curlResponse = `{ "returnValue": 12 }`;

export default function BuildPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Build / Node guide</p>
          <h1>Run a Stellarium node</h1>
          <p className={styles.lead}>A node hosts your APIs, keeps a list of the resources its peers host, and forwards requests to the node that can answer them. This guide goes from an empty folder to a running node in four steps.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#prerequisites">Start the guide <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={readme} target="_blank" rel="noreferrer">README <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Node package" items={[
          ["Package", <code key="p">stellarium-ts</code>],
          ["Runtime", "Node.js 20+"],
          ["Server", "Fastify 5"],
          ["Storage", <code key="s">requestscript.db</code>],
          ["API", <code key="a">/v1</code>],
        ]} />
      </section>

      <section className={styles.section} id="prerequisites">
        <div className={styles.sectionHead}><p className={styles.kicker}>Step 01</p><h2>Prerequisites</h2></div>
        <div className={styles.body}>
          <p>You will need three things before you start:</p>
          <ul>
            <li><strong>Node.js 20 or newer.</strong></li>
            <li><strong><a href="https://fastify.dev/" target="_blank" rel="noreferrer">Fastify</a> 5.</strong> You create the Fastify server yourself and hand it to the node.</li>
            <li><strong><a href="https://www.npmjs.com/package/requestscript" target="_blank" rel="noreferrer">RequestScript</a>.</strong> It provides the <code>Resource</code> type that describes the APIs your node hosts.</li>
          </ul>
          <p>Then install the node along with the packages your app imports directly:</p>
          <CodeBlock label="Terminal" code={install} />
        </div>
      </section>

      <section className={styles.section} id="register">
        <div className={styles.sectionHead}><p className={styles.kicker}>Step 02</p><h2>Register a resource and start the node</h2></div>
        <div className={styles.body}>
          <p>A <strong>resource</strong> is an object that RequestScript programs can call. Its <code>path</code> and <code>name</code> together make its full name, for example <code>com.example.Weather</code>. Each function lists its parameter types and return type, and its <code>exec</code> function runs right here in your process.</p>
          <p>Call <code>register</code> before <code>start</code>. When you call <code>start</code>, the node creates its SQLite database, mounts the HTTP API, and starts listening.</p>
          <CodeBlock label="server.ts" code={startNode} />

          <h3>Node options</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Option</th><th>Default</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td><code>port</code></td><td><code>3000</code></td><td>The port Fastify listens on.</td></tr>
                <tr><td><code>startingPeer</code></td><td>none</td><td>The address of a peer to join through. Leave off the <code>/v1</code> at the end.</td></tr>
              </tbody>
            </table>
          </div>

          <h3 id="environment">Environment variables</h3>
          <p>The node loads a <code>.env</code> file from your working directory automatically, so you can put these settings there.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Variable</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td><code>BASE_URL</code></td><td>The public address of this node. Peers send resource calls to <code>{"{BASE_URL}"}/v1/run/resource</code>, so set it to something like <code>http://127.0.0.1:3000</code>. Don&apos;t include <code>/v1</code>.</td></tr>
                <tr><td><code>SIGNING_PRIVATE_KEY</code></td><td>Your ED25519 private key, base64url encoded. The node uses it to sign what it publishes to peers.</td></tr>
                <tr><td><code>SIGNING_PUBLIC_KEY</code></td><td>The matching ED25519 public key, base64url encoded. Peers use it to check your signatures. It must pair with the private key.</td></tr>
                <tr><td><code>API_KEY</code></td><td>A secret your clients must send as <code>Authorization: Bearer &lt;API_KEY&gt;</code> to run requests on this node.</td></tr>
                <tr><td><code>OPERATOR_URL</code></td><td>Only needed if you host priced resources. The operator address your node sends payment vouchers to.</td></tr>
              </tbody>
            </table>
          </div>
          <CodeBlock label=".env" code={envFile} />
          <p>Don&apos;t have signing keys yet? Run this script to generate a pair:</p>
          <CodeBlock label="Terminal" code={keygen} />
          <p>The node keeps the peers and resources it learns about in a file called <code>requestscript.db</code> in your working directory. It is created the first time the node starts.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="join">
        <div className={styles.sectionHead}><p className={styles.kicker}>Step 03</p><h2>Join a network</h2></div>
        <div className={styles.body}>
          <p>A node with no <code>startingPeer</code> runs on its own. To join an existing network, set <code>startingPeer</code> to the address of a node that is already running. Once your node is listening, it does four things:</p>
        </div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>Copies the peer list</h3><p>It calls <code>GET /v1/peers</code> on the starting peer. If your node has no peers yet, it saves that list. If it already has peers, it keeps its own list.</p></div></article>
          <article><span>02</span><div><h3>Copies the resource list</h3><p>It calls <code>GET /v1/resources</code> and saves each resource along with the address of the node that hosts it.</p></div></article>
          <article><span>03</span><div><h3>Introduces itself</h3><p>It tells every peer in the network that it exists.</p></div></article>
          <article><span>04</span><div><h3>Shares its own resources</h3><p>It tells the network about the resources you registered, so others can call them.</p></div></article>
        </div>
        <div className={styles.body}>
          <p className={styles.afterSteps}>After that, if a program asks for a resource registered on your node, your <code>exec</code> function runs locally. If it asks for one hosted somewhere else, your node forwards the request to that peer and hands back its answer.</p>
        </div>
      </section>

      <section className={styles.section} id="http-api">
        <div className={styles.sectionHead}><p className={styles.kicker}>Step 04</p><h2>HTTP API</h2></div>
        <div className={styles.body}>
          <p>Every node exposes a small HTTP API under <code>/v1</code>.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Route</th><th>Body</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td><code>GET /v1/</code></td><td>none</td><td>Health check. Responds with <code>{`{ "hello": "world" }`}</code>.</td></tr>
                <tr><td><code>GET /v1/peers</code></td><td>none</td><td>Lists the peers this node knows about.</td></tr>
                <tr><td><code>GET /v1/resources</code></td><td>none</td><td>Lists resources hosted here and resources learned from peers. Function code always stays on the node that hosts it.</td></tr>
                <tr><td><code>POST /v1/run</code></td><td><code>{`{ "source": "..." }`}</code></td><td>Runs one RequestScript <code>request</code>. Requires your <code>API_KEY</code>.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Run your first request</h3>
          <p>Send the script as the <code>source</code> field of a JSON body to <code>/v1/run</code>, with your <code>API_KEY</code> as a bearer token. The script must be a <code>request</code>.</p>
          <CodeBlock label="Terminal" code={curl} />
          <p>If it works, you get back a <code>200</code> with the result:</p>
          <CodeBlock label="Response" code={curlResponse} />
          <p>A missing or wrong API key returns a <code>401</code>. If the script isn&apos;t a request, you get a <code>400</code> with <code>{`{ "error": "Invalid script" }`}</code>. Anything else that goes wrong returns a <code>500</code>. A resource call that fails does not fail the request: it comes back as an <code>error</code> value your script can check.</p>
          <p>To learn more about writing scripts, read the <a href={links.requestscript} target="_blank" rel="noreferrer">RequestScript docs</a>. For the full reference, see the <a href={readme} target="_blank" rel="noreferrer">stellarium-ts README</a>.</p>
        </div>
      </section>

      <section className={styles.callout}><p>Stuck on a step? Ask in the Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/build/explorer">Stellarium Explorer</Link></div></section>
      <SiteFooter />
    </main>
  );
}
