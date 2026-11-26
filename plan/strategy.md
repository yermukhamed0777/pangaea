# PANGAEA — strategy

Status snapshot (2026-11-26): **stage = prototype / pre-validation, published and CI-verified**.
Last pushed HEAD was `75cc131` (CI/deploy verified 2026-11-25); local work since then is
unpushed. The duplicate scan no longer dominates: measured benchmark is **649.97 ms**
median for 5,000 reviews / 20 runs (was 8,240.58 ms), so the P0-6 target is met.
Tests: **33/33 pass**; eval harness **8/8 synthetic cases, 0 mismatches**.
`npm run verify` (typecheck → lint → tests → eval → events → bench → build →
offline → both basePath variants → browser e2e → walkthrough) is green locally.
CI runs the same command; Pages deploys only on a green CI run.
Next action: handoff to the human pilot owner; push is withheld pending
confirmation. Only M1-1, M1-2 and M3-2 remain genuinely human-only.

## Market and thesis

Documented in `RESEARCH_BRIEF.md:1-66` (restored from the existing recovery copy and
verified by hash `D46EFC3…`). Claims there are research notes, not measurements made
in this session:

- Fakespot discontinued July 2025; ReviewMeta frozen since 2022. Both graded reviews
  rather than supporting a decision, with reported false positives and privacy criticism.
- Published fake-review prevalence estimates range from 7% to 42% because "fake" is
  defined inconsistently; a peer-reviewed confounds paper (`arXiv:2110.15130`) says
  detectors overestimate accuracy.
- Thesis: an **evidence ledger** — observations with measured confidence, a benign
  explanation beside every concern, and no verdict — is more defensible than a grade.
- Substance signals (specificity, product detail vs scene-setting, pronoun density,
  extremity, rating/text mismatch) are intended to work on AI-written reviews where
  timing and repetition fingerprints fade. Only some of this is implemented:
  `src/lib/engine.ts:183-224` implements specificity/detail/scene/pronoun/extremity
  and rating/text mismatch; there is no ML model and no theme extraction.

## Users

- **Primary (hypothesised, not yet interviewed):** a careful online shopper in a
  market with cross-border shipping cost surprises, who wants a second opinion on
  reviews before paying.
- **Secondary:** researchers/journalists who want a shareable, auditable report.
- **Not served today:** sellers, marketplaces, or anyone wanting a "fake/real" label.
  The engine deliberately refuses that label (`src/lib/engine.ts:6-8`).

## Positioning

- "Evidence, not verdicts" — the product promise is epistemic humility plus local
  privacy, not accuracy claims.
- Landed-cost math is the concrete, verifiable utility: `src/lib/cost.ts:15-27` computes
  duty on item cost and VAT on item+duty+shipping, with user-supplied rates.
- Positioning risk: the landing page still contains illustrative mockups and prototype
  figures. They were relabelled on 2026-11-25, but any future copy must keep that
  labelling or replace figures with measured ones.

## Metrics

Measured now (commands and results are in `plan/progress.md`):

| Metric | Value | Source |
|---|---|---|
| Tests passing | 33/33 | `npm test` |
| Lint | clean, warnings denied | `npm run lint` |
| Local eval | 8 synthetic cases, 0 mismatches | `npm run eval` |
| Event harness | 5 allowlisted names, 0 content fields | `npm run check:events` |
| Browser e2e | 5 checks pass, 0 external requests | `npm run test:e2e` |
| Benchmark (CI setting) | 113.29 ms median, 2,000 reviews, 10 runs | `npm run bench` |
| Offline | 18 source files, 4 HTML files, 0 external refs | `npm run check:offline` |
| Build variants | 2/2 (`/` and `/pangaea`) | `npm run check:build-variants` |
| Typecheck | clean | `npm run typecheck` |
| Static routes | `/`, `/workbench`, `/_not-found` | `npm run build` |
| Demo signals fired | 6 of 7 possible | `analyze(demoReviews())` |
| Demo average / adjusted | 4.4 / 4.18 (9 excluded IDs) | `analyze(demoReviews())` |
| Engine benchmark | 649.97 ms median, 5,000 reviews, 20 runs | `scripts/bench.ts` |
| Published site | HTTP 200 (as of 2026-11-25) | `Invoke-WebRequest` to Pages URL |

Proposed targets (**not measured — decisions, not facts**): p95 under 2 s for 1,000
reviews; at least 10 consenting user sessions before publishing any real number.
Zero third-party network requests is now enforced by `npm run check:offline` and
the browser request assertion in `npm run test:e2e`, not merely proposed.

## Risks

1. **No real-world validation.** Only a hand-written synthetic dataset exists
   (`src/lib/sample.ts:3-8`). Signal thresholds are tuned by intuition, not data.
