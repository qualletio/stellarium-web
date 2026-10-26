import Link from "next/link";
import StarMark from "./StarMark";
import { links } from "./nav-data";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Link className={styles.brand} href="/"><StarMark className={styles.starMark} /><span>stellarium</span></Link>
      <p>Open source, peer-to-peer API network.</p>
      <div className={styles.links}>
        <Link href="/learn">Learn</Link>
        <Link href="/build">Build</Link>
        <Link href="/community">Community</Link>
        <Link href="/join">Join</Link>
        <Link href="/sips">SIPs</Link>
        <Link href="/governance">Governance</Link>
        <Link href="/blog">Blog</Link>
        <a href={links.discord} target="_blank" rel="noreferrer">Discord</a>
        <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
