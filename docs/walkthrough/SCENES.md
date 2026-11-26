# PANGAEA walkthrough fixture (deterministic)

Regenerate with `npm run walkthrough`. No timestamp and no random data:
the file is byte-identical on every run. Figures below come from
`analyze(demoReviews())` and `compareOffers(demoOffers())` only.

## Scene 1 — paste reviews

Input: 20 synthetic reviews from `src/lib/sample.ts`, piped as
`rating | date | author | text`. The workbench also accepts CSV and JSON.

## Scene 2 — evidence ledger

- Reviews: 20
- Average: 4.4
- Adjusted: 4.18 (excludes 9 IDs: d3, d4, d5, d20, d9, d10, d2, d15, d18)
- Signals: 6

### Review timing is uneven (timing-burst)
- Observed: 11 reviews fall within 7 days of 2026-03-06; about 0.9 would be expected if reviews were evenly spread across the 150 days.
- Benign: A launch, restock, sale, or a popular video can genuinely produce a real spike of reviews.
- Concern: Coordinated review campaigns also produce bursts that are dense and tightly packed.
- Evidence IDs: d1, d2, d3, d4, d5, d6, d7, d8

### Repeated wording across reviews (text-duplicates)
- Observed: 7 review pairs share at least 55% of their 5-word sequences; closest pair 100% similar.
- Benign: People describing the same product often use the same natural phrases, especially for simple products.
- Concern: Copy-paste templates and AI-generated reviews produce unusually similar text across different authors.
- Evidence IDs: d3, d4, d5, d20

### Ratings cluster at five stars (rating-five-heavy)
- Observed: 70% of 20 rated reviews are five stars; only 10% are one or two stars.
- Benign: A genuinely excellent product sold to happy customers can legitimately have very few low ratings.
- Concern: Inflation campaigns and suppression of negative reviews create the same shape.
- Evidence IDs: d1, d2, d3, d4, d5, d6

### Several reviews share one author (identity-concentration)
- Observed: Author "mira.k" appears 3 times (15% of all reviews).
- Benign: Enthusiastic customers do write multiple reviews, and shared names are common.
- Concern: A small set of accounts producing many reviews can indicate an organised campaign.
- Evidence IDs: d1, d6, d19

### Many reviews lack purchase verification (verification-low)
- Observed: 40% of 20 reviews with verification data are marked unverified.
- Benign: Some platforms do not verify purchases at all, and verified badges are not proof of honesty.
- Concern: A high unverified share is one of the most cited signals in fake-review research.
- Evidence IDs: d2, d3, d4, d5, d9, d10

### Some reviews lack concrete detail (text-low-substance)
- Observed: 3 of 20 reviews are long but contain few measurements, product specifics, or first-hand details.
- Benign: Short on detail is not the same as dishonest — many people simply write brief, emotional reviews.
- Concern: Generated or template reviews often sound positive but describe no specific experience.
- Evidence IDs: d2, d15, d18

## Scene 3 — landed cost

| Shop | Item | Duty | VAT | Shipping | Total | Per unit |
|---|---:|---:|---:|---:|---:|---:|
| Shop B | 68 | 5.44 | 9.53 | 6 | 88.97 | 44.49 |
| Shop C | 29.9 | 0 | 5.03 | 12 | 46.93 | 46.93 |
| Shop A | 42 | 3.36 | 6.46 | 8.5 | 60.32 | 60.32 |

Best per unit: Shop B at 44.49; saving 26.2% vs worst.

## Scene 4 — export

`report.json` in this directory is the exact export payload shape, with
the synthetic input embedded for reproducibility. No user text is sent anywhere.

## Limits

- These are observations, not verdicts. No review is declared fake or real.
- We cannot verify who bought what, see IP addresses, or read private account history.
- A benign explanation is shown for every signal — always read it before drawing a conclusion.
- Confidence describes the strength of the measured pattern, not the probability of manipulation.
- AI-written reviews may pass every statistical check. Substance signals reduce but do not remove this risk.
- Results depend entirely on the data you provide; the tool never fetches reviews from any platform.
- Each signal caps its displayed review IDs; the full exclusion set is exported as excludedIds.
