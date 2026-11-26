# PANGAEA — progress log (append-only)

Never rewrite an earlier entry. New sessions append at the bottom. Every entry records
exact changes, exact commands and results, and open items mapped to backlog IDs.

## 2026-11-25 — S1: Phase 1 inspection (research only, read-only)

**Changed:** nothing. No file was written, no git repo created, no push performed.

**Commands and results (exact):**
- `Get-ChildItem -Force` → `.github`, `.next`, `node_modules`, `public`, `src`,
  `.gitignore`, `next-env.d.ts`, `next.config.ts`, `package.json`, `postcss.config.js`,
  `README.md`, `tailwind.config.ts`, `tsconfig.json`, `PANGAEA-RECOVERY.md`. No `out/`
  at start, no `plan/`, no `package-lock.json`, no `LICENSE`.
- `git status --short; git rev-parse --is-inside-work-tree` → `fatal: not a git repository`.
- `node --version` → `v24.18.1`. `npm --version` → blocked: `npm.ps1 cannot be loaded
  because running scripts is disabled on this system`. Workaround used: `npm.cmd`.
- `gh auth status` → logged in to github.com as `yermukhamed0777`; token scopes
  `delete_repo, gist, read:org, repo, workflow`.
- `gh repo view yermukhamed0777/pangaea --json name,visibility,url,pushedAt,defaultBranchRef`
  → `PUBLIC`, `main`, pushed 2026-11-23T14:31:57Z.
- `npm.cmd run build` → `✓ Compiled successfully in 3.9s`, TypeScript clean, routes
  `/`, `/workbench`, `/_not-found`; `out/` generated with `/pangaea/` asset paths.
- `npm.cmd run test` → `npm error Missing script: "test"`.
  `npm.cmd run lint` → `npm error Missing script: "lint"`.
- `Invoke-WebRequest https://yermukhamed0777.github.io/pangaea/` → status 200,
  length 48683, body contains `Know what`.
- `Get-FileHash` on both recovery `RESEARCH_BRIEF.md` copies → identical SHA-256
  `D46EFC323013965A0A2ABFD81A9DF349990F8C8F8E03B5AF1AF3A1670C9CD5D3`.
- `node --experimental-strip-types -e "...analyze(demoReviews())..."` → count 20,
  average 4.4, cleanAverage 4.31, excluded 7, score 67, 6 signals in order:
  `timing-burst, text-duplicates, rating-five-heavy, identity-concentration,
  verification-low, text-low-substance` (the 7th check, `rating-text-mismatch`,
  does not fire on the demo data).

**Findings:** no tests/lint/benchmark; no lockfile; dangling `RESEARCH_BRIEF.md`
reference; engine wording said a centred window "ended" on the peak date; landing page
claimed verdicts, five marketplaces, seller verification, price history and named
tester quotes the code does not support; recovery notes exposed paths and credential
locations; O(n²) duplicate scan.

**Open items mapped:** P0-1 … P0-10, P1-1, P1-2, M1-1 … M1-4, M2-1 … M2-3, M3-1, M3-2.

## 2026-11-25 — S2: Phase 2/3 implementation

**Changed (files/surfaces):**
- `package.json`: added `typecheck`, `test`, `bench`, `verify` scripts.
- `tsconfig.json`: `allowImportingTsExtensions: true` so Node-style `.ts` imports pass.
- `tests/engine.test.ts`, `tests/cost.test.ts`: 12 tests; `scripts/bench.ts`: deterministic benchmark.
- `package-lock.json`: generated (`npm.cmd install --package-lock-only`).
- `src/lib/engine.ts:106`: centred-window wording fix.
- `src/app/components/{Hero,Method,Capabilities,Evidence,Voices}.tsx`: illustrative
  labels, removed false capability words and named tester quotes, dropped `4.1×`.
- `RESEARCH_BRIEF.md`: restored from recovery (byte-identical).
- `PANGAEA-RECOVERY.md`: scrubbed.
- `.gitignore`: `out/`, `.env`, `.env.*`, `!.env.example`.
- `.github/workflows/ci.yml`: new; `.github/workflows/deploy.yml`: Node 24 + `npm ci`.
- `LICENSE`, `THIRD_PARTY_NOTICES.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`.
- `README.md`: verified claims, CI badge, plan links, verification and licence sections.
- `plan/{README,strategy,roadmap,backlog,decisions,progress}.md`: created.

