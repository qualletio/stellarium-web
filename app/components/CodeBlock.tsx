"use client";

import { useState } from "react";
import styles from "./content.module.css";

export default function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the code is still selectable.
    }
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeTop}>
        <span>{label}</span>
        <button type="button" className={styles.copy} onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
