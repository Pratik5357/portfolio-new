"use client";

import Lenis from "lenis";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { animate, useReducedMotion } from "motion/react";
import { flushSync } from "react-dom";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import { easeInOut, expoOut } from "@/lib/ease";
import { BY, pcol } from "@/lib/lines";

/* what the colour wipe shows while it covers the screen */
type Wipe = { c: string; ink: string; n?: number; label: string };

const SECTION_NAMES: Record<string, string> = {
  top: "Intro",
  about: "About",
  experience: "Experience",
  side: "Side projects",
  building: "Next",
  stack: "Stack",
  contact: "Contact",
};

type Site = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => Promise<void>;
  onMenuClosed: () => void;
  navigate: (href: string) => void;
  page: string;
  setPage: (name: string) => void;
  lenis: () => Lenis | null;
};

const SiteCtx = createContext<Site | null>(null);

export function useSite() {
  const s = useContext(SiteCtx);
  if (!s) throw new Error("useSite must be used inside <SiteProvider>");
  return s;
}

export function SiteProvider({ chrome, children }: { chrome: ReactNode; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const curtainRef = useRef<HTMLDivElement>(null);
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const busy = useRef(false);
  const pending = useRef<string | null>(null);
  const menuResolve = useRef<(() => void) | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("Intro");

  /* smooth scroll */
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  const scrollToY = useCallback(
    (y: number, immediate = false) => {
      const lenis = lenisRef.current;
      if (immediate) {
        window.scrollTo(0, y);
        lenis?.scrollTo(y, { immediate: true, force: true });
        return;
      }
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    },
    [reduce]
  );

  const jumpTo = useCallback(
    (hash: string) => {
      lenisRef.current?.resize();
      const el = hash ? document.getElementById(hash) : null;
      if (!el || hash === "top") return scrollToY(0, true);
      const y = el.getBoundingClientRect().top + window.scrollY - 64;
      scrollToY(Math.max(0, y), true);
    },
    [scrollToY]
  );

  /* page change: a colour wipe like a train passing. The destination line's colour
     sweeps up over the page, the page changes underneath, then it clears upward. */
  const cover = useCallback(async (w: Wipe) => {
    flushSync(() => setWipe(w));
    const el = curtainRef.current;
    if (!el) return;
    await Promise.all([
      animate(el, { clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] }, { duration: 0.45, ease: easeInOut }),
      el.firstElementChild &&
        animate(el.firstElementChild, { y: ["60%", "0%"], opacity: [0, 1] }, { duration: 0.4, ease: expoOut, delay: 0.15 }),
    ]);
  }, []);
  const enter = useCallback(async () => {
    const el = curtainRef.current;
    if (el) await animate(el, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] }, { duration: 0.5, ease: easeInOut });
    setWipe(null);
    busy.current = false;
  }, []);

  useEffect(() => {
    const h = pending.current;
    if (h === null) return;
    pending.current = null;
    requestAnimationFrame(() => {
      jumpTo(h);
      if (reduce) busy.current = false;
      else enter();
    });
  }, [pathname, jumpTo, enter, reduce]);

  /* menu: lock scroll while it's open; resolve close once its exit finishes */
  const openMenu = useCallback(() => {
    setMenuOpen(true);
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);
  const closeMenu = useCallback(
    () =>
      new Promise<void>((resolve) => {
        menuResolve.current = resolve;
        setMenuOpen(false);
      }),
    []
  );
  const onMenuClosed = useCallback(() => {
    document.documentElement.style.overflow = "";
    lenisRef.current?.start();
    menuResolve.current?.();
    menuResolve.current = null;
  }, []);

  const navigate = useCallback(
    async (href: string) => {
      if (menuOpen) await closeMenu();
      if (busy.current) return;
      const url = new URL(href, window.location.href);
      const hash = url.hash.slice(1);
      const samePath = url.pathname === window.location.pathname;

      if (samePath && !hash) return scrollToY(0);
      if (samePath && !document.getElementById(hash)) return;
      if (samePath) {
        try {
          history.pushState(null, "", url.pathname + url.hash);
        } catch {}
      }
      if (reduce) {
        if (samePath) jumpTo(hash);
        else {
          pending.current = hash;
          router.push(url.pathname + url.hash, { scroll: false });
        }
        return;
      }

      busy.current = true;
      const id = url.pathname.startsWith("/work/") ? url.pathname.slice(6) : "";
      const l = BY[id];
      await cover(
        l
          ? { c: pcol(l.n), ink: "var(--on-panel)", n: l.n, label: l.name }
          : {
              c: "var(--fg)",
              ink: "var(--bg)",
              /* leaving a case study for the home page always reads "Back" */
              label: samePath ? SECTION_NAMES[hash] ?? "Home" : "Back",
            }
      );
      if (samePath) {
        jumpTo(hash);
        enter();
      } else {
        pending.current = hash;
        router.push(url.pathname + url.hash, { scroll: false });
      }
    },
    [menuOpen, closeMenu, scrollToY, reduce, jumpTo, router, cover, enter]
  );

  const value = useMemo<Site>(
    () => ({ menuOpen, openMenu, closeMenu, onMenuClosed, navigate, page, setPage, lenis: () => lenisRef.current }),
    [menuOpen, openMenu, closeMenu, onMenuClosed, navigate, page]
  );

  return (
    <SiteCtx.Provider value={value}>
      {chrome}
      {/* behind the open menu dialog, the page is inert so focus can't leak out of it */}
      <div inert={menuOpen}>{children}</div>
      {wipe && (
        <div
          ref={curtainRef}
          className="curtain"
          aria-hidden="true"
          style={{ "--c": wipe.c, color: wipe.ink, clipPath: "inset(100% 0% 0% 0%)" } as CSSProperties}
        >
          <div className="wrap">
            <div className="curtain-label">
              {wipe.n && <span className="badge">{wipe.n}</span>}
              {wipe.label}
            </div>
          </div>
        </div>
      )}
    </SiteCtx.Provider>
  );
}

/* in-site link: same href semantics, routed through the page transition */
export function TLink({ href, onClick, ...rest }: ComponentProps<"a"> & { href: string }) {
  const { navigate } = useSite();
  return (
    <Link
      href={href}
      scroll={false}
      /* case studies read params; a per-link prefetch resolves them before the click (served from static output) */
      prefetch={href.startsWith("/work/") ? true : undefined}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
