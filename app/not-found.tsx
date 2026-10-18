import type { Metadata } from "next";
import { TLink } from "@/components/site";
import { LINES, caseHref, mcol } from "@/lib/lines";

export const metadata: Metadata = { title: "Not found · Pratik Kumbhar" };

/* a stop that isn't on the network: say so, then show every line it could have been */
export default function NotFound() {
  return (
    <main id="detail" className="lost">
      <div className="wrap">
        <p className="data lost-code">404 · no such stop</p>
        <h1 className="disp lost-title">Off the map.</h1>
        <p className="lost-lede">
          There’s no page at this address. It may have been renamed, or the link has a typo. Every case study is one of these eight lines:
        </p>
        <ul className="lost-lines">
          {LINES.map((l) => (
            <li key={l.id}>
              <TLink href={caseHref(l.id)}>
                <span className="badge" style={{ background: mcol(l.n), color: "var(--m-ink)" }}>
                  {l.n}
                </span>
                {l.name}
              </TLink>
            </li>
          ))}
        </ul>
        <div className="btns">
          <TLink className="btn btn-solid" href="/#experience">
            Experience
          </TLink>
          <TLink className="btn" href="/#top">
            Home
          </TLink>
        </div>
      </div>
    </main>
  );
}
