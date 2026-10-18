import { CITY, EMAIL, GITHUB, LINKEDIN, RESUME_HREF } from "@/lib/contact";
import { HAS_RESUME } from "@/lib/has-resume";
import { ArrowUpRight } from "@/components/icons";
import { CopyEmail, HeroName, Magnetic, Reveal } from "@/components/motion-bits";
import { HeroIn } from "@/components/hero-in";
import { TLink } from "@/components/site";
import { SideIndex, WorkIndex } from "@/components/work-index";

const STACK: [string, string][] = [
  ["Backend", "ASP.NET Core 8 Web API, ASP.NET Web API 2 on OWIN, .NET Framework 4.6.1, C#, layered architecture, API versioning, middleware"],
  ["Data", "SQL Server, T-SQL, EF6 code-first migrations, EF Core, Dapper, keyset paging, parameter-sniffing fixes"],
  ["Background jobs", "Hangfire queues, worker limits, recurring and delayed jobs, retries, distributed locks, batch backfills"],
  ["Integrations", "RingCentral, Zoho CRM, Stripe, Microsoft Graph, AI validation and summary services, Zamzar"],
  ["Auth", "JWT, OAuth 2.0 (authorization code, refresh token, client credentials), webhook signatures, rate limiting"],
  ["Documents", "XSLT (Saxon), HTML to PDF (NReco), Word (OpenXML), Azure Blob Storage"],
  ["Personal builds", "PostgreSQL, SignalR, Next.js, TypeScript, React, Node.js, Express, MongoDB, xUnit, GitHub Actions"],
];

/* from the résumé */
const EDUCATION = "B.Tech in Information Technology, Zeal College of Engineering and Research, Pune (2020 – 2024)";

const PRINCIPLES: [string, string][] = [
  ["APIs", "Design and build REST APIs: the endpoints, the validation, who is allowed to call them, and versions that don’t break existing clients."],
  ["Data", "Model the database, write the queries and migrations, and find out why a page got slow when the data grew."],
  ["Integrations", "Connect the product to outside services like telephony, CRM, payments and email, so information moves without anyone copying it by hand."],
  ["Automation", "Turn repeated manual steps into scheduled and background work that runs on its own and reports what it did."],
  ["Production", "Trace bugs back to their cause, ship the fix, and keep improving features people already use every day."],
];

const Resume = ({ solid = false }: { solid?: boolean }) => (
  <a className={"btn" + (solid ? " btn-solid" : "")} href={RESUME_HREF} target="_blank" rel="noopener">
    Resume <ArrowUpRight size={16} />
  </a>
);