**Commands and results (exact, final pass):**
- `npm.cmd run verify` → exit 0. `tsc --noEmit` clean; `node
  --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test`
  → `tests 12 / pass 12 / fail 0` in 143.9874 ms; `npm run bench` →
  `engine bench: 2000 reviews, 10 runs, median 1260.35 ms, 0.8 analyses/s, signals 3`;
  `next build` → compiled in 2.9 s, TypeScript 2.2 s, 3 static routes.
- Earlier in this session, `npm.cmd run verify` at 5,000 reviews / 20 runs →
  `median 8240.58 ms, 0.1 analyses/s`; this is the measured O(n²) finding.
- Two failed intermediate runs were fixed, not hidden: (1) TS5097 on `.ts` import
  extensions → added `allowImportingTsExtensions`; (2) `node --test tests` was treated
  as a module path → removed the directory argument so Node auto-discovers tests.
- `Select-String` on `out/index.html` → `Illustrative mockup` 1, `Illustrative verdict`
  1, `Composite example` 3, `Three passes. Evidence` 1; `Do not buy`, `fake bursts`,
  `4.1×`, and all three former tester names → 0 matches.
- Secrets scan over all non-generated files for `sk-`, `service_role`, private-key
  headers, `password=`, `api_key=`, `FINAL_CREDENTIALS`, `gho_` → `NO SECRET-LIKE
  PATTERNS FOUND`.

**Open items mapped:** P0-2, P0-6, P0-7, P0-8, P0-9, P0-10, P1-1, P1-2, M1-1 … M1-4,
M2-1 … M2-3, M3-1, M3-2. P0-1, P0-3, P0-4 and P0-5 are complete and checked in the backlog.

## 2026-11-25 — S3: Phase 5 push and CI verification

**Changed:** `plan/backlog.md` (P0-2 and P0-10 ticked with evidence), this progress
entry, and `plan/strategy.md` (status snapshot and session table). No source code changed.

**Commands and results (exact):**
- `git init -b main`; `git remote add origin https://github.com/yermukhamed0777/pangaea.git`;
  `git fetch origin main` → new remote branch at `375e6c089b60fe60812fb0aa28f35259f4f96651`.
- `git reset --mixed origin/main` → preserved the working tree and exposed that the
  remote tracked 50+ generated `out/` files.
- `git rm -r --cached out`; `git add -A`; `git commit -m "Add verification harness,
  reconcile public claims, and create plan folder"` → `ad5a773b762baeb27791923db0d069502c703d56`,
  88 files changed, 3074 insertions, 421 deletions.
- `git push origin main` → `375e6c0..ad5a773 main -> main`.
  `git ls-remote origin refs/heads/main` and `git rev-parse HEAD` both returned
  `ad5a773b762baeb27791923db0d069502c703d56`.
- `gh run list --repo yermukhamed0777/pangaea --limit 5 --json ...` → Verify PANGAEA
  run `45626579139` in progress, Pages run `45626579090` queued, both for HEAD `ad5a773`.
- `gh run watch 45626579139 --exit-status --interval 10` → exit 0, `verify in 39s`,
  all steps green (install locked dependencies, tests/typecheck, benchmark, static build).
  Annotation only: GitHub Actions forces Node-20-targeted checkout/setup-node actions to
  run on Node 24; no failure.
- `gh run watch 45626579090 --exit-status` → already completed with `success`.
- `Invoke-WebRequest https://yermukhamed0777.github.io/pangaea/` → status 200,
  length 51358; `Illustrative mockup` 1, `Illustrative verdict` 1, `Composite example`
  3, `Three passes. Evidence` 1, `Do not buy` 0, `M. Artyomova` 0.

**Open items mapped:** P0-6, P0-7, P0-8, P0-9, P1-1, P1-2, M1-1 … M1-4, M2-1 … M2-3,
M3-1, M3-2. P0-2 and P0-10 are now closed. Next action: P0-6 (remove the O(n²) scan).

