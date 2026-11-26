# Changelog

All notable changes are recorded here. Dates are in UTC where known; otherwise the
local date is used. The first entry records the baseline state and this session's
changes; earlier history was not available locally and is not invented.

## 2026-11-26 — verification matrix

### Added
- ESLint flat config with `typescript-eslint`; `npm run lint` denies warnings (V1).
- `scripts/check-offline.ts` (V2), `scripts/check-build-variants.ts` for `/` and
  `/pangaea` builds (V3), `scripts/e2e.ts` with local-Chromium browser checks (V4).
- `src/lib/events.ts` content-free event harness and `scripts/check-events.ts` (V5).
- `scripts/walkthrough.ts` deterministic fixtures in `docs/walkthrough/` (V6).
- `npm run verify` runs the whole matrix; CI uses it and Pages deployment is
  gated on a green CI run of the verified SHA (V7).

### Changed
- `next.config.ts`: `PANGAEA_BASE_PATH` selects root or subpath build.
- Workbench emits only allowlisted content-free event counts.
- Dev dependencies: eslint, typescript-eslint, cross-env, playwright-core.

## 2026-11-26 — local eval harness

### Added
- `tests/fixtures/eval-cases.ts`: eight hand-written, clearly synthetic labelled
  cases (no third-party licence) covering every signal family.
- `scripts/eval.ts` / `npm run eval`: per-signal tp/fp/fn counts with a non-zero
  exit code on any mismatch; `npm run verify` now includes it (P1-2).
- `tests/eval.test.ts`: 9 tests, 31/31 total.

This is threshold regression, not real-world validation.

## 2026-11-26 — CSV/JSON import

### Added
- `src/lib/imports.ts`: `parseReviews` accepts pipe, CSV (optional header, quoted
  fields), JSON (array or `reviews` wrapper) and plain text, with parse errors
  returned rather than thrown (P1-1).
- Workbench local file picker, detected-format label and parse-error alert.
- Six import tests (22/22 total); CSV and JSON match equivalent pipe input.

## 2026-11-26 — engine correctness

### Changed
- `src/lib/engine.ts`: near-duplicate detection now groups identical gram sets,
  uses a document-frequency prefix filter and retains only the pair count, the
  five strongest pairs and the full excluded-ID set (P0-6). Median for 5,000
  reviews / 20 runs fell from 8,240.58 ms to 649.97 ms.
- `src/lib/engine.ts`: dates are parsed strictly as ISO (`YYYY-MM-DD`, optional
  time suffix) with `Date.UTC`, removing locale-sensitive `Date.parse` (P0-7).
- `src/lib/engine.ts`: the adjusted average excludes every review behind the
  text/rating signals, and `Analysis.excludedIds` is exported so the figure can
  be reproduced from a report (P0-8). Demo adjusted average is now 4.18.
- `src/lib/types.ts`: removed the unused, unverifiable `score` field (P0-9).

### Added
- Four regression tests (16/16 total): strict date parsing, reproducible
  adjusted average, exact duplicate-pair count, and absence of `score`.
- `BENCH_REVIEWS` / `BENCH_RUNS` environment overrides for `scripts/bench.ts`.

## 2026-11-25 — verification harness, claim reconciliation, planning

### Added
- `tests/engine.test.ts` and `tests/cost.test.ts`: 12 deterministic tests using
  Node's built-in test runner and native TypeScript stripping (no new dependency).
- `scripts/bench.ts`: deterministic engine benchmark, report-only.
- `package.json` scripts: `typecheck`, `test`, `bench`, `verify`; `npm run verify`
  runs all four checks in CI order.
- `package-lock.json` for repeatable installs.
- `.github/workflows/ci.yml`: tests -> benchmark -> static build on push/PR.
- `RESEARCH_BRIEF.md`, restored from the existing recovery copy; it was referenced
  by `README.md` and `src/lib/engine.ts:8` but missing from the project.
- `LICENSE` (proprietary, all rights reserved), `THIRD_PARTY_NOTICES.md`,
  `CONTRIBUTING.md`, `SECURITY.md`, and `plan/` (strategy, roadmap, backlog,
  decisions, progress, README).

### Changed
- `src/lib/engine.ts`: timing-burst observation now says "within 7 days of"
  instead of the inaccurate "7-day window ending" (the window is centred on the
  peak date).
- Landing page copy relabelled as illustrative: hero mockup, prototype figures,
  composite quotes, ticker items and method footnotes. No invented testimonial
  names or locations remain.
- `PANGAEA-RECOVERY.md`: scrubbed of absolute paths, credential locations and
  account-private quoted content.
- `.github/workflows/deploy.yml`: Node 24 and `npm ci` to match verified CI.
- `.gitignore`: ignore `out/` and `.env*` while allowing `.env.example`.

### Measured
- `npm run verify`: typecheck, 12/12 tests, benchmark, and static build all pass.
- `npm run bench` at 5,000 reviews / 20 runs: median 8,240.58 ms (~0.1 analyses/s),
  exposing an O(n²) duplicate scan. CI benchmark reduced to 2,000 reviews / 10 runs
  to keep the job practical; the 5,000-review figure is recorded in the backlog.
