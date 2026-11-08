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
  title: "Autonomous agents",
  description: "How autonomous agents run their own requests and deploy their own contracts, event types and structs on Stellarium, inside spending limits you set.",
  path: "/ai/autonomous-agents",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Autonomous agents",
  description: "How autonomous agents deploy and call their own requests, contracts, events and structs on the Stellarium network.",
  url: `${siteUrl}/ai/autonomous-agents`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const apiClientsDocs = `${links.docs}/concepts/api-clients`;
const deployDocs = `${links.docs}/deploy-github-actions`;

const token = `TOKEN="$(curl -s -X POST https://operator.stellarium.sh/v1/oauth/token \\
  -d grant_type=client_credentials \\
  -d client_id="$STELLARIUM_CLIENT_ID" \\
  -d client_secret="$STELLARIUM_CLIENT_SECRET" \\
  | jq -r .access_token)"`;

const discover = `curl "$STELLARIUM_NODE_URL/v1/resources?limit=500"
curl "$STELLARIUM_NODE_URL/v1/contracts?limit=500"
curl "$STELLARIUM_NODE_URL/v1/events?limit=500"
curl "$STELLARIUM_NODE_URL/v1/structs?limit=500"`;

const request = `request AskSonnet {
  const sonnet: sh.stellarium.inference.claude.Sonnet

  const reply = sonnet.message(prompt: "Name one use for a weather API", maxTokens: 200)
  if (reply.error != null) {
    return reply.error.message
  }

  return reply.value
}`;

const run = `curl -X POST "$STELLARIUM_NODE_URL/v1/run" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H 'Content-Type: application/json' \\
  -d "$(jq -n --rawfile source AskSonnet.req '{source: $source}')"`;

const runResponse = `{ "returnValue": "Plan a delivery route around storms", "usage": { "tokens": 31 } }`;

const struct = `struct com.example.Digest@1(topic: string, summary: string)`;

const event = `event com.example.DigestReady@1(digest: com.example.Digest@1)`;

const contract = `contract com.example.Summarize@1(topic: string, text: string): com.example.Digest@1 {
  const sonnet: sh.stellarium.inference.claude.Sonnet

  const reply = sonnet.message(prompt: "Summarize in one line: \${text}", maxTokens: 400)
  if (reply.error != null) {
    var failed: com.example.Digest@1 = { topic: topic, summary: "unavailable" }
    return failed
  }

  var digest: com.example.Digest@1 = { topic: topic, summary: reply.value }
  emit com.example.DigestReady(digest: digest)
  return digest
}`;

const eventContract = `contract com.example.OnDigestReady@1 consumes com.example.DigestReady@1 {
  var state(digest.topic) latest: string = ""

  latest = digest.summary
}`;

const deploy = `npm install -g stellarium-cli

export STELLARIUM_NODE_URL=https://node.example.com    # no /v1
export STELLARIUM_OPERATOR_URL=https://operator.stellarium.sh/v1
export STELLARIUM_CLIENT_ID=cli_...
export STELLARIUM_CLIENT_SECRET=cs_...

stellarium --output agent deploy --dry-run stellarium/
stellarium --output agent deploy stellarium/`;

const deployOutput = `deployed struct com.example.Digest@1 stellarium/Digest.req
deployed event com.example.DigestReady@1 stellarium/DigestReady.req
deployed contract com.example.Summarize@1 stellarium/Summarize.req
deployed contract com.example.OnDigestReady@1 stellarium/OnDigestReady.req
summary: 4 deployed, 0 unchanged`;

const call = `request SummarizeStandup {
  const summarize: com.example.Summarize

  return summarize.run(topic: "standup", text: "Shipped the fix. Docs are next.")
}`;

const readState = `curl "$STELLARIUM_NODE_URL/v1/contracts/com.example.OnDigestReady/state" \\
  -H "Authorization: Bearer $TOKEN"`;

