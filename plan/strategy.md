# PANGAEA — strategy

Status snapshot (2026-11-25): **stage = prototype / pre-validation**. Local build and
verification pass; the previously published Pages site was reachable (HTTP 200) but
still serves the pre-change build. Measured benchmark: **8,240.58 ms** median for
5,000 reviews / 20 runs (O(n²) duplicate scan). Tests: **12/12 pass**. Next action:
push the verified commit and confirm CI, then close P0-6.

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
| Tests passing | 12/12 | `npm test` |
| Typecheck | clean | `npm run typecheck` |
| Static routes | `/`, `/workbench`, `/_not-found` | `npm run build` |
| Demo signals fired | 6 of 7 possible | `analyze(demoReviews())` |
| Demo average / adjusted | 4.4 / 4.31 | `analyze(demoReviews())` |
| Engine benchmark | 8,240.58 ms median, 5,000 reviews, 20 runs | `scripts/bench.ts` |
| Published site | HTTP 200 | `Invoke-WebRequest` to Pages URL |

Proposed targets (**not measured — decisions, not facts**): p95 under 2 s for 1,000
reviews; at least 10 consenting user sessions before publishing any real number;
zero third-party network requests in the browser build (enforceable by inspection and
a future network-sniffing test).

## Risks

1. **No real-world validation.** Only a hand-written synthetic dataset exists
   (`src/lib/sample.ts:3-8`). Signal thresholds are tuned by intuition, not data.
2. **Performance.** The duplicate scan is O(n²) (`src/lib/engine.ts:115-122`); measured
   8.24 s at 5,000 reviews makes paste-large-review-set use unrealistic.
3. **Claim drift.** Marketing copy previously stated a "trust index", "Do not buy",
   "5 marketplaces", price history and seller verification that the code does not do.
4. **Privacy reversal.** Recovered work in a separate local copy includes Supabase
   auth/saved reports. Merging it would break the zero-account promise unless it is
   opt-in and clearly separated.
5. **Legal.** Marketplace importers carry ToS/scraping risk; no permission has been sought.
6. **Licensing.** Source is public while the licence is proprietary; the footer used to
   say "open tools". This is now explicit in `LICENSE`, but user-facing copy must stay
   consistent.
7. **Supply chain.** No lockfile existed in this working copy until 2026-11-25; CI now
   uses `npm ci` and a generated `package-lock.json`.

## Open questions

- Will PANGAEA stay a free public prototype or become a paid product? (Affects licence,
  hosting and whether auth/sync is ever built.)
- Is the recovered Supabase work to be merged, kept separate, or discarded?
- Which marketplaces, if any, have permitted data access?
- What is the minimum sample size before any measured figure is published?
- Who owns the trademark/brand and who signs off on public claims?

## Session history — exactly what was done

| # | Date | Scope | Exact verification | Result |
|---|---|---|---|---|
| S1 | 2026-11-25 | Phase 1 read-only audit: read `package.json`, `README.md`, `PANGAEA-RECOVERY.md`, all `src/lib/*`, `src/app/**`, CI configs; `Get-ChildItem`, `git status`, `node --version`, `gh auth status`, `gh repo view`, `npm.cmd run build`, `npm.cmd run test`, `npm.cmd run lint`, `Invoke-WebRequest` to Pages URL | `npm.cmd run build` | Build passed; 3 static routes. `test`/`lint` scripts missing (npm error). Repo `yermukhamed0777/pangaea` is PUBLIC. Live URL HTTP 200. |
| S2 | 2026-11-25 | Phase 2/3 implementation: verification harness, engine wording fix, claim reconciliation, scrubbed recovery notes, restored research brief, public-repo scaffolding, CI, and `plan/` | `npm.cmd run verify` | typecheck clean, 12/12 tests pass, benchmark and build pass; see `plan/progress.md` for exact numbers. |
