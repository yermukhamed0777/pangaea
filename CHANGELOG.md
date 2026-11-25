# Changelog

All notable changes are recorded here. Dates are in UTC where known; otherwise the
local date is used. The first entry records the baseline state and this session's
changes; earlier history was not available locally and is not invented.

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
