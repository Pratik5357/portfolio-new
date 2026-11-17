export type Stop = [number, string, string];

export type Line = {
  id: string;
  n: number;
  name: string;
  title: string[];
  kind: string;
  when: string;
  status: string;
  demo?: string;
  /* set on personal builds; client work has none */
  source?: string;
  one: string;
  stops: Stop[];
  problem: string;
  built: string[];
  decisions: string[];
  outcome: string;
  stack: string[];
};

/* Every system is a coloured line; each case study is a station. stops: [column 0-5, name, what happens there] */
export const LINES: Line[] = [
 {id:"ai-validation",n:1,name:"AI validation",title:["AI report","validation"],kind:"Client work",when:"2026",status:"In production",
  one:"Every report now gets an automatic correctness pass before an editor opens it.",
  stops:[[0,"Editor stage","report arrives"],[1,"Report lock","one job per report"],[2,"Hangfire","dedicated AI queue"],[3,"AI validation API","signed service call"],[4,"Results","stored per question"],[5,"Researcher","re-routed on fail"]],
  problem:"Editors read every report end to end before approving it. An AI validation service already existed, but nothing connected it to the workflow.",
  built:["When a report reaches the editor stage, a background job calls the AI validation service with a signed service-to-service token.","Results are stored per question, with a report-level summary of what passed, failed or needs a manual look, plus an AI-written summary of the failures.","If any question fails, the report goes back to its researcher automatically, and editors can override.","Editors can re-run validation, guarded by report status so a report can’t change hands mid-flow.","Admins can switch individual questions off, and cancelled orders clean up after themselves."],
  decisions:["A dedicated, capped job queue protects the AI service from overload and keeps AI work apart from everything else.","A distributed lock per report means two jobs never validate the same report at once.","Failures are handled by type: some are final and recorded, timeouts are tracked separately, and the rest retry a limited number of times.","Released in phases behind feature toggles."],
  outcome:"The correctness pass and the re-routing to researchers happen without an editor deciding it. Editors start from a per-question summary instead of a blank read.",
  stack:["Hangfire","ASP.NET Web API 2","EF6","SQL Server","JWT","REST"]},
 {id:"telephony",n:2,name:"Telephony integration",title:["Telephony","integration"],kind:"Client work",when:"2026",status:"In production",
  one:"Calls are placed, tracked and summarised inside the portal, against the record they’re about.",
  stops:[[0,"Click-to-call","from a record"],[1,"Webhooks","live call status"],[2,"Hangfire","delayed summary job"],[3,"Recording","fetched once final"],[4,"AI summary","stored with status"],[5,"Call history","kept per record"]],
  problem:"Staff make phone calls to confirm details. Those calls happened outside the portal, with no record of them against the work they were about.",
  built:["Per-user OAuth with a cloud telephony provider, protected against replayed or expired links, with automatic token refresh and a single retry after a forced refresh.","Click-to-call from inside the portal on the user’s softphone, with numbers validated and formatted before dialling.","Webhooks keep call status in sync in real time, and call history is kept per record.","When a call ends, a delayed job fetches the recording, sends it for an AI summary and stores the summary with its own status.","Access is switched on per user."],
  decisions:["A recurring job keeps webhook subscriptions healthy: it renews them before they expire, recreates them if renewal fails, and removes duplicates.","Each environment has its own subscription, so test and production never receive each other’s events.","Summary jobs wait for recordings to finalise, then retry with back-off."],
  outcome:"Calls are placed, tracked and summarised in the portal, linked to the work they’re about.",
  stack:["Telephony REST API","OAuth 2.0","Webhooks","Hangfire","ASP.NET Web API 2","EF6","SQL Server"]},
 {id:"crm-sync",n:3,name:"CRM sync",title:["CRM","sync"],kind:"Client work",when:"2026",status:"In production",
  one:"Sales and account teams see clients, contacts and orders in their CRM without anyone re-entering them.",
  stops:[[0,"Portal change","client, contact, order"],[1,"Job row","status and retries"],[2,"Hangfire","CRM queue"],[3,"Token cache","locked refresh"],[4,"Upsert","ID, then natural key"],[5,"CRM","REST API"]],
  problem:"Sales and account teams work in a CRM, but clients, contacts and orders only lived in the internal portal.",
  built:["A background sync of accounts, contacts and orders to the CRM’s REST API.","It runs whenever the relevant portal data changes, from new clients to order updates and cancellations.","Each change becomes a job row processed on its own queue, with its status, retry count and last error saved."],
  decisions:["A thread-safe token cache: one refresh at a time behind a double-checked lock, refreshed ahead of expiry.","Idempotent upserts: the stored CRM ID first, otherwise a search by natural key, then an upsert with duplicate checks. This fixed an early bug that created duplicate records.","A distributed lock per record stops two syncs of the same record from racing.","An environment guard means test systems never write to the live CRM."],
  outcome:"The CRM stays in step with the portal automatically, with no manual entry.",
  stack:["CRM REST API","OAuth 2.0 refresh token","Hangfire","ASP.NET Web API 2","EF6","SQL Server"]},
 {id:"partner-api",n:4,name:"Partner API",title:["Partner","API"],kind:"Client work",when:"2025 – 2026",status:"In production",
  one:"The versioned API partners use to place orders and collect results, built to replace older services without breaking anyone.",
  stops:[[0,"Partner system","integrations"],[1,"JWT","per-client rights"],[2,"Versioned API","old and new side by side"],[3,"Orders, search","amend, cancel, status"],[4,"Delivery","XSLT, PDF, Word"],[5,"Blob storage","result files"]],
  problem:"Business clients and partners order and retrieve results through an API. The older services needed a replacement that wouldn’t break the integrations already using them.",
  built:["A layered .NET 8 solution with separate API, business, data, model and common projects.","Endpoints for authentication, account details, subscriptions, ordering (create, amend, cancel, status), result retrieval and company search.","Per-client delivery formats: XML transformed with each client’s own XSLT, HTML, PDF and Word, served from blob storage.","Request validation, request and response logging, global exception handling and Swagger docs."],
  decisions:["URL-based versioning runs versions side by side, so existing integrations keep working while new ones get the improved contract.","JWT authentication with per-client authorization loaded from the database: each client’s rights decide what it can call."],
  outcome:"Partners integrate against one versioned, documented API and get results in their own format.",
  stack:["ASP.NET Core 8","EF Core","SQL Server","JWT","Asp.Versioning","FluentValidation","AutoMapper","Saxon XSLT","NReco PDF","OpenXML","Azure Blob","log4net","Swagger"]},
 {id:"storefront-api",n:5,name:"Storefront API",title:["Storefront","API"],kind:"Client work",when:"2026",status:"In production",
  one:"A customer-facing site’s backend, moved out of a legacy MVC app into a documented .NET 8 REST API.",
  stops:[[0,"New frontend","own release cycle"],[1,".NET 8 API","Dapper, rate limits"],[2,"Payments","signed webhooks"],[3,"OAuth 2.0","client credentials"],[4,"Portal API","system of record"]],
  problem:"The customer-facing site, where people search and buy online, was a legacy ASP.NET MVC app. A full frontend rebuild needed a standalone backend.",
  built:["A layered .NET 8 Web API with Dapper on SQL Server.","Migrated accounts (including one-time-password sign-in), search, cart, orders, reference data and payments.","Payments confirmed through a signature-verified webhook.","Integrations for file storage, HTML-to-PDF and document conversion."],
  decisions:["Two separate security paths: payment webhooks are verified by signature, and calls to the internal portal API use OAuth 2.0 client credentials with a cached, lock-protected token.","Sensitive endpoints are rate-limited with a clean JSON error.","One response envelope from a global exception middleware, and Swagger examples for every endpoint."],
  outcome:"Frontend and backend now release independently, and the new frontend talks to a documented REST contract.",
  stack:["ASP.NET Core 8","Dapper","SQL Server","Stripe","JWT","OAuth 2.0 client credentials","Rate limiting","FluentValidation","AutoMapper","Azure Blob","Swagger"]},
 {id:"email-orders",n:6,name:"Email orders",title:["Email","orders"],kind:"Client work",when:"2025 – 2026",status:"In production",
  one:"Order emails in several client formats become system orders, with no one retyping them.",
  stops:[[0,"Shared mailbox","unread mail"],[1,"Graph API","app-only auth"],[2,"Known senders","mapped to parsers"],[3,"Parser factory","one per format"],[4,"SQL Server","order record"],[5,"Mail folders","processed or failed"]],
  problem:"Some clients send orders by email, each in its own format, and staff typed them into the system by hand.",
  built:["A scheduled .NET worker reads unread mail from a shared mailbox through Microsoft Graph with app-only auth.","Known senders map to their own parser, so a new client format means a new parser and a config entry.","Parsers clean the HTML, extract the order fields, and map values to internal codes and accounts.","Valid orders go into SQL Server. Every email is logged and moved to a Processed or Failed folder.","Reply and forward chains resolve to the original sender, with rolling daily logs."],
  decisions:["A strategy pattern per sender, so client formats never share fragile parsing code.","Moving each message to Processed or Failed means nothing is processed twice and failures are easy to triage."],
  outcome:"Orders from these clients flow from inbox to system with no manual keying.",
  stack:[".NET worker","Microsoft Graph SDK","MSAL","SQL Server","Serilog"]},
 {id:"relayforge",n:7,name:"RelayForge",title:["Relay","Forge"],kind:"Personal build",when:"2026",status:"Live demo",
  demo:"https://relay-forge.vercel.app/",source:"https://github.com/Pratik5357/RelayForge",
  one:"A distributed DAG job scheduler built to be watched while it runs: Postgres as the queue, workers that scale out, and crash recovery you can see.",
  stops:[[0,"Next.js UI","live DAG view"],[1,"Minimal API","submit, idempotent"],[2,"Postgres queue","ready rows, NOTIFY"],[3,"Workers","heartbeated leases"],[4,"Outbox","numbered events"],[5,"SignalR","live UI, replay"]],
  problem:"Background job systems are easy to describe and hard to get right. Steps depend on each other, independent work should run in parallel, failures need retries that don’t hammer anything, and a crash mid-run shouldn’t leave work stuck. Once it works, all of that is invisible.",
  built:["A pure domain layer, with no EF or ASP.NET dependency, for cycle detection, topological ordering, readiness and job finalisation.","Postgres is the queue: a ready task is a row, not an entry in process memory, so nothing is lost on a restart. Workers run as separate processes, and the lease sweep and scheduler are leader-elected with an advisory lock.","Tasks do real work through handlers (HTTP, delay, simulated), pass outputs to their dependents, and can run in their own process or container, killed at the time limit, with live logs.","Cron schedules with misfire and overlap policies, plus operator actions: redrive a failed step, pause and resume a run, idempotent submit, priority with aging and per-tenant caps.","Ten guided scenarios, including a worker crashing mid-step and a frozen worker waking up too late. OpenTelemetry traces and a Grafana dashboard come with the Docker Compose stack."],
  decisions:["Leases last 15 s and are renewed every 5 s, and every write after a claim is fenced on the lease owner and attempt number. A stale worker’s late result is recorded as rejected and changes nothing.","A task’s outcome, the promotion of its dependents and its events commit in one transaction through an outbox. Events are numbered per job, delivered at least once and replayable.","A load test showed a second worker made it slower. Two fixes, a single-statement start event and a stored claim-order key the claim query can index, took two workers from 0.7× to 1.8× the throughput of one, until Postgres CPU became the limit.","Exponential backoff from 500 ms, capped at 8 s, with ±20% jitter so tasks that fail together don’t retry in lockstep. Four attempts by default, then dead-lettered."],
  outcome:"Each scenario submits a real job and shows it running live. 25 xUnit domain tests and a Testcontainers suite that checks every guarantee against real Postgres run in GitHub Actions on every push, with the frontend lint and build.",
  stack:[".NET 8","Minimal API","EF Core","PostgreSQL","SignalR","Redis","OpenTelemetry","Prometheus","Grafana","Docker","Next.js","TypeScript","Tailwind CSS","xUnit","Testcontainers","GitHub Actions"]},
 {id:"ethix",n:8,name:"Ethix Portal",title:["Ethix","Portal"],kind:"Personal build",when:"2026",status:"Live demo",
  demo:"https://ethixportal.netlify.app/",source:"https://github.com/Pratik5357/EthixPortal",
  one:"Research-ethics proposals, from first draft to final decision, in one portal with four roles.",
  stops:[[0,"React wizard","saves drafts"],[1,"Express API","JWT, role guard"],[2,"Access rules","owner or assigned"],[3,"Multer","PDF only, 50 MB"],[4,"MongoDB","8 proposal states"]],
  problem:"Ethics committee proposals are long forms with investigators, consent sections, checklists and attachments. Several people touch each one before it’s approved, and spreadsheets and email threads weren’t keeping up.",
  built:["A multi-section proposal wizard (React, react-hook-form and Zod) that saves drafts as you go and shows how many sections are ready.","Four roles, researcher, admin, scrutiny and reviewer, each with its own dashboard.","Eight explicit states: draft, submitted, admin verified, scrutiny verified, under review, revision required, approved and rejected.","Reviewers comment with a decision: approve, request a revision or reject. Approved proposals are listed as downloadable documents.","PDF-only attachments up to 50 MB, uploaded through Multer and stored with the proposal."],
  decisions:["15-minute access tokens with a 7-day refresh token in an httpOnly cookie.","Role middleware on every route, plus per-proposal checks: only the owner or an assigned reviewer can open a proposal.","Review type (exemption, expedited or full committee) is captured on the proposal itself."],
  outcome:"Researchers submit and track proposals, admins and scrutiny verify them, and reviewers record decisions, all in one place.",
  stack:["React 19","Vite","Tailwind CSS","react-hook-form","Zod","Express","Node.js","MongoDB","Mongoose","JWT","bcrypt","Multer"]},
 {id:"contrapost",n:9,name:"Contrapost",title:["Contra","post"],kind:"Personal build",when:"2026",status:"Code on GitHub",
  source:"https://github.com/Pratik5357/Contrapost",
  one:"A double-entry payments ledger that keeps balances exactly right under concurrent load, client retries and processes dying mid-flight.",
  stops:[[0,"API","idempotency keys"],[1,"PostgreSQL","ordered row locks"],[2,"Outbox","same transaction"],[3,"Relay","publisher confirms"],[4,"RabbitMQ","quorum queues, DLQ"],[5,"Consumers","inbox dedupe"]],
  problem:"Moving money looks like one UPDATE. In production it’s four problems at once: two requests spending the same balance, a client retrying after a timeout and getting charged twice, a crash between the commit and the reply, and balances that quietly drift from their history. I wanted to show, with evidence rather than claims, what it takes to get all four right.",
  built:["Accounts and multi-leg transfers in integer minor units, where debits always equal credits, history is append-only and mistakes are undone by a single reversal.","Holds that reserve money without moving it, then capture in full or in parts, void, or expire through a background worker.","Idempotency keys on every money-moving request, claimed in the same database transaction as the ledger writes, so a retry replays the stored response and never posts twice.","A transactional outbox relayed to RabbitMQ with publisher confirms, read by consumers that deduplicate through an inbox.","A reconciliation job that re-derives eight invariants from the postings, nightly or on demand, with an alert on any finding, plus a read-only Next.js operator dashboard.","API-key scopes, a Redis rate limiter that fails open, OpenTelemetry traces from the API through to the consumers, and Grafana dashboards with Prometheus alerts."],
  decisions:["Balance rows are locked in account-id order, so transfers on the same accounts queue instead of deadlocking. I benchmarked it against optimistic and serializable: with every transfer colliding, ordered locking did 388 transfers/s at a 30 ms p99, while optimistic abandoned 243 transfers and serializable fell to 28/s.","The schema enforces what must never break, even if the code does: deferred triggers check every transaction balances at commit, postings can’t be updated or deleted, and a CHECK constraint forbids overdrafts.","The services log in as a least-privilege database role that can’t rewrite history, and the whole integration suite runs as that role.","A five-minute concurrency run found 17 errors in 264,000 requests: a lock timeout meant for duplicate keys was also cutting off ordinary waits. Nothing was corrupted. I fixed the timeout scope and added a regression test."],
  outcome:"A 64-worker, five-minute run of random transfers, holds, captures, reversals and retries made 256,357 requests with zero server errors, and reconciliation came back clean. All five chaos runs passed: the API killed under load, the broker down for two minutes, the relay killed mid-batch, 200 ms of extra database latency, and Redis down.",
  stack:[".NET 10","Minimal API","PostgreSQL","Dapper","EF Core","RabbitMQ","Redis","OpenTelemetry","Prometheus","Grafana","Next.js","xUnit","Testcontainers","FsCheck","k6","Playwright","Docker","GitHub Actions"]}
];

export const BY: Record<string, Line> = Object.fromEntries(LINES.map((l) => [l.id, l]));

export const GROUPS: { title: string; note: string; ids: string[] }[] = [
  { title: "Inside the portal", note: "Three features sharing one background job server", ids: ["ai-validation", "telephony", "crm-sync"] },
  { title: "Newer .NET 8 services", note: "Built for the same client", ids: ["partner-api", "storefront-api", "email-orders"] },
];

/* built on my own time: listed in their own section, not under a group */
export const SIDE = ["contrapost", "relayforge", "ethix"];

/* where a case study's "back" link returns to */
export const backFor = (l: { source?: string }) =>
  l.source ? { href: "/#side", label: "Side projects" } : { href: "/#experience", label: "Experience" };

export const pcol = (n: number) => `var(--p${n})`;
/* a line drawn on the page background (not a panel): deep on light grounds, bright on dark */
export const mcol = (n: number) => `var(--m${n})`;
export const caseHref = (id: string) => `/work/${id}`;
