# PANGAEA v1.0.0 — frozen release record

Date: 2026-11-26. Status: **frozen** — no product features added after this
validation pass. The reviewed prior state was `129f4ed` (final audit) with
deployment evidence at `42a2a00` (CI and gated Pages run IDs). This document
records the validation layer added on top of that state.

## What is frozen

- Seven deterministic review checks, always paired with a benign explanation.
- Reproducible exclusions (`excludedIds`) and adjusted average.
- Landed-cost calculator with user-supplied rates.
- Local pipe/CSV/JSON/plain-text import and JSON report export.
- Content-free in-memory event counters; no accounts, telemetry or keys.
- Static export with root (`/`) and subpath (`/pangaea`) build variants.

Explicitly not added: marketplaces, scraping, accounts, subscriptions, AI
classifiers, seller databases or any network service.

## Verification results (commands actually run)

| Command | Exact result |
|---|---|
| `npm run verify` | exit 0; typecheck clean; `eslint --max-warnings 0` clean; **42 tests, 42 pass, 0 fail**; `eval: 8 synthetic cases, 0 mismatches`; `PASS events: 5 allowlisted names, 6 counts, 0 content fields`; `engine bench: 2000 reviews, 10 runs, median 132.39 ms` (earlier reproduction
116.89 ms; both measured on this machine); build with 3 static routes; `offline: scanned 18 source files, 4 HTML files, 0 external refs`; `build-variants: 2/2 verified`; 6 browser checks PASS; walkthrough fixtures written |
| `npm run bench:memory` | AMD Ryzen 9 8940HX, 32 logical cores, 31.2 GiB RAM, win32 x64, Node v24.18.1; 5 runs + 2 warm-ups per size; medians 19.84 ms (500), 50.29 ms (1,000), 138.52 ms (2,000), 619.59 ms (5,000), 2,871.40 ms (10,000), 14,458.24 ms (20,000); peak RSS 78–344 MiB. Full table: `docs/benchmark/BENCHMARK.md`, raw data `docs/benchmark/results.json` |
| `npm run test:e2e` (local export) | 6/6 checks, including zero external requests and no transmitted review text |
| `E2E_BASE_URL=https://yermukhamed0777.github.io npm run test:e2e` | 6/6 checks on the canonical Pages URL |
| `E2E_BASE_URL=https://pangaea-gules.vercel.app npm run test:e2e` | 6/6 checks on the Vercel production URL |
| `node scripts/compile-*` / `npm run walkthrough` | deterministic fixtures; two runs produced identical SHA-256 values |

Benchmark methodology, hardware and the deliberate worst-case duplicate
fixture are documented in `docs/benchmark/BENCHMARK.md` and
`docs/ALGORITHM.md`.

## Hosting reconciliation

| Host | URL | Result |
|---|---|---|
| GitHub Pages (canonical) | `https://yermukhamed0777.github.io/pangaea/` and `/pangaea/workbench` | HTTP 200, `/pangaea/_next/` asset paths, 6/6 browser checks |
| Vercel production (alternative, retained) | `https://pangaea-gules.vercel.app/pangaea` and `/pangaea/workbench` | HTTP 200 after redirect, same asset prefix, 6/6 browser checks; bare `/` is 404 by design |

**Canonical demonstration URL:** `https://yermukhamed0777.github.io/pangaea/`.
It is the documented release path with a project root and stable subpath.
The Vercel production deployment is kept as an alternative and was not
deleted or reconfigured. Neither host receives review text; the browser check
asserts zero external requests and inspects POST bodies during CSV import.

## Deployment evidence from the reviewed state

- CI run `45752257398` for `129f4ed`: success; gated Pages run `45752366645`:
  success; live page HTTP 200, length 52115; Vercel status success for
  `42a2a00` targeting Vercel project deployment
  `pangaea/2vpfGgQv8h8WDfQYgCsXMHEavWbq` (production domain above).
- Exact commands and results are in `docs/plan/progress.md` S9/S10 and the
  validation entry appended at freeze.

## Release artifacts

| File | Purpose |
|---|---|
| `docs/ALGORITHM.md` | Methodology, thresholds, formulas, limitations |
| `docs/benchmark/BENCHMARK.md`, `results.json` | Reproducible runtime/memory evidence |
| `docs/DEMO.md` | Two-minute demonstration and deterministic capture |
| `docs/walkthrough/` | Fixture transcript, scenes and optional screenshots |
| `plan/pilot-handoff.md` | Human-only seven-day pilot boundary |
| `CHANGELOG.md`, `plan/` | Versioned history, backlog, decisions and progress |

## Freeze boundary

This release is ready for a CV/GitHub portfolio. The only remaining work is
human: recruiting and consenting pilot participants, owner-controlled cloud or
account decisions, and any future product expansion. No usage, user, accuracy
or revenue claim has been measured; all figures above are command outputs.
