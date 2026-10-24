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
  title: "Inference functions",
  description: "Host AI models on Stellarium with inference functions: per-token pricing, input token estimates, and vouchers that protect both callers and providers.",
  path: "/ai/inference-functions",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Inference functions",
  description: "How inference functions price AI calls per token on the Stellarium network.",
  url: `${siteUrl}/ai/inference-functions`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const readme = `${links.github}#inference-functions`;

const declare = `import Anthropic from "@anthropic-ai/sdk";
import type { StellariumResource } from "stellarium-ts";

const client = new Anthropic();
const arg = (args: { name: string; value: unknown }[], name: string) => args.find((a) => a.name === name)?.value;

export const sonnet: StellariumResource = {
  path: "sh.stellarium.inference.claude",
  name: "Sonnet",
  description: "A collection of functions for Claude Sonnet 5.5",
  functions: [
    {
      name: "message",
      kind: "inference",
      parameters: [
        { name: "prompt", type: "string", description: "The prompt to generate text from." },
        { name: "maxTokens", type: "int32", description: "The maximum number of tokens to generate." },
      ],
      returnType: "string",
      description: "Prompt the model to generate text.",
      // Runs on your node before every paid call.
      estimateInputTokens: async (args) => {
        const { input_tokens } = await client.messages.countTokens({
          model: "claude-sonnet-5-5",
          messages: [{ role: "user", content: arg(args, "prompt") as string }],
        });
        return input_tokens;
      },
      exec: async (args) => {
        const message = await client.messages.create({
          model: "claude-sonnet-5-5",
          max_tokens: arg(args, "maxTokens") as number,
          messages: [{ role: "user", content: arg(args, "prompt") as string }],
        });
        const text = message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("");
        return { value: text, usage: { inputTokens: message.usage.input_tokens, outputTokens: message.usage.output_tokens } };
      },
      paymentManifest: {
        inputCostMicroUsdPerMillionTokens: 2_500_000,   // $2.50 per million input tokens
        outputCostMicroUsdPerMillionTokens: 15_000_000, // $15 per million output tokens
      },
    },
  ],
};`;

const script = `request Summarize {
  const sonnet: sh.stellarium.inference.claude.Sonnet
  const reply = sonnet.message(prompt: "Summarize the plot of Hamlet", maxTokens: 400)
  return reply.value
}`;

const charge = "charge = ceil((inputTokens × inputRate + outputTokens × outputRate) / 1,000,000)";

const callerEnv = `# The most this node will sign for in one inference call, in micro-USD.
# Defaults to COST_LIMIT_MICRO_USD.
INFERENCE_COST_LIMIT_MICRO_USD=50000`;