export default function Home() {
  return (
    <main id="home">
      <section className="hero" id="top" data-page="Intro" aria-labelledby="hero-name">
        <div className="wrap">
          <HeroName lines={["Pratik", "Kumbhar"]} />
          <div className="hero-row">
            <HeroIn i={0} className="hero-copy">
              <p className="hero-intro">
                <strong>Backend developer</strong> working in .NET and SQL Server, currently at Tudip Technologies.
              </p>
              <p className="hero-status">
                <span className="stn" aria-hidden="true" />
                <b>Open to backend roles.</b>
              </p>
            </HeroIn>
            <HeroIn i={1} className="hero-cta">
              <TLink className="btn btn-solid" href="/#experience">
                See my experience
              </TLink>
              <TLink className="btn" href="/#contact">
                Get in touch
              </TLink>
              {HAS_RESUME && <Resume />}
            </HeroIn>
          </div>
        </div>
      </section>

      <section className="sec" id="about" data-page="About" data-theme="soft" aria-labelledby="about-title">
        <div className="wrap">
          <div className="sec-head">
            <Reveal as="h2" kind="title" className="sec-title disp" id="about-title">
              About
            </Reveal>
          </div>
          <div className="about-grid">
            <Reveal>
              <p className="about-lead">
                I’m Pratik, a backend developer in {CITY}, India. I build the server side of business software: the APIs that apps
                and partners call, the databases behind them, the links to outside services, and the jobs that run in the background.
              </p>
              <p className="about-more">I like code that is easy to read and easy to change, and systems that keep working after release.</p>
              <dl className="facts">
                <div>
                  <dt className="data">Education</dt>
                  <dd>{EDUCATION || <span className="todo">[fill in]</span>}</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal>
              <p className="h3">What I do</p>
              <ol className="principles">
                {PRINCIPLES.map(([k, v]) => (
                  <li key={k}>
                    <b>{k}</b>
                    <span>{v}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec" id="experience" data-page="Experience" aria-labelledby="exp-title">
        <div className="wrap">
          <div className="sec-head">
            <Reveal as="h2" kind="title" className="sec-title disp" id="exp-title">
              Experience
            </Reveal>
          </div>
          <Reveal className="job">
            <div className="job-h">
              <div>
                <b>Tudip Technologies</b>
                <span>Software Developer</span>
              </div>
              <span className="data">Mar 2025 – present</span>
            </div>
            <p className="job-scope">
              Backend work for a business credit-report company: production fixes, improvements and new features on their internal
              portal (.NET Framework, SQL Server, Hangfire), plus the newer .NET 8 services that bring orders in and send reports out.
            </p>
          </Reveal>
          <p className="sel-h data">Selected work</p>
          <WorkIndex />
        </div>
      </section>

      <section className="sec" id="side" data-page="Side projects" aria-labelledby="side-title">
        <div className="wrap">
          <div className="sec-head">
            <Reveal as="h2" kind="title" className="sec-title disp" id="side-title">
              Side projects
            </Reveal>
            <Reveal as="p" className="sec-lede">
              Built on my own time, end to end. Both are live and the code is public.
            </Reveal>
          </div>
          <SideIndex />
        </div>
      </section>

      <section className="sec" id="building" data-page="Next" data-theme="inv" aria-labelledby="build-title">
        <div className="wrap">
          <Reveal className="build-card">
            <div>
              <span className="tag data">Under construction · design drafted Sep 2026</span>
              <Reveal as="h2" kind="title" className="build-title disp" id="build-title">
                24-hour report orchestrator
              </Reveal>
              <p>
                A separate application that will own the workflow for a guaranteed 24-hour report, while the portal stays the system
                of record. Development hasn’t started, so there are no outcomes to claim yet.
              </p>
            </div>
            <ul className="ticks">
              <li>
                <b>Idempotent commands</b>The portal exposes create copy, allocate, field patch and finalise; a claim flag allows one
                workflow per order, even with retries.
              </li>
              <li>
                <b>Two clocks</b>A fixed 24-hour customer deadline, plus timers per stage for researcher, checker, AI and callbacks.
              </li>
              <li>
                <b>Async AI jobs</b>Submit, get <span className="data">202</span> and a job ID, then a signed callback with a polling
                fallback. No HTTP call is held open.
              </li>
              <li>
                <b>Safe rollout</b>Row-version concurrency, writes in shadow mode first, flags per report type, and five researcher
                checkpoints before anything AI-suggested is saved.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="sec" id="stack" data-page="Stack" data-theme="soft" aria-labelledby="stack-title">
        <div className="wrap">
          <div className="sec-head">
            <Reveal as="h2" kind="title" className="sec-title disp" id="stack-title">
              Stack
            </Reveal>
          </div>
          <Reveal>
            <dl className="stack-groups">
              {STACK.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="contact" id="contact" data-page="Contact" data-theme="inv" aria-labelledby="contact-title">
        <div className="wrap">
          <Reveal as="h2" kind="title" className="contact-title disp" id="contact-title">
            Let’s talk.
          </Reveal>
          <Reveal className="contact-row">
            <div>
              <CopyEmail email={EMAIL} />
              <p style={{ marginTop: 12 }}>Hiring for backend? Email or LinkedIn works best. There’s no form, on purpose.</p>
            </div>
            <div className="btns">
              {HAS_RESUME && (
                <Magnetic>
                  <Resume solid />
                </Magnetic>
              )}
              <Magnetic>
                <a className="btn btn-solid" href={LINKEDIN} target="_blank" rel="noopener">
                  LinkedIn <ArrowUpRight size={16} />
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn" href={GITHUB} target="_blank" rel="noopener">
                  GitHub <ArrowUpRight size={16} />
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
