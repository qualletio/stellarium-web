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
  title: "Structs",
  description: "Name the shape of an object once and use it as a type anywhere on the network: in contracts, event types and resource functions, checked wherever a value is passed, returned, assigned or emitted.",
  path: "/build/structs",
  ownImage: true,
});

const article = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Structs",
  description: "How structs give contracts, event types and resource functions shared, versioned types across Stellarium nodes.",
  url: `${siteUrl}/build/structs`,
  publisher: { "@id": `${siteUrl}/#organization` },
};

const reference = `${links.github}/blob/main/docs/structs.md`;

const declareStruct = `struct com.example.Address@1(street: string, city: string, postcode: string)

struct com.example.Customer@2(
  name: string,
  addresses: []com.example.Address@1,
  credit: decimal
)`;

const declare = `curl -X POST https://node.example/v1/structs \\
  -H 'Content-Type: application/json' \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{"source": "struct com.example.Address@1(street: string, city: string, postcode: string)"}'`;

const use = `contract com.example.Ship(customer: com.example.Customer@2): com.example.Address@1 {
  var first: com.example.Address@1 = customer.addresses[0]
  return first
}

event com.example.OrderShipped(to: com.example.Address@1)`;

const literal = `var home: com.example.Address@1 = { street: "1 Main St", city: "Springfield", postcode: "12345" }`;

const typescript = `import { defineStruct, StellariumNode } from 'stellarium-ts';

const Forecast = defineStruct('com.example.Forecast', 1, {
  city: 'string',
  highs: '[]decimal',
  summary: 'string',
});

// In a resource function:
//   returnType: Forecast.type, // 'com.example.Forecast@1'

const node = new StellariumNode();
await node.registerStruct(Forecast);
await node.register(weather);`;

