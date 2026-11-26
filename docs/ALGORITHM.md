# PANGAEA algorithm methodology (frozen v1.0.0)

PANGAEA is an **evidence ledger**, not a verdict engine. It reports measurable
observations about review text the user supplies, always shows a plausible
benign explanation beside the concerning one, and never declares a review fake,
real, bought or fraudulent. The reasoning is in `RESEARCH_BRIEF.md`.

## Inputs and normalisation

- Accepted formats (`src/lib/imports.ts`): `rating | date | author | text`,
  CSV with optional header `rating,date,author,text,verified`, JSON array or
  `{ "reviews": [...] }`, and plain text. All parsing is local and synchronous.
- Dates (`parseDate`): strict `YYYY-MM-DD` with an optional time suffix,
  validated with `Date.UTC`. Locale-formatted or impossible dates become
  `null`; the review text is kept. No `Date.parse` is used.
- Tokens: lowercased, non-ASCII punctuation removed, stop words and tokens of
  two characters or fewer discarded. Only Latin-script text is meaningfully
  tokenised — see Limitations.
- Ratings: only integers 1–5 count toward averages. Out-of-range values are
  kept as text but excluded from numeric statistics.

## Seven deterministic checks (`src/lib/engine.ts`)

| Key | Observation | Threshold | Benign explanation shown |
|---|---|---|---|
| `timing-burst` | Reviews within 7 days of a peak date vs an even-spread expectation | ratio ≥ 2.2 and ≥ 5 reviews | launch, restock, sale, popular video |
| `text-duplicates` | Pairs sharing ≥ 55% of 5-word sequences | Jaccard ≥ 0.55 | natural phrase reuse for simple products |
| `rating-five-heavy` | Share of five-star ratings | ≥ 70% of ≥ 15 rated reviews | genuinely excellent product |
| `identity-concentration` | Reviews per author | ≥ 3 per author | enthusiastic repeat buyers, shared names |
| `verification-low` | Unverified share among reviews **with** verification data | ≥ 35% of ≥ 8 known values | platforms that never verify |
| `text-low-substance` | Long text with few measurements/details | ≥ 3 reviews, substance < 1.5 | brief emotional writing |
| `rating-text-mismatch` | Sentiment opposite to star rating | ≥ 2 reviews | irony, mixed-feature praise |

Every signal includes `observed`, `benign`, `concern`, bounded `confidence`
(0–1, strength of the pattern only), and capped display `evidenceIds`.
Regression tests assert every signal in every fixture carries a non-empty
benign and concern string and no verdict language.

### Exact duplicate detection at scale

The former all-pairs scan was replaced by: identical 5-gram sets grouped
combinatorially; a length filter (`min/max < t` cannot reach the threshold);
and a prefix filter over document-frequency-ranked grams (a pair reaching
Jaccard ≥ t must share one of the first `|S| - ceil(t|S|) + 1` grams). Only the
pair count, the five strongest pairs and the full excluded-ID set are kept.
`tests/engine.test.ts` verifies the pair count against a crafted brute-force
case, so the optimisation is exact, not approximate. Measured scaling is in
`docs/benchmark/BENCHMARK.md`.

## Adjusted average and exclusions

`flagged` = every review behind `text-duplicates`, `text-low-substance` and
`rating-text-mismatch`. `Analysis.excludedIds` exports the full set;
`excluded = excludedIds.length`. `cleanAverage` is the mean rating of rated
reviews not in that set, returned only when at least five remain, rounded to
two decimals. The exported report includes both the analysis and the input, so
anyone can recompute the figure. `tests/validation-coverage.test.ts` asserts
the identity for every eval fixture, and `tests/engine.test.ts` for the demo.

Display `evidenceIds` are capped at 5–8 per signal; this affects presentation
only and is stated in `Analysis.limits`.

## Landed cost (`src/lib/cost.ts`)

```
itemCost = max(0, price) * max(1, units)
duty     = itemCost * max(0, dutyPct) / 100
shipping = max(0, shipping)
vat      = (itemCost + duty + shipping) * max(0, vatPct) / 100
total    = itemCost + duty + shipping + vat
perUnit  = total / max(1, units)
```

All inputs are user supplied; there is no tax API, currency conversion or
cross-shop matching. Results are rounded to two decimals. Edge cases
(fractional rates, clamped negatives, zero units, sorting and saving) are in
`tests/cost.test.ts` and `tests/validation-coverage.test.ts`.

## Privacy

Everything runs in the browser. `npm run check:offline` fails on runtime
network primitives in authored source or external asset hosts in the export;
`npm run test:e2e` asserts zero external requests and that imported review text
never appears in a POST body, on both deployments. The optional event harness
(`src/lib/events.ts`) stores five allowlisted names and counts in memory only,
never transmits, and rejects hostile payloads (`npm run check:events`).

## Limitations — not claimed

- No ML classifier, no theme extraction, no seller database, no marketplace
  importers, no account and no scraping.
- Latin-script tokenisation means CJK and other non-ASCII reviews are not
  meaningfully scored; `tests/validation-coverage.test.ts` only asserts they
  are handled without fabrication.
- Thresholds are heuristic and have not been validated on real labelled data.
  The synthetic eval fixture is threshold regression, not an accuracy study.
- The synthetic benchmark fixture deliberately produces identical gram sets,
  so runtime grows roughly quadratically at 10k+ reviews (see benchmark).
- No conclusion about eligibility, authenticity, admission or a purchase
  decision is supported by this tool.

## Reproduce

```
npm ci
npm run verify        # typecheck, lint, 42 tests, eval, events, bench, build, offline, 2 build variants, e2e, walkthrough
npm run bench:memory  # runtime + memory at 500…20,000 reviews
```
