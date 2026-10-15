"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import StarMark from "./StarMark";
import { links, navSections, type NavItem } from "./nav-data";
import styles from "./SiteNav.module.css";

const CLOSE_DELAY = 150;

function ItemLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const content = (
    <>
      <span className={styles.itemTitle}>
        {item.title}
        {item.external && <span aria-hidden="true"> ↗</span>}
        {item.soon && <span className={styles.soon}>Soon</span>}
      </span>
      <span className={styles.itemText}>{item.description}</span>
    </>
  );

  if (item.external) {
    return <a className={styles.item} href={item.href} target="_blank" rel="noreferrer" onClick={onNavigate}>{content}</a>;
  }
  if (item.soon) {
    return <a className={styles.item} href={item.href} aria-disabled="true" onClick={(e) => e.preventDefault()}>{content}</a>;
  }
  return <Link className={styles.item} href={item.href} onClick={onNavigate}>{content}</Link>;
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A click right after hover-opening should keep the panel open, not toggle it shut.
  const openedByHover = useRef(false);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      openedByHover.current = false;
      setOpen(null);
    }, CLOSE_DELAY);
  };
  const closeAll = () => {
    cancelClose();
    openedByHover.current = false;
    setOpen(null);
    setMobileOpen(false);
  };

  // Close menus with Escape or a click outside the nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  // Stop the page from scrolling behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (paths: string[]) => paths.includes(pathname);

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Main navigation" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
      <Link className={styles.brand} href="/" aria-label="Stellarium home" onClick={closeAll}>
        <StarMark className={styles.starMark} />
        <span>stellarium</span>
      </Link>

      <ul className={styles.tabs}>
        {navSections.map((section) => {
          const panelId = `nav-panel-${section.label.toLowerCase()}`;
          const isOpen = open === section.label;
          return (
            <li
              key={section.label}
              onMouseEnter={() => {
                cancelClose();
                if (!isOpen) openedByHover.current = true;
                setOpen(section.label);
              }}
            >
              <button
                type="button"
                className={`${styles.tab} ${isActive(section.paths) ? styles.active : ""} ${isOpen ? styles.tabOpen : ""}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  const keepOpen = isOpen && openedByHover.current;
                  openedByHover.current = false;
                  if (!keepOpen) setOpen(isOpen ? null : section.label);
                }}
              >
                {section.label}
                <span className={styles.chevron} aria-hidden="true">▾</span>
              </button>
              <div id={panelId} className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`} hidden={!isOpen}>
                <div className={styles.panelInner}>
                  <p className={styles.panelLabel}>{section.label}</p>
                  <div className={styles.items}>
                    {section.items.map((item) => <ItemLink key={item.title} item={item} onNavigate={closeAll} />)}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        <li>
          <a className={styles.tab} href={links.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </li>
      </ul>

      <Link className={styles.cta} href="/build" onClick={closeAll}>Run a node <span>→</span></Link>

      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={mobileOpen}
        aria-controls="nav-mobile"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className={mobileOpen ? styles.menuIconOpen : styles.menuIcon} aria-hidden="true" />
      </button>

      <div id="nav-mobile" className={styles.mobile} hidden={!mobileOpen}>
        {navSections.map((section) => {
          const isOpen = mobileSection === section.label;
          return (
            <div key={section.label} className={styles.mobileSection}>
              <button
                type="button"
                className={styles.mobileTab}
                aria-expanded={isOpen}
                onClick={() => setMobileSection(isOpen ? null : section.label)}
              >
                {section.label}
                <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className={styles.mobileItems}>
                  {section.items.map((item) => <ItemLink key={item.title} item={item} onNavigate={closeAll} />)}
                </div>
              )}
            </div>
          );
        })}
        <a className={styles.mobileTab} href={links.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        <Link className={styles.mobileCta} href="/build" onClick={closeAll}>Run a node <span>→</span></Link>
      </div>
    </nav>
  );
}
