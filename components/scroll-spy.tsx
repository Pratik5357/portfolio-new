"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BY, LINES } from "@/lib/lines";
import { useSite } from "./site";

function setTheme(t: string | null) {
  const r = document.documentElement;
  r.classList.toggle("t-inv", t === "inv");
  r.classList.toggle("t-soft", t === "soft");
}

/* the page takes on the palette of the section you're in, and the header names it */
export function ScrollSpy() {
  const pathname = usePathname();
  const { setPage } = useSite();

  useEffect(() => {
    if (pathname !== "/") {
      setTheme(null);
      const line = BY[pathname.split("/").pop() ?? ""];
      setPage(line ? `Line ${line.n} of ${LINES.length}` : "Off the map");
      /* case studies: is the header sitting on a line-colour panel? */
      const root = document.documentElement;
      const onPanel = () => {
        const y = 34;
        const hit = Array.from(document.querySelectorAll(".d-hero, .next")).some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= y && r.bottom > y;
        });
        root.classList.toggle("hdr-on-panel", hit);
      };
      onPanel();
      window.addEventListener("scroll", onPanel, { passive: true });
      window.addEventListener("resize", onPanel);
      return () => {
        window.removeEventListener("scroll", onPanel);
        window.removeEventListener("resize", onPanel);
        root.classList.remove("hdr-on-panel");
      };
    }
    const secs = Array.from(document.querySelectorAll<HTMLElement>("main > section[data-page]"));
    const pick = () => {
      const h = window.innerHeight;
      let theme: HTMLElement | null = null;
      let page: HTMLElement | null = null;
      for (const sc of secs) {
        const r = sc.getBoundingClientRect();
        if (r.top <= h * 0.55 && r.bottom > h * 0.55) theme = sc;
        if (r.top <= h * 0.5 && r.bottom > h * 0.5) page = sc;
      }
      const last = secs[secs.length - 1];
      if (!theme && last && last.getBoundingClientRect().bottom <= h * 0.55) theme = last;
      setTheme(theme?.dataset.theme ?? null);
      if (page) setPage(page.dataset.page ?? "");
    };
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          pick();
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", pick);
    requestAnimationFrame(pick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", pick);
    };
  }, [pathname, setPage]);

  return null;
}
