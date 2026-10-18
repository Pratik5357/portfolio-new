"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CAT_SPRITE } from "@/lib/cat-sprite";

/* same follow as the original's gsap.quickTo: 0.45s expo.out, retargeted on every move */
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const FOLLOW = { duration: 0.45, ease: expoOut };

const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
const cursorWanted = () => window.matchMedia(QUERY).matches;
const subscribeQuery = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function Cursor() {
  const on = useSyncExternalStore(subscribeQuery, cursorWanted, () => false);
  return on ? <CursorLive /> : null;
}

function CursorLive() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  /* the cat snaps to whole screen pixels so the sprite stays crisp */
  const cx = useTransform(x, Math.round);
  const cy = useTransform(y, Math.round);
  const [big, setBig] = useState(false);
  const [blink, setBlink] = useState(0);
  const cat = useRef<HTMLDivElement>(null);
  const bigRef = useRef(false);

  useEffect(() => {
    const eyes = cat.current?.querySelector<SVGGElement>("#av-eyes");
    const rest = () => eyes && (eyes.style.transform = "translate(-1px,0px)"); /* at rest it side-eyes, like 👀 */
    rest();
    let lx = 0;
    let ly = 0;
    let still: ReturnType<typeof setTimeout>;
    const clamp = (v: number) => Math.round(Math.max(-1, Math.min(1, v * 0.15)));

    const move = (e: PointerEvent) => {
      animate(x, e.clientX, FOLLOW);
      animate(y, e.clientY, FOLLOW);
      /* the eyes glance the way you're moving, then settle */
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      if (bigRef.current && eyes) {
        eyes.style.transform = `translate(${clamp(dx)}px,${clamp(dy)}px)`;
        clearTimeout(still);
        still = setTimeout(rest, 260);
      }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.("[data-cursor]");
      if (t && !bigRef.current) {
        bigRef.current = true;
        setBig(true);
        setTimeout(() => setBlink((b) => b + 1), 260);
      }
    };
    const out = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.("[data-cursor]");
      if (t && !t.contains(e.relatedTarget as Node | null)) {
        bigRef.current = false;
        setBig(false);
      }
    };
    const blinker = setInterval(() => bigRef.current && setBlink((b) => b + 1), 3200);

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      clearInterval(blinker);
      clearTimeout(still);
    };
  }, [x, y]);

  /* restart the blink keyframe each time */
  useEffect(() => {
    const c = cat.current;
    if (!c || !blink) return;
    c.classList.remove("blink");
    void c.offsetWidth;
    c.classList.add("blink");
  }, [blink]);

  return (
    <>
      <motion.div className={"cursor" + (big ? " big" : "")} style={{ x, y }} aria-hidden="true" />
      <motion.div ref={cat} className={"cursor-cat" + (big ? " big" : "")} style={{ x: cx, y: cy }} aria-hidden="true">
        <svg
          className="av"
          width="72"
          height="72"
          viewBox="-3.5 -5 36 36"
          shapeRendering="crispEdges"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: CAT_SPRITE }}
        />
      </motion.div>
    </>
  );
}
