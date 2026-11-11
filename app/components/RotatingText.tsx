"use client";

import { useEffect, useState } from "react";
import styles from "./RotatingText.module.css";

type Props = {
  words: string[];
  /** Milliseconds each word stays on screen. */
  interval?: number;
};

export default function RotatingText({ words, interval = 4500 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      key={index}
      className={styles.word}
      style={{ animationDuration: `${interval}ms` }}
    >
      {words[index]}
    </span>
  );
}
