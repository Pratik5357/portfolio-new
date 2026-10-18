"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { power3Out, startAt } from "@/lib/ease";
import { EMAIL, LINKEDIN, RESUME_HREF } from "@/lib/contact";
import { LINES, backFor, caseHref, pcol, type Line } from "@/lib/lines";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "./icons";
import { TLink } from "./site";

const rise = (delay: number) => ({
  initial: { y: 12, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4, ease: power3Out, delay },
});

const rowKids = { hidden: {}, shown: { transition: { staggerChildren: 0.05 } } };
const rowKid = { hidden: { y: 16, opacity: 0 }, shown: { y: 0, opacity: 1, transition: { duration: 0.45, ease: power3Out } } };

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section className="d-row" variants={rowKids} initial="hidden" whileInView="shown" viewport={startAt(90)}>
      <motion.h2 className="disp" variants={rowKid}>
        {title}
      </motion.h2>
      {children}
    </motion.section>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <motion.ul className="bul" variants={rowKid}>
    {items.map((t) => (
      <li key={t}>{t}</li>
    ))}
  </motion.ul>
);

export function CaseStudy({ line: l, hasResume }: { line: Line; hasResume: boolean }) {
  const reduce = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  /* by id: `line` arrives as a serialized copy from the server, so it's never === an entry in LINES */
  const back = backFor(l);
  const nx = LINES[(LINES.findIndex((x) => x.id === l.id) + 1) % LINES.length];
  const src = l.live ? "Public on GitHub" : "Private (client work, details anonymised)";

  /* move focus to the new page's hero (named by its title), like a real page load; the next Tab lands on the back link */
  useEffect(() => {
    hero.current?.focus({ preventScroll: true });
  }, [l.id]);

  return (
    <main id="detail">
      <article style={{ "--c": pcol(l.n) } as CSSProperties}>
        <header ref={hero} className="d-hero" tabIndex={-1} aria-labelledby="case-title">
          <div className="wrap">
            <TLink className="back" href={back.href}>
              <ArrowLeft /> {back.label}
            </TLink>
            <motion.div className="d-id" {...rise(0.18)}>
              <span className="badge">{l.n}</span>
              <span>
                {l.kind} · {l.status}
              </span>
            </motion.div>
            <h1 id="case-title" className="d-title disp" aria-label={l.title.join(" ")}>
              {l.title.map((t, i) => (
                <span className="ln" aria-hidden="true" key={t}>
                  <motion.span
                    initial={reduce ? false : { y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: power3Out, delay: 0.08 + i * 0.06 }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div className="d-cols" {...rise(0.23)}>
              <p className="d-one">{l.one}</p>
              <dl className="d-meta">
                <dt className="data">When</dt>
                <dd className="data">{l.when}</dd>
                <dt className="data">Source</dt>
                <dd>{src}</dd>
                <dt className="data">Parts</dt>
                <dd className="data">{l.stops.length}</dd>
              </dl>
            </motion.div>
            {l.live && (
              <motion.div className="d-links" {...rise(0.28)}>
                <a className="solid" href={l.demo} target="_blank" rel="noopener">
                  Open live demo <ArrowUpRight />
                </a>
                <a href={l.source} target="_blank" rel="noopener">
                  Source on GitHub <ArrowUpRight />
                </a>
              </motion.div>
            )}
            <div className="d-parts">
              <p className="parts-h data">What it’s made of</p>
              {/* the system drawn as its line: stations in order, the track runs left to right (top to bottom on phones) */}
              <ol className="route" aria-label={`Parts of ${l.name}, in order`} style={{ "--n": l.stops.length } as CSSProperties}>
                {l.stops.map((st, i) => (
                  <motion.li
                    key={st[1]}
                    className={i === 0 || i === l.stops.length - 1 ? "terminus" : undefined}
                    style={{ "--i": i } as CSSProperties}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: power3Out, delay: 0.3 + i * 0.06 }}
                  >
                    {i < l.stops.length - 1 && <span className="seg" aria-hidden="true" />}
                    <span className="ring" aria-hidden="true" />
                    <b>{st[1]}</b>
                    <span className="what">{st[2]}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </header>

        <div className="d-body wrap">
          <Row title="Problem">
            <motion.p variants={rowKid}>{l.problem}</motion.p>
          </Row>
          <Row title="What I built">
            <Bullets items={l.built} />
          </Row>
          <Row title="Key decisions">
            <Bullets items={l.decisions} />
          </Row>
          <Row title="Outcome">
            <motion.p variants={rowKid}>{l.outcome}</motion.p>
          </Row>
          <Row title="Stack">
            <motion.div className="chips" variants={rowKid}>
              {l.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </motion.div>
          </Row>
          {/* a convinced reader shouldn't have to go back to the home page to get in touch */}
          <Row title="Hiring for backend?">
            <motion.div className="hire" variants={rowKid}>
              <p>Email or LinkedIn works best. There’s no form, on purpose.</p>
              <div className="btns">
                <a className="btn btn-solid" href={`mailto:${EMAIL}`}>
                  Email me
                </a>
                {hasResume && (
                  <a className="btn" href={RESUME_HREF} target="_blank" rel="noopener">
                    Resume <ArrowUpRight size={16} />
                  </a>
                )}
                <a className="btn" href={LINKEDIN} target="_blank" rel="noopener">
                  LinkedIn <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          </Row>
        </div>

        <TLink className="next" href={caseHref(nx.id)} data-cursor="Next" style={{ "--c": pcol(nx.n) } as CSSProperties}>
          <div className="wrap">
            <small className="data">Next · line {nx.n}</small>
            <strong>
              {nx.name} <ArrowRight />
            </strong>
          </div>
        </TLink>
      </article>
    </main>
  );
}