## 2026-11-26 — S4: engine correctness (P0-6 … P0-9)

**Changed:** `src/lib/engine.ts`, `src/lib/types.ts`, `tests/engine.test.ts`,
`scripts/bench.ts`, `plan/backlog.md`, `plan/decisions.md`, `plan/progress.md`.

**Exact changes:**
- `parseDate` added: strict `YYYY-MM-DD` with optional time suffix, validated via
  `Date.UTC`; no `Date.parse` remains. `reviewsFromText` uses it and keeps rejected
  dates as `null`.
- `duplicatePairs` rewritten: identical gram sets grouped combinatorially,
  prefix filter over document-frequency-ranked 5-grams, length filter, two-pointer
  Jaccard; count + top five pairs + full excluded ID set only, no per-pair array.
- Tightened two-pointer timing window and single-pass author map; numbers unchanged.
- `Analysis.excludedIds` added; `Analysis.score` removed.
- `tests/engine.test.ts`: four new regression tests (ISO/non-ISO dates, reproducible
  adjusted average, exact duplicate pair count, absence of `score`).
- `scripts/bench.ts`: `BENCH_REVIEWS` / `BENCH_RUNS` environment overrides, default 2000/10.

**Commands and results (exact):**
- `npm.cmd test` → `tests 16 / pass 16 / fail 0` in 146.34 ms (final pass).
- `npm.cmd run bench` with `BENCH_REVIEWS=5000`, `BENCH_RUNS=20` →
  `engine bench: 5000 reviews, 20 runs, median 649.97 ms, 1.5 analyses/s, signals 3`.
  Baseline recorded earlier: 8,240.58 ms for the same command.
- `analyze(demoReviews())` → count 20, average 4.4, cleanAverage 4.18, excluded 9,
  excludedIds `d3,d4,d5,d20,d9,d10,d2,d15,d18`; signals unchanged:
  `timing-burst, text-duplicates, rating-five-heavy, identity-concentration,
  verification-low, text-low-substance`; limits 7.

**Open items mapped:** P1-1, P1-2, M1-1 … M1-4, M2-1 … M2-3, M3-1, M3-2.
P0-6, P0-7, P0-8 and P0-9 are closed. Next action: P1-1 (CSV/JSON import).

## 2026-11-26 — S5: CSV/JSON import (P1-1)

**Changed:** `src/lib/imports.ts` (new), `src/app/workbench/page.tsx`,
`tests/imports.test.ts` (new), `plan/backlog.md`, `plan/progress.md`.

**Exact changes:** `parseReviews` detects pipe/CSV/JSON/plain text; CSV supports an
optional header and quoted commas/quotes/newlines; JSON accepts an array or a
`reviews` wrapper and reports parse/shape errors without throwing. Workbench gains a
local file input (`.csv`, `.json`, `.txt`), a live format label and an error alert.

**Commands and results (exact):**
- `npm.cmd run typecheck` → exit 0, no output.
- `npm.cmd test` → `tests 22 / pass 22 / fail 0` in 154.02 ms.
- Two initially failing tests were fixed, not hidden: the first comparison wrongly
  included `verified` (pipe format has no such column); the parser used an extensionless
  runtime import, which Node's native TS loader rejected — changed to `./engine.ts`.

**Open items mapped:** P1-2, M1-1 … M1-4, M2-1 … M2-3, M3-1, M3-2.
P1-1 is closed. Next action: P1-2 (local eval harness).

## 2026-11-26 — S6: local eval harness (P1-2)

**Changed:** `tests/fixtures/eval-cases.ts` (new, synthetic), `scripts/eval.ts` (new),
`tests/eval.test.ts` (new), `package.json` (`eval` script, `verify` includes eval),
`plan/backlog.md`, `plan/progress.md`.

**Exact changes:** eight labelled synthetic cases cover empty input, five-star skew,
author concentration, timing burst, unverified cluster, low substance, rating/text
mismatch and duplicate text. `npm run eval` prints a per-signal tp/fp/fn table and
sets a non-zero exit code on any mismatch. No real data or third-party licence is involved.

