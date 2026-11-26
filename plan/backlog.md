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

- [ ] **P1-1 — Add CSV/JSON import.** Ref: `src/lib/engine.ts:65-82`, `src/app/workbench/page.tsx:99-106`.
  The research brief lists paste or upload; only paste exists.
  **Done when:** a CSV and a JSON sample load into the workbench and match equivalent
  pasted text, with tests.

- [ ] **P1-2 — Build a local eval harness.** Refs: `tests/`, `scripts/bench.ts`,
  `RESEARCH_BRIEF.md:19-33`. No labelled data or per-signal metrics exist.
  **Done when:** a command reports per-signal counts on a committed, licensed fixture.

## M1 — validation (human gates)

- [ ] **M1-1 — Obtain a licensed real dataset.** Ref: `RESEARCH_BRIEF.md:56`.
  Human: licence/source permission. **Done when:** licence text or source URL is recorded
  in `plan/decisions.md` and the fixture is referenced by P1-2.

- [ ] **M1-2 — Run consented user sessions.** Ref: `Voices.tsx` (quotes now illustrative).
  Human: recruit, consent, approve any quote. **Done when:** at least 10 sessions logged
  with written consent for anything published.

- [ ] **M1-3 — Settle marketplace importers.** Ref: `README.md` "Not yet built".
  Human: ToS/legal. Intelligence: parsers only after approval.
  **Done when:** go/no-go row appended to `plan/decisions.md`.

- [ ] **M1-4 — Settle the recovered Supabase work.** Ref: `PANGAEA-RECOVERY.md`.
  A separate local copy has `middleware.ts`, `src/app/api`, `src/app/auth`, `src/app/saved`,
  `supabase/schema.sql`, `.env.example`; it is not merged.
  Human: decide merge/discard and accept the privacy trade-off.
  **Done when:** decision row appended and the chosen state reflected in `README.md`.

## M2 — product and GTM proof

- [ ] **M2-1 — Replace illustrative figures with measured ones.** Refs: `Hero.tsx`,
  `Evidence.tsx`, `Voices.tsx`. **Done when:** every public number has a command and
  result in `plan/progress.md`, or remains explicitly labelled illustrative.

- [ ] **M2-2 — Decide pricing and payments.** Ref: `LICENSE` (proprietary).
  Human: price, tax, approval. Intelligence: integration.
  **Done when:** price and payment provider recorded in `plan/decisions.md`.

- [ ] **M2-3 — Choose hosting beyond Pages.** Ref: `plan/roadmap.md` expansion table.
  **Done when:** selection rule applied and host recorded in `plan/decisions.md`.

## M3+ — long term

- [ ] **M3-1 — Define the opt-in cloud tier.** **Done when:** a written boundary exists
  showing that review text stays local unless the user opts in, with architecture notes.

- [ ] **M3-2 — Reach the quantitative exit criteria.** Ref: `plan/roadmap.md` section 3.
  **Done when:** all five targets are measured and recorded, or explicitly retired in
  `plan/decisions.md`.
