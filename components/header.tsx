"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CITY } from "@/lib/contact";
import { power2In, power3Out } from "@/lib/ease";
import { Clock } from "./clock";
import { TLink, useSite } from "./site";

export function Header() {
  const { menuOpen, openMenu, closeMenu, page } = useSite();
  const reduce = useReducedMotion();
  const [away, setAway] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  /* header steps aside while reading down, returns on any scroll up */
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const d = y - last;
      if (menuOpen || y < 120 || d < -4) setAway(false);
      else if (d > 6) setAway(true);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <header className={"hdr" + (away && !menuOpen ? " away" : "")} aria-label="Site" onFocus={() => setAway(false)}>
      <div className="wrap">
        <TLink className="brand" href="/#top">
          Pratik Kumbhar
        </TLink>
        {/* header names the page you're on */}
        <span className="hdr-page data" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={page}
              initial={reduce ? { opacity: 1 } : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.2, ease: power3Out } }}
              exit={reduce ? { opacity: 1 } : { y: "-100%", opacity: 0, transition: { duration: 0.12, ease: power2In } }}
            >
              {page}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="hdr-time data">
          {CITY} <Clock /> IST
        </span>
        <button
          ref={btn}
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => (menuOpen ? closeMenu().then(() => btn.current?.focus()) : openMenu())}
        >
          <i aria-hidden="true" />
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>
    </header>
  );
}
