# PANGAEA — backlog

Ordered, executable tasks. Every item has a stable ID, a file:line anchor (as of
2026-11-25) and a checkable **Done when**. Status is recorded in `plan/progress.md`;
append-only decisions in `plan/decisions.md`.

## Horizon map

| Horizon | IDs | Meaning |
|---|---|---|
| Short term (P0) | P0-1 … P0-10 | Do now, before any external validation. |
| Short term (P1) | P1-1, P1-2 | Do next, still assistant-executable. |
| Midterm (M1, M2) | M1-1 … M1-4, M2-1 … M2-3 | Needs human permission, data or legal review. |
| Long term (M3+) | M3-1, M3-2 | Product shape and business milestones. |
| Verification & finish (V) | V1 … V7 | Agent-executable verification and CV/handoff artefacts. |
| Final freeze (F) | F-01 … F-04 | Algorithm validation, benchmark, hosting reconciliation, release docs. |

## P0 — now

- [x] **P0-1 — Add a real test suite.** Refs: `package.json:5-13`, `tests/engine.test.ts`,
  `tests/cost.test.ts`. Added 12 tests with Node's built-in runner; no new dependency.
  **Done when:** `npm test` reports 12/12 pass. Verified 2026-11-25.

- [x] **P0-2 — Confirm CI on the pushed commit.** Refs: `.github/workflows/ci.yml`,
  `.github/workflows/deploy.yml:21-26`. Verified: local and remote HEAD both
  `ad5a773b762baeb27791923db0d069502c703d56`; `gh run watch 45626579139 --exit-status`
  → success in 39 s; deploy run `45626579090` → success.
  **Done when:** CI run for the pushed SHA is green and both SHAs are recorded in
  `plan/progress.md`. Verified 2026-11-25.

- [x] **P0-3 — Fix misleading timing observation.** Ref: `src/lib/engine.ts:106`.
  "7-day window ending" became "within 7 days of" because the window is centred on
  the peak date. **Done when:** test `timing observation describes the window as centred`
  passes. Verified 2026-11-25.

- [x] **P0-4 — Restore the referenced research brief.** Refs: `README.md:13`,
  `src/lib/engine.ts:8`. `RESEARCH_BRIEF.md` was referenced but absent; restored from the
  existing recovery copy, hash `D46EFC323013965A0A2ABFD81A9DF349990F8C8F8E03B5AF1AF3A1670C9CD5D3`.
  **Done when:** file exists and both references resolve. Verified 2026-11-25.

- [x] **P0-5 — Reconcile landing-page claims with code.** Refs: `Hero.tsx:41-51,162,180-189`,
  `Method.tsx:36`, `Capabilities.tsx:37,81,85`, `Evidence.tsx:5-10`, `Voices.tsx:5-21`.
  Mockups and figures labelled illustrative; named quotes replaced; false capability
  words removed; `4.1×` metric dropped. **Done when:** no unnamed source claims a
  verdict, marketplace importer, seller verification or price history. Verified by
  editing and typecheck/build; visual review still pending (see P0-10).

- [x] **P0-6 — Remove the O(n²) duplicate scan.** Ref: `src/lib/engine.ts` `duplicatePairs`.
  Replaced the all-pairs array with combinatorial grouping of identical gram sets,
  document-frequency prefix filtering and a two-pointer Jaccard check; only the count,
  top-five pairs and excluded IDs are retained. **Done when:** 5k/20-run median below
  1,000 ms and the demo signal list/IDs unchanged. Measured 649.97 ms; 16/16 tests pass.
  Verified 2026-11-26.

- [x] **P0-7 — Make date handling deterministic.** Refs: `parseDate` in `src/lib/engine.ts`.
  ISO dates only (time suffix ignored), validated with `Date.UTC`; `reviewsFromText`
  and the engine share the parser. **Done when:** tests cover ISO, non-ISO and invalid
  dates; output is locale-independent. Verified 2026-11-26.

- [x] **P0-8 — Resolve truncated evidence used by the adjusted average.** Refs:
  `src/lib/engine.ts` flagged/excluded block. `excludedIds` now carries every removed
  review ID; display IDs remain capped and the cap is stated in `limits`.
  **Done when:** the exported report can reproduce "Adjusted" without an undocumented
  cap. Test recomputes 4.18 from the demo IDs. Verified 2026-11-26.

