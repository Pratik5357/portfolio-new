"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { expoIn, expoOut } from "@/lib/ease";
import { CITY, EMAIL } from "@/lib/contact";
import { LINES, caseHref, mcol } from "@/lib/lines";
import { TLink, useSite } from "./site";

const SECTIONS: [string, string][] = [
  ["/#top", "Home"],
  ["/#about", "About"],
  ["/#experience", "Experience"],
  ["/#side", "Side projects"],
  ["/#building", "Next"],
  ["/#contact", "Contact"],
];

export function Menu() {
  const { menuOpen, closeMenu, onMenuClosed } = useSite();
  return (
    <AnimatePresence onExitComplete={onMenuClosed}>
      {menuOpen && <MenuPanel onEscape={() => closeMenu().then(() => document.querySelector<HTMLButtonElement>(".menu-btn")?.focus())} />}
    </AnimatePresence>
  );
}

function MenuPanel({ onEscape }: { onEscape: () => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  /* the menu grows out of its own button, top right */
  const [geo] = useState(() => {
    const x = window.innerWidth - 60;
    return { x, r: Math.hypot(window.innerWidth, window.innerHeight) + 60 };
  });
  const closed = `circle(0px at ${geo.x}px 40px)`;
  const open = `circle(${geo.r}px at ${geo.x}px 40px)`;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("menu-open");
    return () => root.classList.remove("menu-open");
  }, []);

  useEffect(() => {
    ref.current?.querySelector("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onEscape();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onEscape]);

  return (
    <motion.div
      ref={ref}
      className="menu"
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={reduce ? false : { clipPath: closed }}
      animate={{ clipPath: open, transition: { duration: 0.5, ease: expoOut } }}
      exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { clipPath: closed, transition: { duration: 0.3, ease: expoIn } }}
    >
      <div className="wrap">
        <nav className="menu-nav" aria-label="Sections">
          {SECTIONS.map(([href, label], i) => (
            <TLink key={href} href={href}>
              <motion.span
                style={{ display: "inline-block" }}
                initial={{ y: "110%" }}
                animate={{ y: 0, transition: { duration: 0.5, ease: expoOut, delay: 0.12 + i * 0.04 } }}
              >
                <span className="mi">{label}</span>
              </motion.span>
            </TLink>
          ))}
        </nav>
        <motion.div
          className="menu-lines"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: expoOut, delay: 0.2 } }}
        >
          <p className="h3">Case studies</p>
          <div>
            {LINES.map((l) => (
              <TLink key={l.id} href={caseHref(l.id)}>
                <span className="badge" style={{ background: mcol(l.n), color: "var(--m-ink)" }}>
                  {l.n}
                </span>
                {l.name}
              </TLink>
            ))}
          </div>
          <p className="menu-foot data">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · {CITY}, India
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