2. **Performance (resolved 2026-11-26).** The O(n²) duplicate scan was replaced by
   grouped/prefix-filtered detection; 5,000 reviews now take 649.97 ms median. The
   new algorithm must stay exact — a regression test counts duplicate pairs.
3. **Claim drift (mitigated 2026-11-26).** Old copy claimed a "trust index",
   "Do not buy", "5 marketplaces", price history and seller verification. It was
   reconciled; every remaining number is measured or labelled illustrative. Future
   copy must keep that standard.
4. **Privacy reversal (default recorded).** Recovered Supabase auth/saved reports
   stay in a separate local copy. Merging would break the zero-account promise;
   see `plan/cloud-boundary.md` for the opt-in boundary.
5. **Legal (no-go recorded).** Marketplace importers carry ToS/scraping risk and
   no permission has been sought; re-open only with written permission.
6. **Licensing.** Source is public while the licence is proprietary; the footer used to
   say "open tools". This is now explicit in `LICENSE`, but user-facing copy must stay
   consistent.
7. **Supply chain (mitigated).** No lockfile existed until 2026-11-25; CI now uses
   `npm ci` and a generated `package-lock.json`. npm reports a non-fatal
   `allow-scripts` notice for `sharp`; it is unused by the static export.

## Open questions

- Will PANGAEA stay a free public prototype or become a paid product? Agent default:
  free prototype, no payments; a human owner of price/tax may supersede (M2-2).
- Is the recovered Supabase work to be merged, kept separate, or discarded? Agent
  default: kept separate, no merge (M1-4, `plan/cloud-boundary.md`).
- Which marketplaces, if any, have permitted data access? None; importers are no-go
  until written permission exists (M1-3).
- What is the minimum sample size before any measured figure is published?
- Who owns the trademark/brand and who signs off on public claims?

## Session history — exactly what was done

| # | Date | Scope | Exact verification | Result |
|---|---|---|---|---|
| S1 | 2026-11-25 | Phase 1 read-only audit: read `package.json`, `README.md`, `PANGAEA-RECOVERY.md`, all `src/lib/*`, `src/app/**`, CI configs; `Get-ChildItem`, `git status`, `node --version`, `gh auth status`, `gh repo view`, `npm.cmd run build`, `npm.cmd run test`, `npm.cmd run lint`, `Invoke-WebRequest` to Pages URL | `npm.cmd run build` | Build passed; 3 static routes. `test`/`lint` scripts missing (npm error). Repo `yermukhamed0777/pangaea` is PUBLIC. Live URL HTTP 200. |
| S2 | 2026-11-25 | Phase 2/3 implementation: verification harness, engine wording fix, claim reconciliation, scrubbed recovery notes, restored research brief, public-repo scaffolding, CI, and `plan/` | `npm.cmd run verify` | typecheck clean, 12/12 tests pass, benchmark and build pass; see `plan/progress.md` for exact numbers. |
| S3 | 2026-11-25 | Phase 5 push: untracked generated `out/`, committed `ad5a773`, pushed to existing public repo, closed P0-2/P0-10 in the plan | `git ls-remote`, `gh run watch 45626579139`, `gh run watch 45626579090`, `Invoke-WebRequest` | remote HEAD equals local; CI success in 39 s; Pages success; live page relabelled. |
| S4 | 2026-11-26 | Engine correctness: fast exact duplicate detection, strict dates, reproducible exclusions, removed `score` | `npm.cmd test`, `npm.cmd run bench` at 5,000/20 | 16/16 tests pass; median 649.97 ms; demo signal list unchanged; P0-6…P0-9 closed. |
| S5 | 2026-11-26 | CSV/JSON/plain-text import and local file picker in the workbench | `npm.cmd run typecheck`, `npm.cmd test` | typecheck clean; 22/22 tests pass; P1-1 closed. |
| S6 | 2026-11-26 | Local synthetic eval harness with per-signal counts | `npm.cmd run eval`, `npm.cmd test` | 8 cases / 0 mismatches; 31/31 tests pass; P1-2 closed. Not real-world validation. |
| S7 | 2026-11-26 | Verification matrix: lint, offline check, both basePath builds, browser e2e, content-free events, walkthrough fixtures, CI full suite and gated deploy | `npm.cmd ci`, `npm.cmd run verify` | clean install; 33/33 tests; 8/8 eval; 5/5 e2e; 2/2 build variants; 0 external refs; V1…V7 closed. |
| S8 | 2026-11-26 | CV-ready README/docs, landing-page claim reconciliation, pilot handoff, cloud boundary and agent product defaults | `npm.cmd run verify` | full suite green; only M1-1, M1-2 and M3-2 remain human-only. |