- [x] **P0-9 — Decide the orphaned `score` field.** Refs: `src/lib/types.ts`,
  `src/lib/engine.ts`. Removed from `Analysis` and the engine; test asserts no `score`
  key. Decision appended to `plan/decisions.md`. Verified 2026-11-26.

- [x] **P0-10 — Re-verify the published page after push.** Ref: `.github/workflows/deploy.yml`.
  After deploy run `45626579090`, a fresh Pages request returned HTTP 200, length 51358,
  with `Illustrative mockup` 1, `Illustrative verdict` 1, `Composite example` 3,
  `Three passes. Evidence` 1, and `Do not buy` / `M. Artyomova` 0 matches.
  **Done when:** a fresh Pages request contains the illustrative labels and no old
  testimonial names. Verified 2026-11-25.

## P1 — next

- [x] **P1-1 — Add CSV/JSON import.** Refs: `src/lib/imports.ts`,
  `src/app/workbench/page.tsx`. `parseReviews` accepts pipe, CSV (with optional
  header/RFC-4180 quoting), JSON (array or `{reviews:[...]}`) and plain text;
  the workbench has a local file picker, format label and parse-error display.
  **Done when:** CSV/JSON samples match equivalent pipe input with tests.
  22/22 tests pass. Verified 2026-11-26.

- [x] **P1-2 — Build a local eval harness.** Refs: `tests/fixtures/eval-cases.ts`,
  `scripts/eval.ts`, `tests/eval.test.ts`. Eight hand-written SYNTHETIC cases (no
  third-party licence) with expected signal keys; `npm run eval` prints per-signal
  TP/FP/FN counts and fails on any mismatch. This is threshold regression, not
  real-world validation (M1-1 remains a human gate).
  **Done when:** a command reports per-signal counts on a committed fixture.
  Verified 2026-11-26: 8 cases, 0 mismatches.

## V — verification matrix and finish

- [x] **V1 — Lint with warnings denied.** Refs: `eslint.config.mjs`, `package.json`.
  ESLint 10 flat config with `typescript-eslint`; `npm run lint` uses
  `--max-warnings 0`. **Done when:** lint exits 0 with no warnings. Verified 2026-11-26.

- [x] **V2 — Offline/privacy check.** Ref: `scripts/check-offline.ts`. Scans authored
  source for runtime network primitives and built HTML for external asset hosts.
  **Done when:** 18 source files / 4 HTML files, 0 violations, 0 external refs.
  Verified 2026-11-26.

- [x] **V3 — Both deployment variants.** Refs: `next.config.ts`,
  `scripts/check-build-variants.ts`. `PANGAEA_BASE_PATH` selects `/` or `/pangaea`;
  the script builds both and asserts asset prefixes. **Done when:** 2/2 variants
  verified. Verified 2026-11-26.

- [x] **V4 — Browser e2e.** Ref: `scripts/e2e.ts` (`playwright-core`, local Chrome).
  Serves the static export, drives landing → workbench → demo → export → CSV import
  and asserts zero external requests. **Done when:** 5 checks pass. Verified 2026-11-26.

- [x] **V5 — Content-free event harness.** Refs: `src/lib/events.ts`,
  `scripts/check-events.ts`, `tests/events.test.ts`. Allowlisted names + counts only,
  no user text, no transmission; hostile payloads are rejected. **Done when:**
  automated check passes with 0 content fields. Verified 2026-11-26.

- [x] **V6 — Deterministic walkthrough fixtures.** Refs: `scripts/walkthrough.ts`,
  `docs/walkthrough/report.json`, `docs/walkthrough/SCENES.md`. No clock/randomness;
  regenerated byte-identically. **Done when:** command writes both files and rerun
  produces identical bytes. Verified 2026-11-26.

- [x] **V7 — CI full suite and gated deployment.** Refs: `.github/workflows/ci.yml`,
  `.github/workflows/deploy.yml`. CI runs `npm run verify` (all checks above); Pages
  triggers on `workflow_run` only when CI succeeds, checking out the verified SHA.
  **Done when:** local full suite green and workflow gating present. Verified locally
  2026-11-26; remote run IDs are recorded only after a confirmed push.

## F — final algorithm validation and freeze