export default function StructsPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={article} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Build / Structs</p>
          <h1>Structs</h1>
          <p className={styles.lead}>A struct names the shape of an object: its fields and the type of each. An organization declares it once, and anyone on the network can use it as a type in contracts, event types and resource functions, so values are checked wherever they travel instead of passing as an unchecked <code>object</code>.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#what">How it works <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={reference} target="_blank" rel="noreferrer">Reference <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Structs summary" items={[
          ["Language", "RequestScript 1.7+"],
          ["Declare", <code key="d">POST /v1/structs</code>],
          ["TypeScript", <code key="t">defineStruct</code>],
          ["Versions", "Immutable, never deleted"],
        ]} />
      </section>

      <section className={styles.section} id="what">
        <div className={styles.sectionHead}><p className={styles.kicker}>01</p><h2>What is a struct?</h2></div>
        <div className={styles.body}>
          <p>Without structs, a <Link href="/build/contracts">contract</Link> that takes a customer takes an <code>object</code>, and every caller has to guess its fields. A struct gives that shape a name and a version that every node agrees on:</p>
          <ul>
            <li><strong>One owner.</strong> An organization declares a struct on one of its nodes, in RequestScript or in TypeScript, and owns its path.</li>
            <li><strong>Anyone can use it.</strong> Once a node knows a struct, any script on it may name the struct as a type. Nodes learn structs from their peers.</li>
            <li><strong>Pinned versions.</strong> Every declaration and every reference names a version. Versions are immutable and never deleted, so a reference always means the same fields.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="declare">
        <div className={styles.sectionHead}><p className={styles.kicker}>02</p><h2>Declare a struct</h2></div>
        <div className={styles.body}>
          <p>A struct is a script of its own. It declares its fields and has no body. Fields are <code>name: type</code> pairs of any RequestScript type, including other structs and lists of them. Unlike contracts and event types, a struct must name its version.</p>
          <CodeBlock label="Customer.req" code={declareStruct} />
          <p>Declare it on a node of your organization with its API key, or a run token from one of its own API clients. The node&apos;s organization owns the struct.</p>
          <CodeBlock label="Terminal" code={declare} />
          <ul>
            <li><strong>The first organization to declare a path keeps it.</strong> No other organization can declare any version of it.</li>
            <li><strong>Versions don&apos;t change.</strong> Declaring the same version again with the same fields does nothing; with different fields it&apos;s refused. To change a shape, declare a new version.</li>
            <li><strong>References are checked once.</strong> Every struct a declaration names must name its version and be known to the node, and a struct can&apos;t refer to itself, directly or through others.</li>
            <li><strong>There&apos;s no <code>DELETE</code>.</strong> Contracts and event types on other nodes may name any version, so a version stays declared for good.</li>
          </ul>
          <p><code>GET /v1/structs</code> lists the structs a node knows, its own and those it learned from peers. <code>GET /v1/structs/com.example.Address@1</code> returns one, or the latest version when none is named.</p>
        </div>
      </section>

      <section className={styles.section} id="use">
        <div className={styles.sectionHead}><p className={styles.kicker}>03</p><h2>Use structs as types</h2></div>
        <div className={styles.body}>
          <p>A struct type is the struct&apos;s qualified name and its version. It can appear wherever a type can: contract parameters and return types, <code>var</code> annotations including state variables, event type fields, and resource function types declared in TypeScript.</p>
          <CodeBlock label="Ship.req" code={use} />
          <p>A struct value is written as an object literal, and checked when it&apos;s assigned, passed or returned:</p>
          <CodeBlock label="Ship.req" code={literal} />
          <p>A reference without a version, like <code>com.example.Address</code>, is an error. A reference never moves to a later version: declaring <code>@2</code> changes nothing that names <code>@1</code>, so every node checks a value against the same fields, whichever versions it has learned since.</p>
        </div>
      </section>

      <section className={styles.section} id="checking">
        <div className={styles.sectionHead}><p className={styles.kicker}>04</p><h2>How values are checked</h2></div>
        <div className={styles.body}>
          <p>Checking is structural and lenient, so structs from different organizations fit together:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Case</th><th>What happens</th></tr></thead>
              <tbody>
                <tr><td>Same fields, other struct</td><td>fits: a value fits a struct if its fields fit, whatever it was built as, including a plain object</td></tr>
                <tr><td>Declared field</td><td>converted to its type, as an assignment would be; one that doesn&apos;t fit is a runtime error naming the struct and the field</td></tr>
                <tr><td>Missing field</td><td><code>null</code>, which fills any type, so a struct can&apos;t require a field</td></tr>
                <tr><td>Undeclared field</td><td>kept unchanged</td></tr>
                <tr><td><code>object</code></td><td>usable where a struct is expected, checked when it&apos;s converted, and the other way around</td></tr>
                <tr><td><code>null</code></td><td>fits every struct type</td></tr>
              </tbody>
            </table>
          </div>
          <p>Values travel as JSON objects. An <code>int64</code> or <code>decimal</code> that can&apos;t round-trip through a JSON number is a string. Contract state stores a struct value as the object it is.</p>
        </div>
      </section>

      <section className={styles.section} id="typescript">
        <div className={styles.sectionHead}><p className={styles.kicker}>05</p><h2>Structs in TypeScript</h2></div>
        <div className={styles.body}>
          <p>A resource function can name structs in its parameter and return types. Define them with <code>defineStruct</code>, which takes the version as its second argument, and register them with the node, or pass them to <code>start</code> as <code>structs: [Forecast]</code>.</p>
          <CodeBlock label="weather.ts" code={typescript} />
          <ul>
            <li><strong>Field types are RequestScript type strings.</strong> A field may name another struct by its <code>.type</code> or as <code>&apos;com.example.Address@1&apos;</code>.</li>
            <li><strong>The node needs an operator.</strong> It waits for its session to learn its organization, then declares each struct as that organization&apos;s. A path another organization owns, a version declared with different fields, or an unknown struct stops it from starting.</li>
            <li><strong>Parameters are checked before anything is paid.</strong> When a peer calls the function, the node checks its struct-typed parameters and answers 400 when one doesn&apos;t fit.</li>
            <li><strong>Return values are checked by the caller</strong> when they arrive, so a value that doesn&apos;t fit fails the caller&apos;s script.</li>
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="travel">
        <div className={styles.sectionHead}><p className={styles.kicker}>06</p><h2>How structs travel</h2></div>
        <div className={styles.body}>
          <p>Structs are learned from peers, and every announcement is signed and checked against the operator, so no node can claim another organization&apos;s types.</p>
        </div>
        <div className={styles.steps}>
          <article><span>01</span><div><h3>Nodes announce</h3><p>Each node signs the structs its organization owns and announces them to its peers with its membership token, again whenever it declares one.</p></div></article>
          <article><span>02</span><div><h3>Starting nodes fetch first</h3><p>A starting node fetches every peer&apos;s struct announcement before it learns their event types and resources, which may refer to them.</p></div></article>
          <article><span>03</span><div><h3>Peers check ownership</h3><p>A receiver learns a struct only if the token says the announcing node belongs to its owner. A path another organization owns, or a version with different fields, is rejected.</p></div></article>
          <article><span>04</span><div><h3>Versions stay known</h3><p>A struct a node learned stays known after the peer stops announcing it, since a version never goes away.</p></div></article>
        </div>
        <div className={styles.body}>
          <p className={styles.afterSteps}>A node knows only the structs of its peers&apos; organizations. A struct that refers to another organization&apos;s struct can&apos;t be used until the node learns that one from a node of its owner.</p>
        </div>
      </section>

      <section className={styles.section} id="unknown">
        <div className={styles.sectionHead}><p className={styles.kicker}>07</p><h2>Unknown structs</h2></div>
        <div className={styles.body}>
          <ul>
            <li><strong>Deploying</strong> a contract, event type or struct that names a struct the node doesn&apos;t know is refused.</li>
            <li><strong>Learned resources</strong> are still learned. A script calling a function that names an unknown struct fails with an <code>Unknown struct</code> error before any payment or network call, and the resource&apos;s other functions still work.</li>
            <li><strong>Event types</strong> whose fields name an unknown struct aren&apos;t learned until the node learns the struct and the peer announces its events again. See <Link href="/build/events">Events</Link>.</li>
            <li><strong>Scripts</strong> that name an unknown struct fail before they run anything.</li>
          </ul>
          <p>A struct has at most 64 fields, nests at most 8 deep counting lists of structs, and its source is at most 16 KiB.</p>
        </div>
      </section>

      <section className={styles.section} id="reference">
        <div className={styles.sectionHead}><p className={styles.kicker}>08</p><h2>Reference</h2></div>
        <div className={styles.body}>
          <p>Read the full reference in the <a href={reference} target="_blank" rel="noreferrer">stellarium-ts structs guide</a> and the <a href={links.docs} target="_blank" rel="noreferrer">documentation</a>. Structs need RequestScript 1.7.0, which adds struct declarations and struct types; learn the language at <a href={links.requestscriptSite} target="_blank" rel="noreferrer">requestscript.org</a>.</p>
        </div>
      </section>

      <section className={styles.callout}><p>Published a struct others can build on? Share it on Discord.</p><div className={styles.actions}><a className={styles.button} href={links.discord} target="_blank" rel="noreferrer">Discord <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/build/events">Events</Link></div></section>
      <SiteFooter />
    </main>
  );
}
