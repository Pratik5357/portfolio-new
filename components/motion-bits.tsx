"use client";

import { motion, useReducedMotion, useSpring, type HTMLMotionProps } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { expoOut, power3Out, startAt } from "@/lib/ease";

/* the name splits into letters that rise in, and always stays on its two lines */
export function HeroName({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h = ref.current;
    if (!h) return;
    const fit = () => {
      h.style.fontSize = "";
      let ratio = 1;
      h.querySelectorAll<HTMLElement>(".ln").forEach((l) => {
        const pad = parseFloat(getComputedStyle(l).paddingLeft);
        const avail = l.clientWidth - pad;
        const need = l.scrollWidth - pad;
        if (need > avail && need > 0) ratio = Math.min(ratio, avail / need);
      });
      if (ratio < 1) h.style.fontSize = parseFloat(getComputedStyle(h).fontSize) * ratio * 0.98 + "px";
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  let i = 0;
  return (
    <h1 ref={ref} className="hero-name disp" id="hero-name" aria-label={lines.join(" ")}>
      {lines.map((ln) => (
        <span className="ln" key={ln}>
          {ln.split("").map((c, k) => (
            <motion.span
              key={k}
              className="ch"
              aria-hidden="true"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: expoOut, delay: 0.05 + i++ * 0.035 }}
            >
              {c}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}

type RevealKind = "title" | "block";
const REVEAL: Record<RevealKind, { y: number; blur: boolean; duration: number; at: number }> = {
  title: { y: 24, blur: true, duration: 0.5, at: 90 },
  block: { y: 16, blur: false, duration: 0.45, at: 92 },
};

/* rises in once when it scrolls into view */
export function Reveal({
  as = "div",
  kind = "block",
  children,
  ...rest
}: { as?: "div" | "h2" | "p"; kind?: RevealKind; children: ReactNode } & HTMLMotionProps<"div">) {
  const r = REVEAL[kind];
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      initial={{ y: r.y, opacity: 0, ...(r.blur ? { filter: "blur(6px)" } : {}) }}
      whileInView={{ y: 0, opacity: 1, ...(r.blur ? { filter: "blur(0px)" } : {}) }}
      viewport={startAt(r.at)}
      transition={{ duration: r.duration, ease: power3Out }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* pulls toward the pointer, springs back when it leaves */
export function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });
  if (reduce) return <>{children}</>;
  return (
    <motion.span
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

export function CopyEmail({ email }: { email: string }) {
  const [label, setLabel] = useState("Copy");
  const addr = useRef<HTMLAnchorElement>(null);
  const select = () => {
    const el = addr.current;
    if (!el) return;
    const r = document.createRange();
    r.selectNodeContents(el);
    const s = window.getSelection();
    s?.removeAllRanges();
    s?.addRange(r);
    setLabel("Selected");
  };
  return (
    <div className="email">
      <a className="email-addr" href={`mailto:${email}`} ref={addr}>
        {email}
      </a>
      <button
        className="btn"
        type="button"
        aria-label={label === "Copy" ? "Copy email address" : undefined}
        onClick={() => {
          if (!navigator.clipboard) return select();
          navigator.clipboard.writeText(email).then(() => {
            setLabel("Copied");
            setTimeout(() => setLabel("Copy"), 1800);
          }, select);
        }}
      >
        {label}
      </button>
      <span className="sr" role="status">
        {label === "Copied" ? "Email address copied" : label === "Selected" ? "Email address selected, press Command or Control C to copy" : ""}
      </span>
    </div>
  );
}
