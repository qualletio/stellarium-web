import styles from "./page.module.css";

const Arrow = () => <span className={styles.arrow} aria-hidden="true">↗</span>;

const StarMark = () => (
  <svg className={styles.starMark} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 2v44M2 24h44" stroke="currentColor" strokeWidth="1.5" />
    <path d="m7 7 34 34M41 7 7 41" stroke="currentColor" strokeWidth="1" opacity=".45" />
    <circle cx="24" cy="24" r="5.5" fill="currentColor" />
  </svg>
);

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
      <nav className={styles.nav} aria-label="Main navigation">
        <a className={styles.brand} href="#top" aria-label="Stellarium home"><StarMark /><span>stellarium</span></a>
        <div className={styles.navLinks}>
          <a href="#network">Network</a><a href="#build">Developers</a><a href="/sips">SIPs</a><a href="/governance">Governance</a>
          <a href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
        </div>
        <a className={styles.navCta} href="#build">Run a node <span>→</span></a>
      </nav>

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.pulse} /> The programmable API network</div>
          <h1>APIs, <em>unbound.</em></h1>
          <p className={styles.heroText}>A decentralized platform for composing APIs into powerful programs—built with RequestScript, owned by the network.</p>
          <div className={styles.actions}><a className={styles.primaryButton} href="#build">Start building <span>→</span></a><a className={styles.textButton} href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">Explore the code <Arrow /></a></div>
        </div>
        <div className={styles.heroArt} aria-label="A decentralized network illustration" role="img">
          <div className={`${styles.orbit} ${styles.orbitOne}`} /><div className={`${styles.orbit} ${styles.orbitTwo}`} /><div className={`${styles.orbit} ${styles.orbitThree}`} />
          <div className={styles.nodeCore}><StarMark /></div>
          <div className={`${styles.satellite} ${styles.satelliteOne}`}><NodeIcon /></div><div className={`${styles.satellite} ${styles.satelliteTwo}`}><NodeIcon /></div><div className={`${styles.satellite} ${styles.satelliteThree}`}><NodeIcon /></div><div className={`${styles.satellite} ${styles.satelliteFour}`}><NodeIcon /></div>
          <div className={styles.artLabel}><span>live topology</span><b>04 peers connected</b></div><div className={styles.orbitalTag}>RequestScript<small>program layer</small></div>
        </div>
      </section>

      <section className={styles.ticker} aria-label="Platform characteristics"><span>REQUESTSCRIPT NATIVE</span><i>✦</i><span>PEER-TO-PEER</span><i>✦</i><span>RESOURCE DISCOVERY</span><i>✦</i><span>LOCAL-FIRST</span><i>✦</i><span>REQUESTSCRIPT NATIVE</span></section>

      <section className={styles.intro} id="network">
        <div className={styles.sectionKicker}>01 — A new API primitive</div>
        <div className={styles.introGrid}><h2>Make APIs<br />as open as the web.</h2><div className={styles.introBody}><p>Stellarium turns every API capability into a resource the network can find, call, and compose. Host a resource on your own node. Let other nodes discover it. Keep the implementation where it belongs.</p><a className={styles.inlineLink} href="#how-it-works">See how it works <span>↓</span></a></div></div>
        <div className={styles.principles}>
          <article><span className={styles.number}>01</span><h3>Run sovereign</h3><p>Your node, your infrastructure, your resources. Stellarium embeds directly in your Fastify application.</p></article>
          <article><span className={styles.number}>02</span><h3>Compose freely</h3><p>RequestScript makes remote and local resources feel like one elegant programming surface.</p></article>
          <article><span className={styles.number}>03</span><h3>Discover naturally</h3><p>Join through a peer and your node learns the resources and routes around it.</p></article>
        </div>
      </section>

      <section className={styles.flow} id="how-it-works">
        <div className={styles.flowCopy}><div className={styles.sectionKicker}>02 — One program, many places</div><h2>Write intent.<br /><em>The network routes it.</em></h2><p>Bind a resource by its qualified name. Execute local functions in-process, or send the same RequestScript program across the network to the node that hosts it.</p></div>
        <div className={styles.flowVisual}><div className={styles.scriptWindow}><div className={styles.windowTop}><span /><span /><span /><b>GetTemperature.req</b></div><pre><code><i>request</i> GetTemperature {'{'}{"\n"}  <i>const</i> weather: <strong>com.example.Weather</strong>{"\n\n"}  <i>return</i> weather.temperature({"\n"}    city: <span>&quot;Oslo&quot;</span>{"\n"}  ){"\n"}{'}'}</code></pre><div className={styles.result}><span>returnValue</span><b>12</b><small>• executed</small></div></div><div className={styles.routeLine}><span>routing request</span><i /></div><div className={styles.miniNodes}><div><NodeIcon /><small>your node</small></div><div><NodeIcon /><small>weather</small></div><div><NodeIcon /><small>payments</small></div></div></div>
      </section>

      <section className={styles.build} id="build"><div className={styles.buildArt} aria-hidden="true"><div className={styles.bigStar}>✦</div><div className={styles.bigRing} /><div className={styles.sparkOne}>+</div><div className={styles.sparkTwo}>✦</div></div><div className={styles.buildContent}><div className={styles.sectionKicker}>03 — Ship your first resource</div><h2>From zero to<br />networked <em>fast.</em></h2><p>Install the TypeScript node, register a RequestScript resource, and start a server. Bootstrap from a peer whenever you&apos;re ready to join a wider constellation.</p><a className={styles.primaryButton} href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">Read the docs <Arrow /></a></div><div className={styles.command}><span>$</span> npm install stellarium-ts fastify requestscript <button aria-label="Copy install command">⧉</button></div></section>

      <section className={styles.close}><StarMark /><p>There is more out there.</p><h2>Build for it.</h2><a className={styles.lightButton} href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">Get started <span>→</span></a></section>
      <footer className={styles.footer}><a className={styles.brand} href="#top"><StarMark /><span>stellarium</span></a><p>Decentralized API infrastructure for an open internet.</p><div><a href="/sips">SIPs</a><a href="/governance">Governance</a><a href="https://discord.gg/yDEBkaz6cB" target="_blank" rel="noreferrer">Discord</a><a href="https://github.com/qualletio/stellarium-ts" target="_blank" rel="noreferrer">GitHub</a><span>© 2026</span></div></footer>
    </main>
  );
}
