export type Stop = [number, string, string];

export type Line = {
  id: string;
  n: number;
  name: string;
  title: string[];
  kind: string;
  when: string;
  status: string;
  live?: boolean;
  demo?: string;
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
 {id:"ai-validation",n:1,name:"AI validation",title:["AI report","validation"],kind:"Client work",when:"Feb – May 2026",status:"In production",
  one:"Every report now gets an automatic correctness pass before an editor opens it.",
  stops:[[0,"Editor stage","report arrives"],[1,"Report lock","one job per report"],[2,"Hangfire","AI queue, 3 workers"],[3,"AI validation API","JWT-signed call"],[4,"Results","stored per question"],[5,"Researcher","re-routed on fail"]],
  problem:"Editors read every report end to end before approving it. An AI validation service already existed, but nothing connected it to the workflow.",
  built:["When a report reaches the editor stage, a Hangfire job calls the AI validation API, signed with a service-to-service JWT.","Results are stored per question (status, confidence, summary), with a report-level summary of passed, failed, skipped and manual-review counts and an AI-written failure summary.","If any question fails, the report goes back to its researcher automatically. Researchers can be opted in or out, and editors can override.","Editors can regenerate validation, limited by report status so a report can’t be reassigned mid-flow.","Admins can disable questions, and cancelling an order cleans up its validation data."],
  decisions:["A dedicated Hangfire queue capped at 3 workers keeps the AI service from being overloaded and keeps AI work apart from other jobs.","A distributed lock per report means two jobs never validate the same report at once.","Failures are handled by type: 413 marks the report too large with no retry, 499 and 504 are recorded as provider timeouts, and anything else retries, then fails after 2 attempts.","Released in two phases behind code toggles."],
  outcome:"The correctness pass and the re-routing to researchers happen without an editor deciding it. Editors start from a per-question summary instead of a blank read.",
  stack:["Hangfire","ASP.NET Web API 2","EF6","SQL Server","JWT","REST"]},
 {id:"ringcentral",n:2,name:"RingCentral calls",title:["RingCentral","calls"],kind:"Client work",when:"Aug – Oct 2026",status:"In production",
  one:"Calls to companies are placed, tracked and summarised inside the portal, against the report they’re about.",
  stops:[[0,"Click-to-call","Call-Out API"],[1,"Webhooks","live call status"],[2,"Hangfire","delayed summary job"],[3,"Recording","fetched once final"],[4,"AI summary","stored with status"],[5,"Call history","kept per report"]],
  problem:"Researchers call companies to confirm report details. Those calls happened outside the portal, with no record against the report.",
  built:["Per-user RingCentral OAuth (authorization code), with a state check against replayed or expired links. Tokens refresh automatically, and a 401 is retried once after a forced refresh.","Click-to-call from a report through the Call-Out API on the user’s WebPhone, moved from the older RingOut flow in Sep 2026. Numbers are validated and formatted before dialling.","Telephony-session webhooks keep call status in sync in real time, and call history is kept per report.","When a call ends, a delayed job fetches the recording, sends it to the AI summary service and stores the summary with its own status.","RingCentral access is switched on per user."],
  decisions:["An hourly recurring job checks each environment’s webhook subscription: it renews inside 24 hours of expiry, recreates it if renewal fails, and deletes duplicates.","UAT and production subscriptions are isolated, so neither steals the other’s events.","Summary jobs wait because recordings take time to finalise, then retry with back-off at 20, 30 and 60 seconds."],
  outcome:"Calls are placed, tracked and summarised in the portal, linked to the report.",
  stack:["RingCentral REST","OAuth 2.0","Call-Out","Telephony Sessions","Webhooks","Hangfire","ASP.NET Web API 2","EF6","SQL Server"]},
 {id:"zoho",n:3,name:"Zoho CRM sync",title:["Zoho CRM","sync"],kind:"Client work",when:"Jul – Sep 2026",status:"In production",
  one:"Sales and account teams see clients, contacts and orders in Zoho without anyone re-entering them.",
  stops:[[0,"Portal change","client, contact, order"],[1,"Job row","status and retries"],[2,"Hangfire","CRM queue"],[3,"Token cache","locked refresh"],[4,"Upsert","ID, then natural key"],[5,"Zoho CRM","v8 API"]],
  problem:"Sales and account teams work in Zoho CRM, but clients, contacts and orders only lived in the internal portal.",
  built:["A background sync of accounts, contacts and report requests to the Zoho CRM v8 API.","It runs when a client or contact changes, an order is created, updated or cancelled, an invoice’s final price changes, or a report is downloaded.","Each change becomes a job row processed on its own Hangfire CRM queue, with status, retry count and error saved."],
  decisions:["A thread-safe token cache: one refresh at a time behind a double-checked SemaphoreSlim lock, refreshed 5 minutes before expiry.","Idempotent upserts: the stored Zoho ID first, otherwise a search by natural key (account code, email, order ID), then an upsert with duplicate checks. This fixed an early bug that created duplicate records.","A distributed lock per record stops two syncs of the same record from racing.","A production-only guard means UAT never writes to the live CRM."],
  outcome:"The CRM stays in step with the portal automatically, with no manual entry.",
  stack:["Zoho CRM API v8","OAuth 2.0 refresh token","Hangfire","ASP.NET Web API 2","EF6","SQL Server"]},
 {id:"b2b-api",n:4,name:"B2B Web Service V3",title:["B2B Web","Service V3"],kind:"Client work",when:"Jun 2025 – Oct 2026",status:"In production",
  one:"The API partners use to order reports and collect them, built to replace the V1 and V2 services.",
  stops:[[0,"Partner system","integrations"],[1,"JWT","per-client rights"],[2,"Versioned API","v1 and v2"],[3,"Orders, search","amend, cancel, status"],[4,"Delivery","XSLT, PDF, Word"],[5,"Azure Blob","report files"]],
  problem:"Business clients and partners order and retrieve reports through an API. The older V1 and V2 services needed a replacement that wouldn’t break the integrations already using them.",
  built:["A layered .NET 8 solution: API, Business, Data, Model and Common projects. About 100 commits.","Endpoints for login, account details, subscriptions and periodic updates, create order, query, amend, cancel, order status, report retrieval and enhanced company search.","Client-specific delivery: XML through each client’s own XSLT (Saxon), HTML with client tag rules, PDF (NReco) and Word (OpenXML), served from Azure Blob Storage.","FluentValidation, request and response logging, global exception middleware and Swagger docs."],
  decisions:["URL-based versioning runs v1 and v2 side by side, so existing integrations keep working while new ones get the improved contract.","JWT authentication with per-client authorization loaded from the database: each client’s rights decide what it can call."],
  outcome:"Partners integrate against one versioned, documented API and get reports in their own format.",
  stack:["ASP.NET Core 8","EF Core","SQL Server","JWT","Asp.Versioning","FluentValidation","AutoMapper","Saxon XSLT","NReco PDF","OpenXML","Azure Blob","log4net","Swagger"]},
 {id:"marketing-api",n:5,name:"Marketing API",title:["Marketing","API"],kind:"Client work",when:"Jul – Oct 2026",status:"In production",
  one:"The marketing site’s backend, moved out of a legacy MVC app into a documented .NET 8 REST API.",
  stops:[[0,"New frontend","own release cycle"],[1,".NET 8 API","Dapper, rate limits"],[2,"Stripe","signed webhooks"],[3,"OAuth 2.0","client credentials"],[4,"Portal API","system of record"]],
  problem:"The customer-facing marketing site, where people search for companies and buy reports, was a legacy ASP.NET MVC app. A full frontend revamp needed a standalone backend.",
  built:["A .NET 8 Web API in API, Business, DAL, Integrations, Models and Common layers, with Dapper on SQL Server.","Migrated account (including OTP), search, cart, reports, master data and payments.","Stripe payments confirmed through a signature-verified webhook with timestamp tolerance.","Integrations for Azure Blob report files, NReco HTML to PDF and Zamzar file conversion."],
  decisions:["Two separate security paths: Stripe is verified by webhook signature, and the call to the portal’s client API uses OAuth 2.0 client credentials, with the token cached and refreshed under a lock.","OTP endpoints are rate-limited to 5 a minute with a JSON 429.","One response envelope from a global exception middleware, and Swagger examples for every endpoint."],
  outcome:"Frontend and backend now release independently, and the new frontend talks to a documented REST contract.",
  stack:["ASP.NET Core 8","Dapper","SQL Server","Stripe.net","JWT","OAuth 2.0 client credentials","Rate limiting","FluentValidation","AutoMapper","Azure Blob","Swagger"]},
 {id:"email-orders",n:6,name:"Email orders",title:["Email","orders"],kind:"Client work",when:"Since Nov 2025",status:"In production",
  one:"Order emails in three client formats become system orders, with no one retyping them.",
  stops:[[0,"Shared mailbox","unread mail"],[1,"Graph API","MSAL, app-only"],[2,"Allow-list","known senders"],[3,"Parser factory","3 client formats"],[4,"SQL Server","order record"],[5,"Mail folders","processed or failed"]],
  problem:"Some clients send orders by email, each in its own format, and staff typed them into the system by hand.",
  built:["A scheduled .NET worker reads unread mail from a shared mailbox through Microsoft Graph, with MSAL app-only auth and OData filters on status, date and subject.","Senders on an allow-list map to their own parser. There are three formats today; a new client means a new parser and a config entry.","Parsers clean the HTML with regex (stripping security-scanner banners), extract the order fields, and map country names and senders to internal codes and accounts.","Valid orders go into SQL Server. Every email is logged and moved to a Processed or Failed folder.","Reply and forward chains resolve to the original sender. Serilog keeps rolling daily logs for 31 days."],
  decisions:["A strategy pattern per sender (IEmailParser), so client formats never share fragile parsing code.","Moving each message to Processed or Failed means nothing is processed twice and failures are easy to triage."],
  outcome:"Orders from these clients flow from inbox to system with no manual keying.",
  stack:[".NET worker","Microsoft Graph SDK","MSAL","Regex","SQL Server","Serilog"]},
 {id:"relayforge",n:7,name:"RelayForge",title:["Relay","Forge"],kind:"Personal build",when:"2026",status:"Live demo",live:true,
  demo:"https://relay-forge.vercel.app/",source:"https://github.com/Pratik5357/RelayForge",
  one:"A DAG job scheduler built to be watched while it runs: retries, dead letters and crash recovery, live.",
  stops:[[0,"Next.js UI","live DAG view"],[1,"Minimal API",".NET 8"],[2,"DAG domain","topological sort"],[3,"Worker pool","channels and leases"],[4,"Sweep","retries, reclaims"],[5,"PostgreSQL","EF Core"]],
  problem:"Background job systems are easy to describe and hard to get right. Steps depend on each other, independent work should run in parallel, failures need retries that don’t hammer anything, and a crash mid-run shouldn’t leave work stuck. Once it works, all of that is invisible.",
  built:["A pure domain layer, with no EF or ASP.NET dependency, for cycle detection, topological ordering, readiness and job finalisation.","An in-process worker pool on System.Threading.Channels that runs independent steps in parallel and respects dependencies.","Tasks are claimed with a lease. A sweep runs every second to requeue retries that are due and reclaim tasks whose lease expired.","A minimal API to submit, list, inspect and cancel jobs, with SignalR pushing every state change to the Next.js UI.","Six guided scenarios: ordering, parallelism, retry, dead letter, partial failure and cancellation."],
  decisions:["Exponential backoff from 500 ms, capped at 8 s, with ±20% jitter so tasks that fail together don’t retry in lockstep. Four attempts by default, then dead-lettered.","A crashed task goes through the same failure path as an ordinary failure, so a restart costs it an attempt instead of leaving it stuck.","Cancellation is cooperative: a task that fails while its job is winding down goes straight to Cancelled instead of using up its retries.","A job’s state is derived from its tasks, so one dead branch ends the job PartiallyFailed instead of Failed."],
  outcome:"Each scenario submits a real job and shows it running live. 23 xUnit domain tests run in GitHub Actions on every push, with the frontend lint and build.",
  stack:[".NET 8","Minimal API","EF Core","PostgreSQL","SignalR","System.Threading.Channels","Next.js","TypeScript","Tailwind CSS","xUnit","GitHub Actions"]},
 {id:"ethix",n:8,name:"Ethix Portal",title:["Ethix","Portal"],kind:"Personal build",when:"2026",status:"Live demo",live:true,
  demo:"https://ethixportal.netlify.app/",source:"https://github.com/Pratik5357/EthixPortal",
  one:"Research-ethics proposals, from first draft to final decision, in one portal with four roles.",
  stops:[[0,"React wizard","saves drafts"],[1,"Express API","JWT, role guard"],[2,"Access rules","owner or assigned"],[3,"Multer","PDF only, 50 MB"],[4,"MongoDB","8 proposal states"]],
  problem:"Ethics committee proposals are long forms with investigators, consent sections, checklists and attachments. Several people touch each one before it’s approved, and spreadsheets and email threads weren’t keeping up.",
  built:["A multi-section proposal wizard (React, react-hook-form and Zod) that saves drafts as you go and shows how many sections are ready.","Four roles, researcher, admin, scrutiny and reviewer, each with its own dashboard.","Eight explicit states: draft, submitted, admin verified, scrutiny verified, under review, revision required, approved and rejected.","Reviewers comment with a decision: approve, request a revision or reject. Approved proposals are listed as downloadable documents.","PDF-only attachments up to 50 MB, uploaded through Multer and stored with the proposal."],
  decisions:["15-minute access tokens with a 7-day refresh token in an httpOnly cookie.","Role middleware on every route, plus per-proposal checks: only the owner or an assigned reviewer can open a proposal.","Review type (exemption, expedited or full committee) is captured on the proposal itself."],
  outcome:"Researchers submit and track proposals, admins and scrutiny verify them, and reviewers record decisions, all in one place.",
  stack:["React 19","Vite","Tailwind CSS","react-hook-form","Zod","Express","Node.js","MongoDB","Mongoose","JWT","bcrypt","Multer"]}
];

export const BY: Record<string, Line> = Object.fromEntries(LINES.map((l) => [l.id, l]));

export const GROUPS: { title: string; note: string; ids: string[] }[] = [
  { title: "Inside the portal", note: "Three features sharing one Hangfire job server", ids: ["ai-validation", "ringcentral", "zoho"] },
  { title: "Newer .NET 8 services", note: "Built for the same client", ids: ["b2b-api", "marketing-api", "email-orders"] },
];

/* built on my own time: listed in their own section, not under a group */
export const SIDE = ["relayforge", "ethix"];

/* where a case study's "back" link returns to */
export const backFor = (l: { live?: boolean }) =>
  l.live ? { href: "/#side", label: "Side projects" } : { href: "/#experience", label: "Experience" };

export const pcol = (n: number) => `var(--p${n})`;
/* a line drawn on the page background (not a panel): deep on light grounds, bright on dark */
export const mcol = (n: number) => `var(--m${n})`;
export const caseHref = (id: string) => `/work/${id}`;
