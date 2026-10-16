import Link from "next/link";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import StarMark from "./components/StarMark";
import { pageMetadata, siteDescription, siteName, siteTagline } from "./lib/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: `${siteName} | ${siteTagline}`,
  absoluteTitle: true,
  description: siteDescription,
  path: "/",
});

const Arrow = () => <span className={styles.arrow} aria-hidden="true">↗</span>;

const NodeIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="4" fill="currentColor" />
    <circle cx="5" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="23" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="21" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="22" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="m7 8 5 4m9-3-5 4m-4 4-5 3m9-3 4 2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default function Home() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.pulse} /> The next revolution in web API development</div>
          <h1>The decentralized, <em>programmable</em> API network</h1>
          <p className={styles.heroText}>Stellarium is a global platform for composing APIs into powerful programs.</p>
          <div className={styles.actions}><Link className={styles.primaryButton} href="/build">Start building <span>→</span></Link><a className={styles.textButton} href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">Explore the code <Arrow /></a></div>
        </div>
        <div className={styles.heroArt} aria-label="A decentralized network illustration" role="img">
          <div className={`${styles.orbit} ${styles.orbitOne}`} /><div className={`${styles.orbit} ${styles.orbitTwo}`} /><div className={`${styles.orbit} ${styles.orbitThree}`} />
          <div className={styles.nodeCore}><StarMark className={styles.starMark} /></div>
          <div className={`${styles.satellite} ${styles.satelliteOne}`}><NodeIcon /></div><div className={`${styles.satellite} ${styles.satelliteTwo}`}><NodeIcon /></div><div className={`${styles.satellite} ${styles.satelliteThree}`}><NodeIcon /></div><div className={`${styles.satellite} ${styles.satelliteFour}`}><NodeIcon /></div>
          <div className={styles.artLabel}><span>live topology</span><b>04 peers connected</b></div><div className={styles.orbitalTag}>RequestScript<small>program layer</small></div>
        </div>
      </section>

      <section className={styles.ticker} aria-hidden="true"><span>REQUESTSCRIPT NATIVE</span><i>✦</i><span>PEER-TO-PEER</span><i>✦</i><span>RESOURCE DISCOVERY</span><i>✦</i><span>LOCAL-FIRST</span><i>✦</i><span>REQUESTSCRIPT NATIVE</span></section>

      <section className={styles.intro} id="network">
        <div className={styles.sectionKicker}>01 — A new API primitive</div>
        <div className={styles.introGrid}><h2>Make APIs<br />as open as the web.</h2><div className={styles.introBody}><p>Stellarium turns every API capability into a resource the network can find, call, and compose. Host a resource on your own node. Let other nodes discover it and pay for its use. </p><a className={styles.inlineLink} href="#how-it-works">See how it works <span>↓</span></a></div></div>
        <div className={styles.principles}>
          <article><span className={styles.number}>01</span><h3>Run sovereign</h3><p>Your node, your infrastructure, your resources. Stellarium embeds directly in your Fastify application.</p></article>
          <article><span className={styles.number}>02</span><h3>Compose freely</h3><p>RequestScript makes remote and local resources feel like one elegant programming surface.</p></article>
          <article><span className={styles.number}>03</span><h3>Discover naturally</h3><p>Join through a peer and your node learns the resources and routes around it.</p></article>
        </div>
      </section>

      <section className={styles.flow} id="how-it-works">
        <div className={styles.flowCopy}><div className={styles.sectionKicker}>02 — One program, many places</div><h2>Write intent.<br /><em>The network routes it.</em></h2><p>Call resources by name, wherever they are hosted. One program gets one response. If a call fails, the failure comes back as a value your program can check, so there are no per-API status codes, keys, or glue code to manage.</p></div>
        <div className={styles.flowVisual}><div className={styles.scriptWindow}><div className={styles.windowTop}><span /><span /><span /><b>GetTemperature.req</b></div><pre><code><i>request</i> GetTemperature {'{'}{"\n"}  <i>const</i> weather: <strong>com.example.Weather</strong>{"\n\n"}  <i>const</i> reading = weather.temperature(city: <span>&quot;Oslo&quot;</span>){"\n"}  <i>return</i> reading.value{"\n"}{'}'}</code></pre><div className={styles.result}><span>returnValue</span><b>12</b><small>• executed</small></div></div><div className={styles.routeLine}><span>routing request</span><i /></div><div className={styles.miniNodes}><div><NodeIcon /><small>your node</small></div><div><NodeIcon /><small>weather</small></div><div><NodeIcon /><small>payments</small></div></div></div>
      </section>

      <section className={styles.build} id="build"><div className={styles.buildArt} aria-hidden="true"><div className={styles.bigStar}>✦</div><div className={styles.bigRing} /><div className={styles.sparkOne}>+</div><div className={styles.sparkTwo}>✦</div></div><div className={styles.buildContent}><div className={styles.sectionKicker}>03 — Ship your first resource</div><h2>From zero to<br />networked <em>fast.</em></h2><p>Install the TypeScript node, register a RequestScript resource, and start a server. Bootstrap from a peer whenever you&apos;re ready to join a wider constellation.</p><Link className={styles.primaryButton} href="/build">Read the guide <span>→</span></Link></div><div className={styles.command}><span>$</span> npm install stellarium-ts fastify requestscript <button aria-label="Copy install command">⧉</button></div></section>

      <section className={styles.close}><StarMark className={styles.starMark} /><p>There is more out there.</p><h2>Build for it.</h2><a className={styles.lightButton} href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">Get started <span>→</span></a></section>
      <SiteFooter />
    </main>
  );
}
