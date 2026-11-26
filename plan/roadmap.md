# PANGAEA — roadmap

Every item is split into **Intelligence** (what the assistant can do) and **Human**
(what only the user can do). "Done when" is a checkable condition, not a feeling.
Numbers described as targets are proposals, not measurements. See `plan/strategy.md`
for the measured baseline and `plan/backlog.md` for IDs.

Status (2026-11-26): all short-term items (P0-2, P0-6…P0-10, P1-1, P1-2) and the
verification matrix (V1…V7) are complete and verified locally. CI runs the same
suite and gates Pages on it. Remaining agent work: CV-ready copy/docs and the
agent-decidable product decisions; human gates remain at M1/M2/M3.

## 1. Short term — concrete next steps

1. **Land the verified commit and confirm CI** (P0-2, P0-10)
   - Intelligence: initialise git on top of `origin/main`, add the lockfile and all
     new files, commit, push, compare remote HEAD SHA with local HEAD, inspect the CI run.
   - Human: answer any repo permission/CI approval prompt if GitHub asks; confirm the
     published Pages build is the one intended (the live URL is public).
   - **Done when:** `git rev-parse HEAD` equals `git ls-remote origin refs/heads/main`,
     the CI run for that SHA is green, and `plan/progress.md` records both SHAs.

2. **Remove the O(n²) duplicate scan** (P0-6)
   - Intelligence: replace the all-pairs 5-gram comparison at `src/lib/engine.ts:115-122`
     with an inverted-index candidate filter; keep identical output for the demo dataset;
     add a test asserting the same signal list and IDs.
   - Human: none.
   - **Done when:** `npm run bench` at 5,000 reviews / 20 runs has a median below 1,000 ms
     on this machine, and all 12 tests still pass.

3. **Make date handling deterministic** (P0-7)
   - Intelligence: parse dates once in `reviewsFromText`/`analyze` rather than sorting raw
     strings and calling `Date.parse` repeatedly; add tests for mixed formats and invalid dates.
   - Human: none.
   - **Done when:** tests cover ISO, non-ISO and invalid date strings, and no signal output
     depends on locale-specific parsing.

4. **Decide the fate of the unused `score`** (P0-9)
   - Intelligence: either surface `Analysis.score` in the workbench with a precise label or
     remove it from `types.ts`/`engine.ts`; document the decision in `plan/decisions.md`.
   - Human: choose whether an aggregate number is compatible with "no verdicts".
   - **Done when:** `grep -R "score" src` has no orphaned field, and the decision row is appended.

5. **Close the evidence-list truncation gap** (P0-8)
   - Intelligence: document at `src/lib/engine.ts:109,132,203,222` that IDs are capped, or
     compute `excluded` from the same capped set used for `cleanAverage`; add a test.
   - Human: none.
   - **Done when:** the workbench figure for "Adjusted" can be reproduced from the exported
     report without an unstated cap.

6. **Add import formats the brief already promises** (P1-1)
   - Intelligence: add CSV and JSON paste/upload parsing into `reviewsFromText`'s model,
     with tests; keep everything client-side.
   - Human: confirm which formats early testers actually have.
   - **Done when:** a CSV/JSON sample loads into `/workbench` and produces the same analysis
     as the equivalent pasted text.

## 2. Midterm — milestones and exit criteria

### M1 — Real-world validation (P1-2, M1-1, M1-2)
- **Intelligence:** build an eval harness with a properly licensed labelled dataset;
  report per-signal precision/recall with confidence intervals; keep the no-verdict rule.
- **Human:** find a dataset with a usable licence, get permission to use it, recruit at
  least 10 consenting testers and obtain explicit consent for any feedback quoted.
- **Exit criteria:** one licensed dataset in version control or referenced by a stable URL;
  a committed eval report with per-signal counts; zero quoted testimonials without written consent.

### M2 — Product and team proof (M1-3, M1-4, M2-1)
- **Intelligence:** decide and implement (or explicitly reject) marketplace importers,
  saved reports and auth; record a short deterministic demo; publish measured figures only
  after M1 passes.
- **Human:** legal review of marketplace ToS; decide whether account data is acceptable;
  record and approve the demo; recommend it to trusted friends.
- **Exit criteria:** a written go/no-go for each of importers and auth; a demo recording
  that matches current code; at least 5 completed tester sessions with feedback logged.

### M3 — GTM proof (M2-2, M2-3)
- **Intelligence:** implement the chosen pricing/checkout path and hosting target; add
  privacy-preserving aggregate analytics only if consented.
