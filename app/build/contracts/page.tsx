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
  description: "Deploy RequestScript contracts to any Stellarium node: resources written without TypeScript, billed by the tokens they run, with every paid call paid by the caller. Payable contracts accept money and pay it out on conditions written in code.",
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

const tip = `payable contract com.example.Tip(note: string): int64 {
  return payment.amount
}`;

const hire = `request Hire {
  const job: com.example.Job@1
  return job.run{amount: 20000000, payees: ["org_courier"]}(
    action: "fund", jobId: "", provider: "org_courier", arbiter: "org_arbiter"
  ).value
}`;

const job = `payable contract com.example.Job(action: string, jobId: string, provider: string, arbiter: string): string {
  const account: sh.stellarium.money.Account
  const uuid: sh.stellarium.stdlib.Uuid

  var id: string = jobId
  if (action == "fund") {
    const created = uuid.new()
    if (created.error != null) {
      fail "couldn't create a job id"
    }
    id = created.value
  }
  var state(id) payer: string = null
  var state(id) payee: string = null
  var state(id) judge: string = null

  if (action == "fund") {
    if (payment.amount == 0) {
      fail "fund needs money attached"
    }
    if (provider == arbiter || provider == payment.from) {
      fail "the arbiter must be a third party"
    }
    if (account.canReceive(org: provider).value == false) {
      fail "the provider can't receive payouts"
    }
    account.earmark(key: id)
    payer = payment.from
    payee = provider
    judge = arbiter
    return id
  }
  if (payer == null) {
    fail "no such job"
  }

  // This job's money, after anything the time limit already returned.
  const due = account.fundingOf(org: payer, key: id).value

  if (action == "release" && (sender.org == payer || sender.org == judge)) {
    if (due > 0) {
      account.pay(to: payee, amount: due, from: payer, key: id)
    }
    return id
  }
  if (action == "cancel" && (sender.org == payee || sender.org == judge)) {
    if (due > 0) {
      account.refund(to: payer, amount: due, key: id)
    }
    return id
  }
  fail "not allowed"
}`;

const split = `payable contract com.example.Split: int64 {
  const account: sh.stellarium.money.Account
  const author = payment.amount * 70 / 100
  account.pay(to: "org_author", amount: author, from: payment.from, key: null)
  account.pay(to: "org_data", amount: payment.amount - author, from: payment.from, key: null)
  return payment.amount
}`;