export default function InferenceFunctionsPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>AI / Inference functions</p>
          <h1>Inference functions</h1>
          <p className={styles.lead}>Most functions on Stellarium have a flat price. AI models don&apos;t work that way: a call&apos;s cost depends on how many tokens go in and how many come out. Inference functions let providers charge per token, and let callers cap what they&apos;ll pay before anything runs.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#what">How it works <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={readme} target="_blank" rel="noreferrer">README <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Inference function summary" items={[
          ["Declared with", <code key="k">kind: &quot;inference&quot;</code>],
          ["Required", <code key="m">maxTokens: int32</code>],
          ["Estimate", <code key="e">POST /v1/run/resource/estimate</code>],
          ["Rates", "Micro-USD per million tokens"],
        ]} />
      </section>

      <section className={styles.section} id="what">
        <div className={styles.sectionHead}><p className={styles.kicker}>01</p><h2>What is an inference function?</h2></div>
        <div className={styles.body}>
          <p>Every resource function on Stellarium is one of two kinds. The original kind is a <strong>fixed</strong> function: it returns one value and, if it&apos;s paid, costs the same flat amount on every call.</p>
          <p>An <strong>inference</strong> function is a function that runs AI inference. Stellarium tracks the input and output tokens each call uses, estimates the cost before the call runs, and charges for the tokens actually used afterwards.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th></th><th>Fixed function</th><th>Inference function</th></tr></thead>
              <tbody>
                <tr><td>Declared with</td><td>nothing extra</td><td><code>kind: &quot;inference&quot;</code></td></tr>
                <tr><td>Required parameters</td><td>none</td><td><code>maxTokens: int32</code>, plus any others</td></tr>
                <tr><td><code>exec</code> returns</td><td>the value</td><td><code>{"{ value, usage: { inputTokens, outputTokens } }"}</code></td></tr>
                <tr><td>Price</td><td><code>costMicroUsd</code> per call</td><td>input and output rates per million tokens</td></tr>
                <tr><td>Estimator</td><td>none</td><td><code>estimateInputTokens</code>, when paid</td></tr>
              </tbody>
            </table>
          </div>
          <p>To a script, an inference function looks like any other function. It sees only <code>value</code>, and the token counts stay between the nodes and the operator.</p>
        </div>
      </section>

      <section className={styles.section} id="declare">
        <div className={styles.sectionHead}><p className={styles.kicker}>02</p><h2>Host a model</h2></div>
        <div className={styles.body}>
          <p>An inference function is declared like any other function on a resource, with a few additions. The examples on this page use Claude Sonnet, from the <code>sh.stellarium.inference.claude.Sonnet</code> resource.</p>
          <ul>
            <li><strong><code>kind: &quot;inference&quot;</code></strong> marks it as an inference function.</li>
            <li><strong>A <code>maxTokens: int32</code> parameter.</strong> The caller uses it to set the most output tokens the call may produce. The function can take any other parameters too.</li>
            <li><strong><code>exec</code> reports usage.</strong> It returns <code>{"{ value, usage: { inputTokens, outputTokens } }"}</code>.</li>
            <li><strong>A per-token payment manifest</strong>, if the function is paid. It sets <code>inputCostMicroUsdPerMillionTokens</code> and <code>outputCostMicroUsdPerMillionTokens</code> instead of <code>costMicroUsd</code>. Either rate can be <code>0</code>, for a model that charges only for input, for example.</li>
            <li><strong>An <code>estimateInputTokens(args)</code> estimator</strong>, if the function is paid. You write its body, just like <code>exec</code>, and it only runs on your node, so it can call a token counting API such as Anthropic&apos;s.</li>
          </ul>
          <CodeBlock label="sonnet.ts" code={declare} />
          <p>The node checks all of this when it starts, and <code>start</code> throws if an inference function is missing a piece. An inference function without a <code>paymentManifest</code> is free: it still needs <code>maxTokens</code>, but no estimator. Hosting paid functions also needs <code>OPERATOR_URL</code> set, as described in the <Link href="/build#environment">node guide</Link>.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="paying">
        <div className={styles.sectionHead}><p className={styles.kicker}>03</p><h2>How a call is paid</h2></div>
        <div className={styles.body}>
          <p>A call&apos;s charge, in micro-USD, is its token counts times the advertised rates, rounded up:</p>
          <CodeBlock label="Charge" code={charge} />
          <p>The caller can&apos;t know the output length ahead of time, and the provider can&apos;t be trusted to report any number it likes. So every paid call goes through these steps:</p>
        </div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>The caller asks for an estimate</h3><p>Before calling, the caller sends the call to the provider&apos;s <code>POST /v1/run/resource/estimate</code>. The provider runs its estimator and answers with <code>inputTokens</code> and <code>maxAmount</code>: the charge for those input tokens plus <code>maxTokens</code> output tokens.</p></div></article>
          <article><span>02</span><div><h3>The caller checks it</h3><p>It recomputes <code>maxAmount</code> from the advertised rates, and refuses the call if it is over the node&apos;s <code>inferenceCostLimitMicroUsd</code>. That way a caller never overpays.</p></div></article>
          <article><span>03</span><div><h3>The caller signs a voucher</h3><p>It signs an inference voucher (<code>kind: &quot;inference&quot;</code>) carrying <code>maxAmount</code>, both rates and <code>maxTokens</code>, and sends it with the call.</p></div></article>
          <article><span>04</span><div><h3>The provider verifies it</h3><p>The voucher&apos;s rates must match the manifest and its <code>maxTokens</code> must match the call. The provider runs its estimator again and answers <code>402</code> with <code>requiredMaxAmount</code> if the voucher doesn&apos;t cover it. Inference never runs unpaid.</p></div></article>
          <article><span>05</span><div><h3>The provider reports usage</h3><p>After the call, the provider sends the voucher and the actual token counts to the operator. Output tokens are capped at <code>maxTokens</code>.</p></div></article>
          <article><span>06</span><div><h3>The operator settles</h3><p>It checks the voucher&apos;s signature, refuses output beyond <code>maxTokens</code>, and charges the reported usage at the signed rates, never more than <code>maxAmount</code>. A call that costs nothing isn&apos;t settled.</p></div></article>
        </div>
        <div className={styles.body}>
          <p className={styles.afterSteps}>The caller agrees to a ceiling up front and pays only for what was used. The provider knows the call is covered before it spends anything on inference.</p>
        </div>
      </section>

      <section className={styles.section} id="example">
        <div className={styles.sectionHead}><p className={styles.kicker}>04</p><h2>Call one from a script</h2></div>
        <div className={styles.body}>
          <p>Callers pass <code>maxTokens</code> like any other argument. Their node handles the estimate and the voucher.</p>
          <CodeBlock label="Summarize.req" code={script} />
          <p>Sonnet charges $2.50 per million input tokens and $15 per million output tokens. Say the prompt is estimated at 1,000 tokens and the caller allows 400 output tokens:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th></th><th>Input</th><th>Output</th><th>Charge</th></tr></thead>
              <tbody>
                <tr><td>Signed ceiling (<code>maxAmount</code>)</td><td>1,000 × 2.5</td><td>400 × 15</td><td>8,500 micro-USD ($0.0085)</td></tr>
                <tr><td>Actual call, 250 output tokens</td><td>1,000 × 2.5</td><td>250 × 15</td><td>6,250 micro-USD ($0.00625)</td></tr>
              </tbody>
            </table>
          </div>
          <p>The caller pays the second amount. Larger models or longer outputs can go over the default limit, so a node that calls them can raise its ceiling:</p>
          <CodeBlock label=".env" code={callerEnv} />
        </div>
      </section>

      <section className={styles.section} id="discover">
        <div className={styles.sectionHead}><p className={styles.kicker}>05</p><h2>Find models on the network</h2></div>
        <div className={styles.body}>
          <p>Inference functions are listed by <code>GET /v1/resources</code> on every node, alongside every other function. They carry <code>kind: &quot;inference&quot;</code> and their per-token payment manifest, so you can compare rates before calling anything. Browse them on the <a href={links.registry} target="_blank" rel="noreferrer">Stellarium registry</a>, or read the full reference in the <a href={readme} target="_blank" rel="noreferrer">stellarium-ts README</a>.</p>
        </div>
      </section>

      <section className={styles.callout}><p>Hosting a model? Tell us about it on Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/build">Run a node</Link></div></section>
      <SiteFooter />
    </main>
  );
}
