# PANGAEA

[![Verify PANGAEA](https://github.com/yermukhamed0777/pangaea/actions/workflows/ci.yml/badge.svg)](https://github.com/yermukhamed0777/pangaea/actions/workflows/ci.yml)

**Know what you're buying.** An evidence-first shopping-intelligence prototype — not a
marketing site, and not a verdict engine.

Live (verified reachable 2026-11-25, HTTP 200): https://yermukhamed0777.github.io/pangaea/

## What actually works

- **Forensics workbench** (`/workbench`) — paste reviews, get an evidence ledger.
  Seven deterministic checks are implemented in `src/lib/engine.ts:84`: timing bursts,
  near-duplicate text, five-star skew, author concentration, missing verification,
  low-substance text, and rating/text mismatch. The synthetic demo dataset currently
  fires six of the seven (`src/lib/sample.ts:9`).
- **Every signal shows the benign explanation beside the concerning one**
  (`src/lib/engine.ts:106-108`). The tool never says a review is fake or real. The
  reasoning is in [`RESEARCH_BRIEF.md`](RESEARCH_BRIEF.md).
- **Adjusted average** with the excluded review IDs visible; it is an estimate, not a
  truth score (`src/lib/engine.ts:226-233`).
- **Landed-cost calculator** — price, units, shipping, duty and VAT across three
  user-entered offers, sorted by cost per unit (`src/lib/cost.ts:15`).
- **Export report** — downloadable JSON with the full analysis and methodology
  (`src/app/workbench/page.tsx:38`).
- **Zero network calls, zero accounts, zero API keys** in the browser build.
  Everything runs locally.

What is **not** implemented: sign-in, saved reports, marketplace importers, price
history, seller verification, real customer data, theme-level sentiment summaries,
and cross-shop product matching. Landing-page mockups, prototype figures and sample
quotes are labelled illustrative; they are not engine output or verified testimonials.

## Run locally

Node 24 is used in CI (Next.js 16 requires Node 20.9+). On Windows PowerShell, use
`npm.cmd` if `npm.ps1` is blocked by execution policy.

```
npm ci
npm run dev
```

Open `http://localhost:3000/pangaea/workbench`.

`npm run build` produces a static `out/` export, served under `/pangaea/` because
`next.config.ts:5` sets `basePath`. GitHub Pages uses that path automatically. `out/`
is generated and ignored by git.

## Verify

```
npm run verify     # typecheck -> 12 tests -> benchmark -> static build
```

Individual scripts: `npm run typecheck`, `npm test`, `npm run bench`, `npm run build`.
The benchmark reports numbers without a pass/fail threshold. Measured on this machine
(2026-11-25): 5,000 reviews / 20 runs had a median of 8,240.58 ms; the duplicate scan
is O(n²) and is tracked in `plan/backlog.md` as P0-6. The committed benchmark uses
2,000 reviews / 10 runs to keep CI practical.

## Structure

| Path | Purpose |
|---|---|
| `src/lib/engine.ts` | Analysis engine — pure functions, no dependencies |
| `src/lib/cost.ts` | Landed-cost math |
| `src/lib/sample.ts` | Clearly synthetic demo dataset for testing |
| `src/lib/types.ts` | Shared types |
| `src/app/workbench/page.tsx` | The workbench UI |
| `src/app/components/` | Landing page sections |
| `tests/`, `scripts/bench.ts` | Node-native tests and deterministic benchmark |
| `.github/workflows/ci.yml` | Tests -> benchmark -> build on push/PR |
| `.github/workflows/deploy.yml` | Pages build + deploy on push to `main` |
| `plan/` | Strategy, roadmap, backlog, append-only logs and update convention |

## Planning and governance

Start at [`plan/README.md`](plan/README.md) for the index and the binding update
convention. Also see [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SECURITY.md`](SECURITY.md).

## Licence

Proprietary. Source is published for inspection; no licence to copy, modify or
redistribute is granted. See [`LICENSE`](LICENSE) and
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