- **Human:** set price, handle tax/VAT obligations, approve public copy, choose the host.
- **Exit criteria:** a live paid or explicitly free offering with a documented price;
  20 paying users or a signed free-funding decision; no unresolved legal item.

## 3. Long term — the product awaiting

**Shape:** a local-first shopping-intelligence tool with an optional, strictly opt-in
cloud layer for saved reports and cross-device sync. The core promise — paste reviews,
get an auditable evidence ledger with no verdict, no telemetry and no account required —
must survive in the free tier. A hosted paid tier may add importers, history and sync,
but must not silently move user review text to a server.

**Deployment posture:** static export as the base (GitHub Pages, Cloudflare Pages or
self-hosted nginx), with any server capability isolated behind explicit user consent and
a separate origin. On-prem/air-gapped distribution remains possible because the engine
is pure TypeScript with no runtime services.

**Business model (proposal, not a decision):** free browser tool for trust and adoption;
paid cloud sync/importer tier or one-off report licensing for researchers. Proprietary
licence retained; source published for inspection.

**Quantitative exit criteria (targets, not measurements):**
- 1,000 monthly active users with zero server-side review text stored by default.
- 100 paying users or a signed alternative funding decision.
- p95 analysis under 2 s at 1,000 reviews on a mid-range laptop.
- At least 10 real-user sessions before publishing any accuracy figure.
- Zero confirmed privacy incidents and zero unlabelled illustrative claims on public pages.

- **Intelligence:** maintain eval, performance and dependency hygiene; keep CI green;
  ship opt-in cloud features behind a clear boundary.
- **Human:** funding/pricing decision, legal review, partner or marketplace meetings,
  brand/trademark, and final approval of every public claim.

## Expansion — alternatives by job

Each row gives an alternative to the current choice, a watch-out, and remains subject to
the selection rule at the end. Current choices are from verified files, not assumptions:
GitHub Pages + Actions + `next/font/google` (`.github/workflows/deploy.yml`, `next.config.ts`).

| Job | Current | Alternative(s) | Watch-out |
|---|---|---|---|
| Static hosting | GitHub Pages | Cloudflare Pages, Netlify, Vercel, R2 + Workers | `basePath: /pangaea` (`next.config.ts:5`) must be preserved or links break; SPA fallback for `/workbench`. |
| Server DB / vector | none | Supabase Postgres + pgvector, Neon, Turso, local SQLite | Any server breaks "zero network calls"; keep it opt-in and separate. |
| Auth | none | Supabase Auth, Clerk, Auth0, passkeys, local-only | Adds PII and keys; recovered auth work exists in a separate local copy and is not merged. |
| Storage / CDN | none (static assets) | Supabase Storage, Cloudflare R2, S3 | Uploading review text reverses the privacy promise. |
| Edge functions | none | Cloudflare Workers, Vercel Edge, Supabase Edge Functions | Cold starts and vendor-specific key handling; no keys in the browser bundle. |
| Observability | none | Sentry, Axiom, self-hosted Grafana | Runtime telemetry contradicts "no data collection"; use anonymous aggregates only after consent. |
| Product analytics | none | Plausible, Umami (self-hosted), PostHog | Cookies/PII and consent banners; self-hosted Umami is the boring default if needed. |
| AI / eval | deterministic engine, local eval harness | Ollama (local), OpenAI/Anthropic APIs | Sending reviews to a third party breaks the promise; API keys must never ship client-side. |
| Payments | none | Stripe, Lemon Squeezy, Ko-fi | Tax/VAT, chargebacks, account data; choose after the pricing decision. |
| Email | none | Buttondown, Resend, Postmark | No email is collected today; requires explicit consent and a privacy notice update. |
| Docs | in-repo Markdown + `plan/` | Docusaurus, Mintlify, GitHub Wiki | Append-only logs must stay in-repo; generated docs must not overwrite them. |
| Feature flags | build-time config | Unleash, Statsig, LaunchDarkly | Runtime flags require a network call; build-time env is the boring option. |
| On-prem packaging | static export | nginx + Docker, Tauri/Electron wrapper | Font fetching at build time and `basePath` asset paths need an offline check. |
| CI / supply chain | GitHub Actions + `npm ci` | Dependabot, SHA-pinned actions, Sigstore | Keep `npm ci`; never reintroduce `npm install` in CI; pin action versions. |

**Selection rule:** choose the cheapest boring option that preserves the product's core
promise — local-first processing, no verdicts, no runtime network calls for user data,
and no keys or PII in the browser build. If an alternative violates one of those, it is
rejected unless the user explicitly changes the promise in `plan/decisions.md`.
