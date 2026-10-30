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
  title: "Contracts",
  description: "Deploy RequestScript contracts to any Stellarium node: resources written without TypeScript, billed by the tokens they run, with every paid call paid by the caller.",
  path: "/build/contracts",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Contracts",
  description: "How contracts let anyone deploy RequestScript resources to a Stellarium node.",
  url: `${siteUrl}/build/contracts`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const readme = `${links.github}#contracts`;

const contract = `contract com.example.Outlook(city: string): string {
  const weather: com.example.Weather
  const today = weather.temperature(city: city)
  if (today.error != null) {
    return "unknown"
  }
  return "\${today.value} degrees"
}`;

const deploy = `curl -X POST https://node.example/v1/contracts \\
  -H 'Content-Type: application/json' \\
  -H "Authorization: Bearer $RUN_TOKEN" \\
  -d '{"source": "contract com.example.Outlook(city: string): string { ... }", "description": "Today in words"}'`;

const deployResponse = `{ "path": "com.example", "name": "Outlook", "version": "1", "feeMicroUsd": 1000 }`;

const script = `request Today {
  const outlook: com.example.Outlook
  return outlook.run(city: "Oslo")
}`;

const scriptResponse = `{ "returnValue": { "value": "12 degrees", "error": null }, "usage": { "tokens": 17 } }`;

const hostEnv = `# What another organization pays to deploy a contract here, in micro-USD.
CONTRACT_DEPLOY_FEE_MICRO_USD=1000
# The largest contract this node accepts. Defaults to 64 KiB.
MAX_CONTRACT_SOURCE_BYTES=65536`;

const callerEnv = `# The most one call to a contract on another node may cost, with the
# paid calls the contract makes, in micro-USD. Defaults to COST_LIMIT_MICRO_USD.
CONTRACT_COST_LIMIT_MICRO_USD=50000`;

const stateExample = `contract com.example.Visits(page: string): int32 {
  var state total: int32 = 0
  var state(caller.org) mine: int32 = 0

  total = total + 1
  mine = mine + 1
  return mine
}`;

