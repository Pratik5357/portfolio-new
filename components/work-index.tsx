"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { power3Out, startAt } from "@/lib/ease";
import { BY, GROUPS, SIDE, caseHref, mcol, pcol } from "@/lib/lines";
import { ArrowUpRight } from "./icons";
import { Reveal } from "./motion-bits";
import { TLink } from "./site";

const list = { hidden: {}, shown: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { y: 12, opacity: 0 }, shown: { y: 0, opacity: 1, transition: { duration: 0.4, ease: power3Out } } };

/* one list of case-study rows; rows rise in once, as a list */
function Index({ ids }: { ids: string[] }) {
  return (
    <motion.ol className="index" variants={list} initial="hidden" whileInView="shown" viewport={startAt(88)}>
      {ids.map((id) => {
        const l = BY[id];
        return (
          <motion.li key={id} variants={item}>
            <TLink className="row" href={caseHref(id)} data-cursor="Open" style={{ "--c": pcol(l.n), "--cm": mcol(l.n) } as CSSProperties}>
              <span className="badge">{l.n}</span>
              <span className="row-name">{l.name}</span>
              <span className="row-hook">
                <p>{l.one}</p>
                <span className="row-meta">
                  <span className="mini" aria-hidden="true">
                    {l.stops.map((st) => (
                      <i key={st[1]} />
                    ))}
                  </span>
                  <span className="data">
                    {l.when} · {l.stops.length} parts
                  </span>
                </span>
              </span>
              <span className="row-go">
                <ArrowUpRight size={28} />
              </span>
            </TLink>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

/* client work, grouped by where it runs */
export function WorkIndex() {
  return (
    <div>
      {GROUPS.map((g) => (
        <div className="group" key={g.title}>
          <Reveal className="group-h">
            <h3>{g.title}</h3>
            <span className="data">{g.note}</span>
          </Reveal>
          <Index ids={g.ids} />
        </div>
      ))}
    </div>
  );
}

/* personal builds: one plain list */
export function SideIndex() {
  return <Index ids={SIDE} />;
}
