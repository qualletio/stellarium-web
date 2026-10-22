import type { ReactNode } from "react";
import styles from "./content.module.css";

// Key facts shown beside a page hero, like a package page sidebar.
export default function Spec({ items, label }: { items: [string, ReactNode][]; label: string }) {
  return (
    <dl className={styles.spec} aria-label={label}>
      {items.map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