**Commands and results (exact):**
- `npm.cmd run eval` → `eval: 8 synthetic cases, 0 mismatches`; every case PASS;
  per-signal counts: identity-concentration 1/0/0, rating-five-heavy 1/0/0,
  rating-text-mismatch 1/0/0, text-duplicates 2/0/0, text-low-substance 1/0/0,
  timing-burst 1/0/0, verification-low 1/0/0 (tp/fp/fn).
- `npm.cmd test` → `tests 31 / pass 31 / fail 0` in 171.84 ms.
- One fixture initially failed (timing burst): eight reviews inside seven days gave
  `expected = peak`, so the ratio could not exceed 2.2. Moved one review to a later
  month to widen the span; the case now passes without changing engine thresholds.

**Open items mapped:** M1-1 … M1-4, M2-1 … M2-3, M3-1, M3-2.
P1-2 is closed. Note: M1-1 (licensed real dataset) and M1-2 (consented users) remain
human-only; this harness is not real-world validation.

## 2026-11-26 — S7: verification matrix (V1 … V7)

**Changed:** `package.json` (+ lint/build-variant/offline/e2e/event/walkthrough scripts,
`verify` now runs everything; + dev dependencies), `eslint.config.mjs` (new),
`next.config.ts` (`PANGAEA_BASE_PATH`), `.github/workflows/ci.yml` (full suite),
`.github/workflows/deploy.yml` (`workflow_run` gate on green CI), `.gitignore`
(`.build-check/`), `src/lib/events.ts` (new), `src/lib/sample.ts` (`demoOffers`),
`src/app/workbench/page.tsx` (event emits), `scripts/check-build-variants.ts`,
`scripts/check-offline.ts`, `scripts/e2e.ts`, `scripts/check-events.ts`,
`scripts/walkthrough.ts`, `tests/events.test.ts`, `docs/walkthrough/{report.json,SCENES.md}`,
`plan/backlog.md`, `plan/decisions.md`, `plan/progress.md`.

**Commands and results (exact):**
- `npm.cmd ci --no-audit --no-fund` → `added 201 packages in 19s`; one non-fatal
  npm `allow-scripts` warning for `sharp` (install script not approved; unused by
  static export because images are unoptimized).
- Final `npm.cmd run verify` → typecheck clean; `eslint . --max-warnings 0` clean;
  `tests 33 / pass 33 / fail 0`; `eval: 8 synthetic cases, 0 mismatches`;
  `PASS events: 5 allowlisted names, 6 counts, 0 content fields`;
  `engine bench: 2000 reviews, 10 runs, median 122.34 ms, 8.2 analyses/s, signals 3`;
  build → 3 static routes (`/`, `/workbench`, `/_not-found`);
  `offline: scanned 18 source files, 4 HTML files, 0 external refs`;
  `PASS build-variants: root` and `PASS build-variants: subpath`, `2/2 variants verified`;
  `PASS e2e` ×5 (landing, ledger, export, CSV import, zero external requests);
  `walkthrough: wrote report.json and SCENES.md (20 reviews, 6 signals, 3 offers)`.
- `npm.cmd run walkthrough` twice → `report.json` SHA-256 prefix `0157E5711C054A17`
  and `SCENES.md` prefix `D96084B084CFBB38` identical on both runs.
- Earlier `npm.cmd run verify` at clean install: tests 33/33 in 174.23 ms, bench
  median 131.83 ms. Earlier 5,000/20 benchmark: 649.97 ms.
- Three intermediate failures were fixed, not hidden: (1) `check-build-variants`
  needed `shell: true` to spawn `npm.cmd` on Windows; (2) e2e strict-mode matched
  two "Open workbench" links, so `.first()` was used; (3) e2e CSV assertion raced
  the React state update, so it now waits for the format label before asserting.

**Open items mapped:** M1-1 … M1-4, M2-1 … M2-3, M3-1, M3-2.
V1…V7 are closed. Next action: CV-ready copy/docs and agent-decidable product
decisions (M1-3, M1-4, M2-2, M2-3, M3-1).