- [x] **F-01 — Reproduce the release verification.** Refs: `npm run verify`.
  **Done when:** typecheck, lint, 42 tests, eval, event check, benchmark, build,
  offline check, both build variants, browser e2e and walkthrough all pass.
  Verified 2026-11-26.

- [x] **F-02 — Expand validation coverage where necessary.** Ref:
  `tests/validation-coverage.test.ts`. Nine cases cover genuine bursts,
  legitimate repeated terminology, tiny/imbalanced data, duplicated/malformed
  imports, missing verification metadata, multilingual input, bad dates/ratings,
  cost edge cases and the `excludedIds` adjusted-average identity.
  **Done when:** all targeted tests pass and every signal keeps benign/concern.
  Verified 2026-11-26.

- [x] **F-03 — Publish runtime and memory evidence.** Refs:
  `scripts/bench-fixtures.ts`, `scripts/bench-memory.ts`, `docs/benchmark/`.
  **Done when:** hardware, sizes, repetitions, methodology and measured results
  are written to a deterministic fixture and versioned report. Verified.

- [x] **F-04 — Reconcile hosting and freeze documentation.** Refs:
  `docs/RELEASE.md`, `docs/ALGORITHM.md`, `docs/DEMO.md`, `README.md`.
  Canonical URL is the Pages subpath; the Vercel production deployment is kept.
  Browser e2e passes on both, with no transmitted review text.
  **Done when:** both hosts verified and no product feature added. Verified.

## M1 — validation (human gates)

- [ ] **M1-1 — Obtain a licensed real dataset.** Ref: `RESEARCH_BRIEF.md:56`.
  Human: licence/source permission. **Done when:** licence text or source URL is recorded
  in `plan/decisions.md` and the fixture is referenced by P1-2.

- [ ] **M1-2 — Run consented user sessions.** Ref: `Voices.tsx` (quotes now illustrative).
  Human: recruit, consent, approve any quote. **Done when:** at least 10 sessions logged
  with written consent for anything published.

- [x] **M1-3 — Settle marketplace importers.** Ref: `plan/decisions.md` 2026-11-26.
  Default **no-go**: no permitted data access or legal review. A human with legal
  authority may supersede this with a new decision row.
  **Done when:** go/no-go row appended to `plan/decisions.md`. Verified 2026-11-26.

- [x] **M1-4 — Settle the recovered Supabase work.** Refs: `plan/decisions.md`,
  `plan/cloud-boundary.md`, `README.md`. Default **do not merge**: the separate
  local copy with auth/saved reports stays outside this repo; an opt-in tier is
  bounded in `plan/cloud-boundary.md`. A human may supersede this.
  **Done when:** decision row appended and chosen state reflected in `README.md`.
  Verified 2026-11-26.

## M2 — product and GTM proof

- [x] **M2-1 — Reconcile public figures with measured ones.** Refs: `Hero.tsx`,
  `Method.tsx`, `Capabilities.tsx`, `Evidence.tsx`, `Voices.tsx`. Claim drift removed
  (themes, automatic cross-shop matching, listing/timestamp lookups); remaining
  figures are labelled illustrative or backed by `npm run walkthrough`.
  **Done when:** every public number has a recorded command or an explicit
  illustrative label. Verified 2026-11-26.

- [x] **M2-2 — Decide pricing and payments.** Ref: `plan/decisions.md` 2026-11-26.
  Default: free prototype, no checkout. A human owner of price/tax may supersede.
  **Done when:** decision recorded in `plan/decisions.md`. Verified 2026-11-26.

- [x] **M2-3 — Choose hosting beyond Pages.** Ref: `plan/decisions.md` 2026-11-26.
  GitHub Pages retained; root-path build also verified for an easy static-host switch.
  **Done when:** host recorded in `plan/decisions.md`. Verified 2026-11-26.

## M3+ — long term

- [x] **M3-1 — Define the opt-in cloud tier.** Ref: `plan/cloud-boundary.md`. Written
  boundary with six rules, a default-state description and explicitly rejected
  features. **Done when:** written boundary with architecture notes exists.
  Verified 2026-11-26.

- [ ] **M3-2 — Reach the quantitative exit criteria.** Ref: `plan/roadmap.md` section 3.
  **Done when:** all five targets are measured and recorded, or explicitly retired in
  `plan/decisions.md`.
