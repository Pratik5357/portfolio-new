"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { expoOut } from "@/lib/ease";

/* the intro and buttons follow the name in, once, on load */
export function HeroIn({ as = "div", i, className, children }: { as?: "div" | "p"; i: number; className?: string; children: ReactNode }) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: expoOut, delay: 0.45 + i * 0.08 }}
    >
      {children}
    </Tag>
  );
}