const raffle = `payable contract com.example.Raffle(action: string, round: string): string {
  const random: sh.stellarium.random.Random
  if (action == "draw") {
    // The value is drawn only after this run's money settles.
    random.requestValue(key: round)
    return "requested"
  }
  // Fails until the value exists.
  return random.value(key: round).value
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
            <a className={styles.textLink} href="#payable">Payable contracts <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={readme} target="_blank" rel="noreferrer">README <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Contract summary" items={[
          ["Language", "RequestScript 1.4+, 1.8+ for payable"],
          ["Deploy", <code key="d">POST /v1/contracts</code>],
          ["Function", <code key="f">run</code>],
          ["Price", "The node's price per million tokens"],
          ["Money", <code key="m">payable contract</code>],
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

      <section className={`${styles.section} ${styles.dark}`} id="payable">
        <div className={styles.sectionHead}><p className={styles.kicker}>08</p><h2>Payable contracts</h2></div>
        <div className={styles.body}>
          <p>A <strong>payable contract</strong> accepts money attached to a call and pays it out on conditions written in its code: payment on delivery, milestones, revenue splits. The money is the same US dollars as the rest of Stellarium. Organizations top up through Stripe, and payees are paid out through Stripe Connect. A contract only decides where money that is already on the network goes, and only among the organizations whoever sent it named.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Money can go</th><th>How</th></tr></thead>
              <tbody>
                <tr><td>To a payee the funder named</td><td><code>account.pay</code>, less the platform fee, then a Stripe Connect payout</td></tr>
                <tr><td>Back to whoever sent it</td><td><code>account.refund</code>, with no fee</td></tr>
                <tr><td>To another payable contract</td><td>a call with money attached, keeping the same payees or fewer</td></tr>
              </tbody>
            </table>
          </div>
          <p>Nothing else is possible. A contract can&apos;t pay a public key, an organization its funder didn&apos;t name, or anyone who hasn&apos;t finished Stripe Connect onboarding. Contracts aren&apos;t for transfers between users, lending or tokens.</p>
          <p>A node can receive contract money only once Stellarium has set a limit on the contract balances it may host. That limit starts at zero for every node.</p>
        </div>
      </section>

      <section className={styles.section} id="accept">
        <div className={styles.sectionHead}><p className={styles.kicker}>09</p><h2>Accept money</h2></div>
        <div className={styles.body}>
          <p>Put <code>payable</code> before <code>contract</code>. The contract reads what a call attached from the built-in <code>payment</code>:</p>
          <CodeBlock label="Tip.req" code={tip} />
          <ul>
            <li><strong><code>payment.amount</code></strong> is the micro-USD attached to this call (1 USD = 1,000,000), or <code>0</code> when nothing was.</li>
            <li><strong><code>payment.from</code></strong> is the organization whose money it is.</li>
            <li><strong><code>payment.payees</code></strong> are the organizations it may be paid to.</li>
          </ul>
          <p>A caller attaches money in braces between <code>run</code> and its arguments, naming 1 to 16 payees:</p>
          <CodeBlock label="Hire.req" code={hire} />
          <ul>
            <li><strong>Calls that attach money pin a version</strong>, as in <code>com.example.Job@1</code>, so the buyer pays the code it read, not whatever its owner deploys next.</li>
            <li><strong>Payees are the buyer&apos;s guarantee.</strong> Even a buggy contract can only pay this buyer&apos;s money to the organizations the buyer named, or give it back.</li>
            <li><strong>Sending money is off until you turn it on.</strong> An API client can attach up to its <em>maximum run value</em>, which starts at $0. Raise it on the <a href={links.platform} target="_blank" rel="noreferrer">Stellarium Platform</a>. Attached money counts toward the client&apos;s monthly cap.</li>
            <li><strong>Attaching money to a contract that isn&apos;t payable is refused</strong> before it runs.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="spend">
        <div className={styles.sectionHead}><p className={styles.kicker}>10</p><h2>Pay it out</h2></div>
        <div className={styles.body}>
          <p>A payable contract has a balance, made up of the money each organization sent it. It spends that balance through <code>sh.stellarium.money.Account</code>, a resource built into every node:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Function</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td><code>balance()</code></td><td>The contract&apos;s balance, counting this run&apos;s changes.</td></tr>
                <tr><td><code>earmark(key)</code></td><td>Labels the money attached to this call, so it can be spent apart from the same funder&apos;s other money.</td></tr>
                <tr><td><code>fundingOf(org, key)</code></td><td>How much of <code>org</code>&apos;s money under <code>key</code> is left.</td></tr>
                <tr><td><code>canReceive(org)</code></td><td>Whether <code>org</code> can be paid right now.</td></tr>
                <tr><td><code>pay(to, amount, from, key)</code></td><td>Pays a payee out of <code>from</code>&apos;s money under <code>key</code>.</td></tr>
                <tr><td><code>tryPay(to, amount, from, key)</code></td><td>Like <code>pay</code>, but returns <code>false</code> instead of failing when <code>to</code> can&apos;t be paid.</td></tr>
                <tr><td><code>refund(to, amount, key)</code></td><td>Gives <code>to</code>&apos;s money back to whoever sent it.</td></tr>
              </tbody>
            </table>
          </div>
          <p>Here is payment on delivery. A buyer funds a job, and the provider is paid when the buyer or a third-party arbiter confirms delivery. The buyer gets the money back if the provider or the arbiter cancels:</p>
          <CodeBlock label="Job.req" code={job} />
          <ul>
            <li><strong>Each job&apos;s money is earmarked with its id</strong>, so a release pays out only that job&apos;s money, even when one buyer funds many jobs. The operator&apos;s records are the job&apos;s balance, so the contract keeps no balance of its own.</li>
            <li><strong>Authorize on <code>sender</code>, not <code>caller</code>.</strong> <code>sender.org</code> is whoever made this call: the script&apos;s organization, or the registered owner of the contract that called. <code>caller</code> is the same all the way down a chain of calls, so a contract that checked it would trust every contract in between.</li>
            <li><strong><code>fail &quot;reason&quot;</code></strong> fails the run on purpose. A failed <code>fund</code> returns the attached money and saves no state.</li>
            <li><strong>A refused <code>Account</code> call fails the run</strong>, even when the script ignores the error. Nothing is paid because a call failed part-way through.</li>
          </ul>
          <p>A revenue split pays several organizations from one payment. The buyer names both as payees: <code>split.run{"{"}amount: 1000000, payees: [&quot;org_author&quot;, &quot;org_data&quot;]{"}"}()</code>.</p>
          <CodeBlock label="Split.req" code={split} />
          <p>Both payments go through together, or neither does. Integer division truncates, so <code>org_data</code> gets the remainder and nothing is lost to rounding.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="settlement">
        <div className={styles.sectionHead}><p className={styles.kicker}>11</p><h2>When money moves</h2></div>
        <div className={styles.body}>
          <p>One node runs a contract, and the Stellarium operator keeps the ledger. Nothing moves while a contract runs. The changes are staged, and they apply only when the run that started everything succeeds.</p>
        </div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>The run stages its changes</h3><p>Each attached amount, <code>pay</code> and <code>refund</code> is checked against the money it names and its payees, counting everything already staged in the same run. A change that doesn&apos;t fit fails the run.</p></div></article>
          <article><span>02</span><div><h3>The host sends a receipt</h3><p>The node records what each contract run did: its inputs, every call and its answer, and the state it read and wrote. Providers on current versions of stellarium-ts sign their answers, and contracts that call providers that don&apos;t are flagged to buyers.</p></div></article>
          <article><span>03</span><div><h3>The operator replays it</h3><p>It runs the contract&apos;s published source again on those inputs. A host that staged a change its contract never asked for, or altered a provider&apos;s answer, is caught and its changes are dropped. Any other disagreement waits for staff review before money moves.</p></div></article>
          <article><span>04</span><div><h3>Money and state commit together</h3><p>Every change in the run applies in one ledger transaction, and the contract&apos;s state is saved at the same moment. A run that fails saves neither.</p></div></article>
          <article><span>05</span><div><h3>Payees are paid out</h3><p>A payment, less the platform fee, joins the payee&apos;s payable balance, and is paid out through Stripe Connect after the payout hold.</p></div></article>
        </div>
      </section>

      <section className={styles.section} id="money-rules">
        <div className={styles.sectionHead}><p className={styles.kicker}>12</p><h2>Rules that protect funders</h2></div>
        <div className={styles.body}>
          <ul>
            <li><strong>Every payment has a time limit.</strong> Money a contract hasn&apos;t paid out or refunded within 14 days goes back to whoever sent it, automatically. Write contracts that resolve well within it, and split long arrangements into milestones.</li>
            <li><strong>Source is public.</strong> The operator publishes a payable contract&apos;s source, owner and pinned dependencies, so buyers can read exactly what they&apos;re paying before they pay. Never put secrets in one.</li>
            <li><strong>Versions keep their own money.</strong> A new version starts with no balance, and an old one stays callable as <code>com.example.Job@1</code> until it&apos;s empty.</li>
            <li><strong>Owners have an emergency stop.</strong> A contract&apos;s owner can refund all of a version&apos;s money to the organizations that sent it, from the Platform. The version then refuses money.</li>
            <li><strong>Funders are told.</strong> When the time limit or a refund-all returns money, its owners are emailed, and the Platform can post a signed webhook too.</li>
            <li><strong>Payable contracts are deterministic</strong> by design: the same inputs always give the same result, which is what lets the operator replay them.</li>
            <li><strong>Calls take turns per scope.</strong> A payable contract&apos;s state waits until its run&apos;s money settles. Keep state in narrow scopes, one per job or order, so unrelated calls don&apos;t wait for each other.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="randomness">
        <div className={styles.sectionHead}><p className={styles.kicker}>13</p><h2>Time and randomness</h2></div>
        <div className={styles.body}>
          <p>A payable contract reads the time from the built-in <code>now</code>, stamped by the operator once for the whole run, so the node hosting it can&apos;t choose it.</p>
          <p>Randomness that decides money, such as a draw or a tiebreak, takes two steps, because a value a run could see right away could be retried until it came out well:</p>
          <CodeBlock label="Raffle.req" code={raffle} />
          <ul>
            <li><strong><code>requestValue(key)</code></strong> asks for a value. The operator draws it only after this run&apos;s money settles, so by the time anyone knows it, the request can&apos;t be taken back.</li>
            <li><strong><code>value(key)</code></strong> reads it in a later run, and fails until it exists. Each contract can request a key once.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="reference">
        <div className={styles.sectionHead}><p className={styles.kicker}>14</p><h2>Reference</h2></div>
        <div className={styles.body}>
          <p>Contracts appear in <code>GET /v1/resources</code> with <code>kind: &quot;contract&quot;</code> and their price, alongside every other function. Read the full reference in the <a href={readme} target="_blank" rel="noreferrer">stellarium-ts README</a> and the <a href={links.docs} target="_blank" rel="noreferrer">documentation</a>, and learn the language at <a href={links.requestscriptSite} target="_blank" rel="noreferrer">requestscript.org</a>.</p>
        </div>
      </section>

      <section className={styles.callout}><p>Built a contract? Show it off on Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/build">Run a node</Link></div></section>
      <SiteFooter />
    </main>
  );
}