export default function ContractsPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Build / Contracts</p>
          <h1>Contracts</h1>
          <p className={styles.lead}>A contract is a RequestScript script you deploy to a node. It becomes one of the node&apos;s resources, so anyone on the network can call it, and it can call any resource itself. You don&apos;t write TypeScript or run your own node, and every call is paid for by whoever made it.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#what">How it works <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={readme} target="_blank" rel="noreferrer">README <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Contract summary" items={[
          ["Language", "RequestScript 1.4+"],
          ["Deploy", <code key="d">POST /v1/contracts</code>],
          ["Function", <code key="f">run</code>],
          ["Price", "The node's price per million tokens"],
        ]} />
      </section>

      <section className={styles.section} id="what">
        <div className={styles.sectionHead}><p className={styles.kicker}>01</p><h2>What is a contract?</h2></div>
        <div className={styles.body}>
          <p>Most resources on Stellarium are TypeScript objects that a node&apos;s owner registers before the node starts. A <strong>contract</strong> is a resource written in RequestScript instead, and deployed to a node that&apos;s already running, by its owner or by another organization.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th></th><th>Registered resource</th><th>Contract</th></tr></thead>
              <tbody>
                <tr><td>Written in</td><td>TypeScript</td><td>RequestScript</td></tr>
                <tr><td>Added by</td><td>the node&apos;s owner, at startup</td><td>anyone with a run token, at any time</td></tr>
                <tr><td>Functions</td><td>any you declare</td><td>one, <code>run</code>, taking the contract&apos;s parameters</td></tr>
                <tr><td>Price</td><td>per call, per token, or free</td><td>the tokens it runs, at the node&apos;s price</td></tr>
                <tr><td>Code</td><td>stays private on the node</td><td>public: anyone can read what a call does</td></tr>
              </tbody>
            </table>
          </div>
          <p>To a script, a contract looks like any other resource. Peers learn about it as soon as it&apos;s deployed.</p>
        </div>
      </section>

      <section className={styles.section} id="write">
        <div className={styles.sectionHead}><p className={styles.kicker}>02</p><h2>Write one</h2></div>
        <div className={styles.body}>
          <p>A contract is a RequestScript <code>contract</code> with two requirements:</p>
          <ul>
            <li><strong>A path</strong>, such as <code>com.example</code>, so its full name is unique on the network.</li>
            <li><strong>A return type</strong> after its parameters. The value it returns is checked against it, and callers see it in the resource listing.</li>
          </ul>
          <CodeBlock label="Outlook.req" code={contract} />
          <p>This contract calls the paid <code>com.example.Weather</code> resource and turns its answer into words. Like any script, it checks <code>error</code> on a call&apos;s result, so a failed call doesn&apos;t fail the contract.</p>
        </div>
      </section>

      <section className={styles.section} id="deploy">
        <div className={styles.sectionHead}><p className={styles.kicker}>03</p><h2>Deploy it</h2></div>
        <div className={styles.body}>
          <p>Send the source to the node&apos;s <code>POST /v1/contracts</code>, with a run token from one of your organization&apos;s API clients for that node. Create the API client on the <a href={links.platform} target="_blank" rel="noreferrer">Stellarium Platform</a>. The node&apos;s owner can also use its API key.</p>
          <CodeBlock label="Terminal" code={deploy} />
          <CodeBlock label="Response" code={deployResponse} />
          <ul>
            <li><strong>Deploying may cost a fee.</strong> A node sets what other organizations pay to deploy to it. The fee comes out of your API client&apos;s run, and isn&apos;t charged if the deploy is refused. Deploying to your own organization&apos;s node is free.</li>
            <li><strong>Peers hear about it right away.</strong> The node announces its resources again, so other nodes can call the contract without restarting.</li>
            <li><strong>Names are first come, first served.</strong> A contract can&apos;t take the name of another resource on the network.</li>
          </ul>
          <p>If you run a node, these settings control what others can deploy to it:</p>
          <CodeBlock label=".env" code={hostEnv} />
        </div>
      </section>

      <section className={styles.section} id="call">
        <div className={styles.sectionHead}><p className={styles.kicker}>04</p><h2>Call it</h2></div>
        <div className={styles.body}>
          <p>A script binds a contract like any resource and calls its <code>run</code> function:</p>
          <CodeBlock label="Today.req" code={script} />
          <CodeBlock label="Response" code={scriptResponse} />
          <p>Contracts can call other contracts, up to 8 deep, so a loop between them stops. A contract that fails, for example by dividing by zero, comes back as the call&apos;s <code>error</code>.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="paying">
        <div className={styles.sectionHead}><p className={styles.kicker}>05</p><h2>How a call is paid</h2></div>
        <div className={styles.body}>
          <p>A contract runs on a node that didn&apos;t write it, and it may make paid calls of its own. Stellarium makes one rule hold for every call: <strong>the caller pays for everything the contract does</strong>, never the node hosting it.</p>
        </div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>The caller signs a voucher</h3><p>Its node signs a contract voucher with the node&apos;s advertised price and <code>maxAmount</code>, the most the call may cost. A call made from a billed run carries that run&apos;s id too.</p></div></article>
          <article><span>02</span><div><h3>The host checks it</h3><p>The voucher must be for this exact call, unexpired, signed by the caller and paying the host&apos;s organization. Without one, the call is refused before anything runs.</p></div></article>
          <article><span>03</span><div><h3>The operator holds the cost</h3><p>It opens a run for the call and holds up to <code>maxAmount</code> on the caller&apos;s balance, or out of the caller&apos;s own run. It never charges more than the price the caller signed.</p></div></article>
          <article><span>04</span><div><h3>The contract runs</h3><p>Every paid call the contract makes draws on that run, so the host never pays for a caller&apos;s contract.</p></div></article>
          <article><span>05</span><div><h3>The host reports its tokens</h3><p>Afterwards, the host captures the tokens the contract executed, charged at its price per million tokens. A contract that failed is still charged for what it ran.</p></div></article>
          <article><span>06</span><div><h3>The rest goes back</h3><p>Whatever the run didn&apos;t spend returns to where it came from: the caller&apos;s balance, or the caller&apos;s run.</p></div></article>
        </div>
        <div className={styles.body}>
          <p className={styles.afterSteps}>A contract that makes paid calls costs more than one call, so a node that calls contracts can raise its ceiling:</p>
          <CodeBlock label=".env" code={callerEnv} />
        </div>
      </section>

      <section className={styles.section} id="versions">
        <div className={styles.sectionHead}><p className={styles.kicker}>06</p><h2>Versions and ownership</h2></div>
        <div className={styles.body}>
          <ul>
            <li><strong>Versions are immutable.</strong> To change a contract, deploy it again with a new version, such as <code>contract com.example.Outlook@2(...)</code>. Deploying a version that exists is refused.</li>
            <li><strong>Calls run the latest version.</strong> <code>GET /v1/contracts</code> lists every version with its source, so you can read exactly what a call will do.</li>
            <li><strong>The first organization to deploy a contract owns it.</strong> Only its API clients can add versions or delete it with <code>DELETE /v1/contracts/com.example.Outlook@2</code>. The node&apos;s owner can delete any contract on their node.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="state">
        <div className={styles.sectionHead}><p className={styles.kicker}>07</p><h2>Keep state between calls</h2></div>
        <div className={styles.body}>
          <p>A contract can keep values between calls in <strong>state variables</strong>, declared with <code>var state</code> at the top of its body. Only the contract&apos;s own code can change them, so the published source is also the policy for its data: a counter, a quota, a cache, or an agent&apos;s memory.</p>
          <CodeBlock label="Visits.req" code={stateExample} />
          <ul>
            <li><strong><code>var state name</code></strong> is one copy shared by every caller. <strong><code>var state(scope) name</code></strong> keeps a copy for each value of <code>scope</code>, any expression that evaluates to a string or a number.</li>
            <li><strong><code>caller</code></strong> tells a contract who it runs for: <code>caller.org</code> is the organization paying for the call, and <code>caller.node</code> the node that made it. Both are verified, so <code>state(caller.org)</code> gives each organization a copy no one else can reach.</li>
            <li><strong>State is saved only when a call succeeds.</strong> A call that fails, or would grow its state past the node&apos;s limit (64 KiB a scope by default), saves nothing.</li>
            <li><strong>Calls to a stateful contract take turns</strong> on its node, so concurrent calls never lose an update.</li>
            <li><strong>State outlives versions.</strong> A new version keeps it, and deleting the contract deletes it.</li>
            <li><strong>State is private.</strong> A contract shares what it returns. Its owner and the node&apos;s operator can read the rest for debugging.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="reference">
        <div className={styles.sectionHead}><p className={styles.kicker}>08</p><h2>Reference</h2></div>
        <div className={styles.body}>
          <p>Contracts appear in <code>GET /v1/resources</code> with <code>kind: &quot;contract&quot;</code> and their price, alongside every other function. Read the full reference in the <a href={readme} target="_blank" rel="noreferrer">stellarium-ts README</a> and the <a href={links.docs} target="_blank" rel="noreferrer">documentation</a>, and learn the language at <a href={links.requestscriptSite} target="_blank" rel="noreferrer">requestscript.org</a>.</p>
        </div>
      </section>

      <section className={styles.callout}><p>Built a contract? Show it off on Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/build">Run a node</Link></div></section>
      <SiteFooter />
    </main>
  );
}