export default function AutonomousAgentsPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>AI / Autonomous agents</p>
          <h1>Autonomous agents</h1>
          <p className={styles.lead}>An agent can do more on Stellarium than call APIs. With one set of credentials, it can write and run its own requests, deploy contracts other programs can call, declare events and structs, and react to what happens on the network, all inside a budget you set.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#setup">Set up an agent <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={apiClientsDocs} target="_blank" rel="noreferrer">API clients docs <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Autonomous agent summary" items={[
          ["Identity", "An API client for one node"],
          ["Auth", "OAuth client credentials"],
          ["Run", <code key="r">POST /v1/run</code>],
          ["Deploy", <code key="d">stellarium deploy</code>],
        ]} />
      </section>

      <section className={styles.section} id="setup">
        <div className={styles.sectionHead}><p className={styles.kicker}>01</p><h2>Give the agent credentials</h2></div>
        <div className={styles.body}>
          <p>An agent acts through an <strong>API client</strong>. A person does this part once: an organization admin adds funds and creates the client for one node on the <a href={links.platform} target="_blank" rel="noreferrer">Stellarium Platform</a>, setting the most one run may cost and an optional monthly cap. After that, the agent works on its own.</p>
          <p>The node you choose decides what the agent can do:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th></th><th>Your organization&apos;s node</th><th>Another organization&apos;s listed node</th></tr></thead>
              <tbody>
                <tr><td>Run requests</td><td>yes, no script charge</td><td>yes, at the node&apos;s price per million script tokens</td></tr>
                <tr><td>Deploy contracts</td><td>yes, free</td><td>yes, plus the node&apos;s deploy fee, if it has one</td></tr>
                <tr><td>Deploy event contracts</td><td>yes, runs are free</td><td>yes, billed per event under a mandate</td></tr>
                <tr><td>Declare event types and structs</td><td>yes</td><td>no</td></tr>
                <tr><td>Emit events</td><td>yes, for event types you own</td><td>no</td></tr>
              </tbody>
            </table>
          </div>
          <p>The agent exchanges the client ID and secret for a <strong>run token</strong>:</p>
          <CodeBlock label="Terminal" code={token} />
          <p>A run token lasts 15 minutes and works on any number of runs, but only on the node its client was created for. When it expires, the agent asks for a new one. To use several nodes, give the agent one client for each.</p>
        </div>
      </section>

      <section className={styles.section} id="discover">
        <div className={styles.sectionHead}><p className={styles.kicker}>02</p><h2>Find what&apos;s on the network</h2></div>
        <div className={styles.body}>
          <p>Before writing any code, an agent can read what the network offers. These routes need no authorization, and return one page at a time with a <code>nextOffset</code>:</p>
          <CodeBlock label="Terminal" code={discover} />
          <p>Resources come with descriptions, parameter types, return types and prices, so a model can choose a function and call it correctly from the listing alone. Contracts also include their full source, so the agent can read exactly what one does before paying for it.</p>
        </div>
      </section>

      <section className={styles.section} id="requests">
        <div className={styles.sectionHead}><p className={styles.kicker}>03</p><h2>Run its own requests</h2></div>
        <div className={styles.body}>
          <p>A <strong>request</strong> is a one-off RequestScript program, and the quickest way for an agent to act. The agent writes the script, sends it, and reads the result. Nothing is deployed. One request can call any number of resources, including AI models.</p>
          <CodeBlock label="AskSonnet.req" code={request} />
          <CodeBlock label="Terminal" code={run} />
          <CodeBlock label="Response" code={runResponse} />
          <p>RequestScript has no loops, so the most tokens a script can execute is known before it runs. A generated script can&apos;t spin forever, and one that would cost more than the client allows is refused before it starts.</p>
        </div>
      </section>

      <section className={styles.section} id="deploy">
        <div className={styles.sectionHead}><p className={styles.kicker}>04</p><h2>Deploy contracts, events and structs</h2></div>
        <div className={styles.body}>
          <p>When a request is worth keeping, the agent can deploy it. Deployed code stays on the network, where other programs can use it after the agent&apos;s session ends.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Deploy a</th><th>When the agent wants to</th><th>Route</th></tr></thead>
              <tbody>
                <tr><td><Link href="/build/structs">Struct</Link></td><td>name a data shape every node can check</td><td><code>POST /v1/structs</code></td></tr>
                <tr><td><Link href="/build/events">Event type</Link></td><td>announce that something happened</td><td><code>POST /v1/events</code></td></tr>
                <tr><td><Link href="/build/contracts">Contract</Link></td><td>publish a function anyone can call</td><td><code>POST /v1/contracts</code></td></tr>
                <tr><td><Link href="/build/events#consume">Event contract</Link></td><td>run code whenever an event arrives</td><td><code>POST /v1/contracts</code></td></tr>
              </tbody>
            </table>
          </div>
          <p>Here, an agent publishes a summarizer. It writes one declaration per file in a directory:</p>
          <CodeBlock label="stellarium/Digest.req" code={struct} />
          <CodeBlock label="stellarium/DigestReady.req" code={event} />
          <CodeBlock label="stellarium/Summarize.req" code={contract} />
          <CodeBlock label="stellarium/OnDigestReady.req" code={eventContract} />
          <p>The Stellarium CLI is the simplest way to deploy them. It gets its own run token, and deploys structs first, then event types, then contracts, so each declaration can name the ones before it. <code>--dry-run</code> compares each file&apos;s declaration with the node without changing anything. <code>--output agent</code> prints plain text, and piped output is JSON by default.</p>
          <CodeBlock label="Terminal" code={deploy} />
          <CodeBlock label="Output" code={deployOutput} />
          <ul>
            <li><strong>Deploying again is safe.</strong> Versions the node already has with the same content are left alone and cost nothing, so the agent can retry a deploy freely.</li>
            <li><strong>Changes need a new version.</strong> Versions are immutable. To change a contract, the agent deploys it as <code>@2</code>. Calls always run the latest version.</li>
            <li><strong>Dry runs don&apos;t check contract bodies.</strong> A syntax error in a body only shows up on the real deploy.</li>
            <li><strong>Other nodes learn right away.</strong> A node announces new contracts to its peers after each deploy.</li>
            <li><strong>Names are taken once.</strong> The first organization to deploy a contract owns every version of it, so use a path your organization controls.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="call">
        <div className={styles.sectionHead}><p className={styles.kicker}>05</p><h2>Call and react</h2></div>
        <div className={styles.body}>
          <p>A contract is a resource like any other. Once it&apos;s deployed, the agent, or any other program on the network, binds it by name and calls <code>run</code>:</p>
          <CodeBlock label="SummarizeStandup.req" code={call} />
          <p>When <code>Summarize</code> succeeds, it emits <code>DigestReady</code>. The event contract runs on its own, with no request from the agent, and stores the summary in contract state. State is private, so the agent reads it with its client:</p>
          <CodeBlock label="Terminal" code={readState} />
          <p>That gives the agent memory between sessions: state survives restarts, and it&apos;s saved only when a run succeeds. Events can also connect agents that know nothing about each other. Any organization can deploy an event contract for an event type that isn&apos;t <code>restricted</code>, on any node that knows the type.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="paying">
        <div className={styles.sectionHead}><p className={styles.kicker}>06</p><h2>Who pays</h2></div>
        <div className={styles.body}>
          <p>Everything an agent spends comes from its organization&apos;s prepaid balance, in USD. Each run is held first, and only what it used is charged.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Action</th><th>What the agent&apos;s organization pays</th></tr></thead>
              <tbody>
                <tr><td>Run a request</td><td>the node&apos;s price for script tokens executed, free on its own nodes, plus any paid functions the script calls</td></tr>
                <tr><td>Call an AI model</td><td>the tokens used, never more than the signed ceiling</td></tr>
                <tr><td>Deploy a contract</td><td>the node&apos;s deploy fee, free on its own nodes</td></tr>
                <tr><td>Call a contract</td><td>the tokens it executes and every paid call it makes, free in its own organization</td></tr>
                <tr><td>Have its contract called</td><td>nothing: the caller pays</td></tr>
                <tr><td>Emit an event</td><td>only the publishing run&apos;s tokens</td></tr>
                <tr><td>Run an event contract</td><td>each run, under a mandate on other organizations&apos; nodes, free on its own</td></tr>
              </tbody>
            </table>
          </div>
          <p>A contract is billed at its hosting node&apos;s listed price, and that node&apos;s organization earns it, so an agent&apos;s contract on your own listed node can earn when others call it.</p>
        </div>
      </section>

      <section className={styles.section} id="limits">
        <div className={styles.sectionHead}><p className={styles.kicker}>07</p><h2>Keep it within limits</h2></div>
        <div className={styles.body}>
          <p>An agent makes its own decisions, so set its limits before it starts. The network enforces these, whatever code the agent writes:</p>
          <ul>
            <li><strong>Max per run.</strong> The most one run can cost, including its paid calls. It defaults to $1.</li>
            <li><strong>Monthly cap.</strong> Set one on any client an agent uses unattended.</li>
            <li><strong>One node per client.</strong> A leaked run token works on one node, for at most 15 minutes.</li>
            <li><strong>Revocation.</strong> Revoking a client on the Platform refuses its billed runs at once and stops new tokens. Unbilled runs on your own nodes can continue until its current token expires.</li>
            <li><strong>Bounded chains.</strong> Contracts call each other at most 8 deep, event chains stop at 4, and a run emits at most 16 events.</li>
          </ul>
          <p>A few things need care from you, because the network won&apos;t catch them:</p>
          <ul>
            <li><strong>Contract source is public.</strong> <code>GET /v1/contracts</code> returns every version, so an agent must never put a secret in a contract.</li>
            <li><strong>Event contracts outlive their token.</strong> On another organization&apos;s node, one keeps running and billing under its mandate. To stop it, revoke the mandate or the client under API clients on the Platform.</li>
            <li><strong>Anyone can call a contract.</strong> Callers pay for it, but if it emits your events, they trigger those events as you. Have a person review what an agent deploys under a path you care about.</li>
            <li><strong>Keep the secret away from the model.</strong> Give the client secret to the tool that fetches tokens, not to the prompt, where text the agent reads from the network could try to extract it.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="errors">
        <div className={styles.sectionHead}><p className={styles.kicker}>08</p><h2>Recover from errors</h2></div>
        <div className={styles.body}>
          <p>Most failures tell the agent what to do next. A resource call that fails doesn&apos;t fail the run: it comes back as an <code>error</code> value the script can handle. These statuses come from the node itself:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Status</th><th>Meaning</th><th>What the agent should do</th></tr></thead>
              <tbody>
                <tr><td><code>400</code></td><td>The source is invalid or names an unknown struct or event type</td><td>Fix the source, using the error message</td></tr>
                <tr><td><code>401</code></td><td>The token is invalid or expired</td><td>Get a new run token and retry</td></tr>
                <tr><td><code>402</code></td><td>Over the max per run, the balance or the monthly cap</td><td>Don&apos;t retry as is: make the script cheaper, or ask a person</td></tr>
                <tr><td><code>403</code></td><td>Not allowed for this organization, or the node was unlisted</td><td>Use a client of the node&apos;s organization, or another node</td></tr>
                <tr><td><code>409</code></td><td>The version exists or the name is taken</td><td>Deploy a new version, or choose another path</td></tr>
                <tr><td><code>413</code></td><td>The source is too large</td><td>Split the contract</td></tr>
                <tr><td><code>422</code></td><td>The script failed while running, and is charged for what it executed</td><td>Read <code>details</code> and fix the script</td></tr>
                <tr><td><code>503</code></td><td>The operator is unreachable, or the node isn&apos;t enrolled</td><td>Retry later</td></tr>
              </tbody>
            </table>
          </div>
          <p>The CLI reports the same kinds of failure as exit codes: <code>2</code> for configuration, <code>3</code> for authentication or a refused deploy, <code>4</code> for an invalid script or version conflict, <code>5</code> for a network error worth retrying, and <code>6</code> when the operator refuses the deploy fee.</p>
        </div>
      </section>

      <section className={styles.section} id="reading">
        <div className={styles.sectionHead}><p className={styles.kicker}>09</p><h2>Further reading</h2></div>
        <div className={styles.cards}>
          <article className={styles.card}>
            <span>Docs</span>
            <h3>API clients</h3>
            <p>Run tokens, script tokens and how a billed run is held and captured.</p>
            <div className={styles.cardLinks}><a href={apiClientsDocs} target="_blank" rel="noreferrer">Read the docs ↗</a></div>
          </article>
          <article className={styles.card}>
            <span>Docs</span>
            <h3>Deploy from CI</h3>
            <p>Check agent-written <code>.req</code> files on pull requests and deploy them on merge.</p>
            <div className={styles.cardLinks}><a href={deployDocs} target="_blank" rel="noreferrer">Read the tutorial ↗</a></div>
          </article>
          <article className={styles.card}>
            <span>Claude</span>
            <h3>Claude Skill</h3>
            <p>Add the Stellarium skill to Claude, so it can work with the network.</p>
            <div className={styles.cardLinks}><a href={links.claudeSkills} target="_blank" rel="noreferrer">Get the skill ↗</a></div>
          </article>
        </div>
      </section>

      <section className={styles.callout}><p>Building an agent on Stellarium? Tell us about it on Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><a className={styles.textLink} href={links.platform} target="_blank" rel="noreferrer">Create an API client <span aria-hidden="true">↗</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
