import Image from "next/image";
import Link from "next/link";
import JsonLd from "../../components/JsonLd";
import SiteFooter from "../../components/SiteFooter";
import SiteNav from "../../components/SiteNav";
import Spec from "../../components/Spec";
import { links } from "../../components/nav-data";
import { pageMetadata, siteUrl } from "../../lib/site";
import styles from "../../components/content.module.css";
import autocomplete from "./screenshots/autocomplete.png";
import networkSettings from "./screenshots/network-settings.png";
import resourceBrowser from "./screenshots/resource-browser.png";
import runResult from "./screenshots/run-result.png";
import workspace from "./screenshots/workspace.png";

export const metadata = pageMetadata({
  title: "Stellarium Explorer",
  description: "A desktop app for writing and running RequestScript requests and browsing the resources on a Stellarium network. Free for macOS, Windows and Linux.",
  path: "/build/explorer",
  ownImage: true,
});

const app = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Stellarium Explorer",
  description: "A desktop app for writing and running RequestScript requests and browsing Stellarium networks.",
  url: `${siteUrl}/build/explorer`,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default function ExplorerPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <JsonLd data={app} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Build / Desktop app</p>
          <h1>Stellarium Explorer</h1>
          <p className={styles.lead}>A desktop app for RequestScript. Write requests with completions from the network, browse every resource a registry knows about, and run requests against any node.</p>
          <div className={styles.actions}>
            <a className={styles.button} href={links.explorerDownload} target="_blank" rel="noreferrer">Download <span aria-hidden="true">↓</span></a>
            <a className={styles.textLink} href={links.explorer} target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <Spec label="Stellarium Explorer" items={[
          ["Platforms", "macOS, Windows, Linux"],
          ["License", "Free and open source"],
          ["Files", <><code>.rqs</code> + <code>.toml</code></>],
          ["Updates", "Built in"],
        ]} />
      </section>

      <div className={styles.showcase}>
        <figure className={styles.shot}>
          <Image src={workspace} alt="Stellarium Explorer with a workspace of collections in the sidebar, a request open in the editor, and the resource browser on the right" sizes="(max-width: 900px) 90vw, 1240px" loading="eager" fetchPriority="high" placeholder="blur" />
        </figure>
      </div>

      <section className={styles.section} id="workspaces">
        <div className={styles.sectionHead}><p className={styles.kicker}>01 / Organize</p><h2>Workspaces</h2></div>
        <div className={styles.body}>
          <p>Group requests into <strong>collections</strong> and <strong>folders</strong> inside a <strong>workspace</strong>. Open as many requests as you like in tabs, and save with <code>⌘S</code>.</p>
          <p>A workspace is just a folder on your disk. Each request is a <code>.rqs</code> file holding its RequestScript, next to a small <code>.toml</code> file with its name and settings. That means you can check a workspace into git and share it with your team. If you edit the files somewhere else, the app picks up the changes right away.</p>
        </div>
      </section>

      <section className={styles.section} id="editor">
        <div className={styles.sectionHead}><p className={styles.kicker}>02 / Write</p><h2>An editor that knows the network</h2></div>
        <div className={styles.body}>
          <p>The editor reads the resource catalogue from your registry, so it knows every resource and function you can call. Type a dot after a resource and it suggests that resource&apos;s functions, along with their parameters, return types, descriptions and what each call costs.</p>
          <ul>
            <li><strong>Completions</strong> for resources, functions and parameters. Press <code>Ctrl Space</code> to bring them up at any time.</li>
            <li><strong>Hover docs</strong> for any resource or function in your script.</li>
            <li><strong>Inline errors</strong> as you type, before you send anything to a node.</li>
          </ul>
          <figure className={styles.shot}>
            <Image src={autocomplete} alt="The editor suggesting the forecast, stations and temperature functions of com.example.Weather, with the forecast function's description and price" sizes="(max-width: 900px) 90vw, 760px" placeholder="blur" />
            <figcaption>Completions come with each function&apos;s signature, docs and price.</figcaption>
          </figure>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`} id="resources">
        <div className={styles.sectionHead}><p className={styles.kicker}>03 / Discover</p><h2>Resource browser</h2></div>
        <div className={styles.body}>
          <p>The resource browser lists everything your registry knows about. Search by name, path or description, and filter for paid or restricted resources. Open a resource to see the node that hosts it, its website, and every function with its parameters and price.</p>
          <p>Found what you need? <strong>Insert into request</strong> adds the resource to the request you have open, ready to call.</p>
          <figure className={styles.shot}>
            <Image src={resourceBrowser} alt="The resource browser showing com.example.Weather: its host, website and grants URL, plus its temperature, forecast and stations functions with prices" sizes="(max-width: 900px) 90vw, 760px" placeholder="blur" />
            <figcaption>Resource details, straight from the registry.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section} id="networks">
        <div className={styles.sectionHead}><p className={styles.kicker}>04 / Connect</p><h2>Registries and nodes</h2></div>
        <div className={styles.body}>
          <p>Each workspace, collection or request can choose two things: the <strong>registry</strong> it browses and completes from, and the <strong>node</strong> that runs its requests. Anything left empty is inherited. A request uses its own settings first, then its collection&apos;s, then its workspace&apos;s. That makes it easy to point one collection at a local node while the rest of the workspace talks to a shared one.</p>
          <p>If your node needs an API key, add it here. Keys are kept in your system keychain and never written into your workspace files, so you can share a workspace without leaking them.</p>
          <figure className={styles.shot}>
            <Image src={networkSettings} alt="The network settings dialog with Registry API, Execution node and Node API key fields, each showing the value it inherits from the workspace" sizes="(max-width: 900px) 90vw, 760px" placeholder="blur" />
            <figcaption>Settings inherit from collection to workspace. API keys stay in your keychain.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section} id="run">
        <div className={styles.sectionHead}><p className={styles.kicker}>05 / Run</p><h2>Run requests</h2></div>
        <div className={styles.body}>
          <p>Press <code>⌘Enter</code> and the request goes to your node, which calls each resource wherever it lives on the network. The response appears under the editor with its status and timing, formatted, with a raw view and a copy button. If a run takes too long, you can cancel it.</p>
          <p>Each resource call comes back with a <code>value</code> and an <code>error</code>, so a call that fails doesn&apos;t fail the whole request. Your script decides what to do with it.</p>
          <figure className={styles.shot}>
            <Image src={runResult} alt="A request calling com.example.Weather's temperature function for Oslo and Bergen, with a 200 response showing a value and error for each call" sizes="(max-width: 900px) 90vw, 760px" placeholder="blur" />
            <figcaption>A real run against a local node. The example resources return empty values.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section} id="download">
        <div className={styles.sectionHead}><p className={styles.kicker}>Get started</p><h2>Download</h2></div>
        <div className={styles.body}>
          <p>Stellarium Explorer is free and open source. Download the latest version for your computer from the <a href={links.explorerDownload} target="_blank" rel="noreferrer">releases page</a>:</p>
          <ul>
            <li><strong>macOS</strong>: Apple Silicon and Intel.</li>
            <li><strong>Windows</strong>: 64-bit installer.</li>
            <li><strong>Linux</strong>: AppImage, <code>.deb</code> and <code>.rpm</code>.</li>
          </ul>
          <p>The app checks for new versions by itself and lets you know when one is ready. One click installs it and restarts the app.</p>
          <p>You will need a registry to browse and a node to run requests against. To run your own node, follow the <Link href="/build">node guide</Link>. Want to build the app yourself? The <a href={links.explorer} target="_blank" rel="noreferrer">README</a> explains how.</p>
        </div>
      </section>

      <section className={styles.callout}><p>Found a bug or want a feature? Open an issue.</p><div className={styles.actions}><a className={styles.button} href={`${links.explorer}/issues`} target="_blank" rel="noreferrer">Issues <span aria-hidden="true">↗</span></a><Link className={styles.textLink} href="/build">Run a node</Link></div></section>
      <SiteFooter />
    </main>
  );
}
