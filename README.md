# PANGAEA

[![Verify PANGAEA](https://github.com/yermukhamed0777/pangaea/actions/workflows/ci.yml/badge.svg)](https://github.com/yermukhamed0777/pangaea/actions/workflows/ci.yml)

**Know what you're buying.** An evidence-first shopping-intelligence prototype —
not a marketing site, and not a verdict engine.

**Canonical demonstration URL:** https://yermukhamed0777.github.io/pangaea/
(verified 2026-11-26, HTTP 200, length 52115). An alternative Vercel production
deployment is retained at https://pangaea-gules.vercel.app/pangaea — both served
the same build and passed the same six browser checks. See `docs/RELEASE.md`.

> The reviewed release state was `129f4ed`; deployment evidence is at `42a2a00`
> (CI `45752257398`, gated Pages `45752366645`). The final validation layer is
> recorded in `docs/RELEASE.md` and `plan/progress.md`.

## What actually works

- **Forensics workbench** (`/workbench`) — paste reviews, load a CSV/JSON file, or
  use the synthetic demo, then get an evidence ledger. Seven deterministic checks
  are implemented in `src/lib/engine.ts`: timing bursts, near-duplicate text,
  five-star skew, author concentration, missing verification, low-substance text
  and rating/text mismatch. The demo fires six of the seven.
- **Every signal shows the benign explanation beside the concerning one.** The
  tool never says a review is fake or real. The reasoning is in
  [`RESEARCH_BRIEF.md`](RESEARCH_BRIEF.md).
- **Adjusted average with a reproducible exclusion list** — `excludedIds` is
  exported, so the figure can be recomputed from a report. It is an estimate, not
  a truth score.
- **Landed-cost calculator** — price, units, shipping, duty and VAT across three
  user-entered offers, sorted by cost per unit. No external tax lookup and no
  automatic cross-shop matching.
- **Export report** — downloadable JSON with the full analysis, methodology and
  excluded IDs (`src/app/workbench/page.tsx`).
- **Local-only event counts** — five allowlisted event names, no text, no
  transmission (`src/lib/events.ts`).
- **Zero network calls, zero accounts, zero API keys** in the browser build.
  Verified by `npm run check:offline` and a browser check.

Measured on this machine (commands and results in `docs/RELEASE.md`): 42/42
tests pass; 8 synthetic eval cases with 0 mismatches; 6/6 browser checks on
both deployments; 5,000 reviews analysed in 619.59 ms median; runtime/memory
measured from 500 to 20,000 reviews with published methodology.

**Not implemented:** sign-in, saved reports, marketplace importers, price history,
seller verification, theme extraction, real customer data, and cross-shop product
matching. Landing-page mockups, prototype figures and sample quotes are labelled
illustrative; they are not engine output or verified testimonials. No usage,
accuracy or revenue figure has been measured or claimed.

## Run locally

Node 24 is used in CI (Next.js 16 requires Node 20.9+). On Windows PowerShell, use
`npm.cmd` if `npm.ps1` is blocked by execution policy.

```
npm ci
npm run dev
```

Open `http://localhost:3000/pangaea/workbench`.

## Deploy

`npm run build` produces a static `out/` export. The default base path is
`/pangaea` (`next.config.ts`), which GitHub Pages serves automatically.

- `npm run build:subpath` — `/pangaea`, for GitHub Pages.
- `npm run build:root` — `/`, for a root-hosted static server.
- `npm run check:build-variants` — builds both and asserts the asset prefixes.

Serve `out/` as static files; no server runtime is needed. In CI, `.github/workflows/ci.yml`
runs the full suite and `.github/workflows/deploy.yml` deploys to Pages **only**
after that suite is green, checking out the exact verified SHA.

## Backup and restore

There is no server-side user data: review text and offers stay in the browser tab
and are never stored by PANGAEA. To keep a result, use **Export report** and save
the JSON yourself.

To restore the project itself: clone the repository, run `npm ci`, then
`npm run build`. `out/` and `.next/` are generated and ignored by git; never edit
them by hand. `npm run walkthrough` regenerates the deterministic fixtures in
`docs/walkthrough/`.

## Verify

```
npm run verify
```

That single command runs, in CI order: typecheck → lint (warnings denied) →
42 unit tests → 8-case local eval → content-free event check → benchmark →
static build → offline/privacy check → both basePath variants → browser e2e →
deterministic walkthrough fixtures. A failure in any step stops the chain and, in
CI, blocks deployment. The benchmark is report-only (no timing threshold).

Individual scripts: `npm run typecheck`, `npm run lint`, `npm test`, `npm run eval`,
`npm run check:events`, `npm run bench`, `npm run bench:memory`, `npm run build`,
`npm run check:offline`, `npm run check:build-variants`, `npm run test:e2e`,
`npm run walkthrough`. For a video-ready capture, build first and run
`CAPTURE=1 npm run test:e2e`.

The browser e2e uses `playwright-core` with a locally installed Chrome (or Edge).
Set `CHROME_PATH` to override the executable, or set `E2E_BASE_URL` to run the
same six checks against a deployed URL. It asserts zero external requests and
that imported review text is never transmitted.

## Structure

| Path | Purpose |
|---|---|
| `src/lib/engine.ts` | Analysis engine — pure functions, deterministic ISO dates |
| `src/lib/imports.ts` | Pipe/CSV/JSON/plain-text parsing, all client-side |
| `src/lib/cost.ts` | Landed-cost math |
| `src/lib/sample.ts` | Clearly synthetic demo dataset and offers |
| `src/lib/events.ts` | Content-free, non-transmitted event counts |
| `src/app/workbench/page.tsx` | The workbench UI |
| `src/app/components/` | Landing page sections |
| `tests/`, `tests/fixtures/` | Unit tests and the synthetic eval fixture |
| `scripts/` | Benchmark, eval, offline/variant/event checks, e2e, walkthrough |
| `docs/ALGORITHM.md` | Methodology, thresholds, formulas and limitations |
| `docs/RELEASE.md` | Frozen release record, verification and hosting reconciliation |
| `docs/DEMO.md` | Two-minute demonstration and deterministic capture |
| `docs/benchmark/` | Reproducible runtime/memory fixtures, results and report |
| `scripts/bench-fixtures.ts`, `scripts/bench-memory.ts` | Deterministic fixtures and scaling benchmark |
| `docs/walkthrough/` | Deterministic fixtures and capture instructions |
| `.github/workflows/` | Full-suite CI and gated Pages deployment |
| `plan/` | Strategy, roadmap, backlog, decision/progress logs, pilot handoff |

## Planning and governance

Start at [`plan/README.md`](plan/README.md) for the index and the binding update
convention. [`plan/pilot-handoff.md`](plan/pilot-handoff.md) is the exact boundary:
everything up to the human-only pilot is prepared; the pilot itself has not run.
Also see [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SECURITY.md`](SECURITY.md) and
[`plan/cloud-boundary.md`](plan/cloud-boundary.md).

## Licence

Proprietary. Source is published for inspection; no licence to copy, modify or
redistribute is granted. See [`LICENSE`](LICENSE) and
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
