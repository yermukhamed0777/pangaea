# PANGAEA — Research Brief & Product Direction

Researched 2026-11-23. Sources listed at the end.

## 1. What the research says

### The market gap
- **Fakespot shut down in July 2025** (Mozilla ended the extension program; consumer product discontinued). Chrome extension, web tool, iOS app all gone.
- **ReviewMeta is functionally frozen** — no meaningful update since 2022, methodology unchanged.
- Both tools answered with a **grade** (A–F or adjusted rating) but users wanted a **decision**. As one analysis put it: "a Fakespot C grade tells you the reviews are suspicious. It doesn't tell you whether to buy the product."
- Both suffered **false positives** — legitimate reviews flagged as fake. Sellers and buyers both reported this. Trustpilot ratings for both tools are poor.
- Fakespot also had serious **privacy criticism** (browsing history, location, purchase data collection).

### Why the old methods are breaking
- Fakespot/ReviewMeta were calibrated for 2018–2022 manipulation: velocity spikes, repeated phrasing, obvious account patterns.
- **AI-generated reviews don't repeat phrases, don't cluster in obvious time windows, and mention product details convincingly.** The statistical fingerprints are fading.
- Detecting them requires evaluating **substance** — does the review describe specific first-hand experience? — not just statistics.

### The honesty problem (most important finding)
- A peer-reviewed study ("Confounds and Overestimations in Fake Review Detection", arXiv:2110.15130) showed that **product ownership and data origin confounds cause large overestimates** of detector accuracy. A review from someone who didn't buy the product isn't necessarily fake.
- Estimates of fake reviews range from **7% to 42%** — not because one is wrong, but because "fake" is defined differently (suspicious vs confirmed, review-level vs product-level, incentivized vs fabricated).
- **A tool that says "this review is fake" is making a claim it cannot support.**PANGAEA must never do that.

### Signals that actually work without ML (from AltexSoft's survey)
- Verification status (verified purchase)
- Timing: bursts, reviews before product release, unusual reviewer frequency
- Text: scene-setting instead of product detail, pronoun/verb-heavy language, repeated phrases, black-and-white extremes, competitor praise
- Rating: all-five-star patterns, sudden rating fluctuations
- Reviewer history: all-5-star accounts, repeated phrasing
- Metadata: helpfulness, IP/location clusters (not available to us)
- Cross-business: identical reviews on multiple pages (not available to us)

Real-world scale: Amazon blocked 250M+ suspected fake reviews in 2023; Google removed 170M+. Human detection accuracy ≈57%. But the academic confound finding means **high accuracy claims should be treated with suspicion**.

### Regulatory tailwind
- FTC: Fashion Nova paid $4.2M in 2022 for suppressing low ratings. Proposed rule: up to $50,000 per fake review viewed. Manipulation is a real compliance problem, not a curiosity.

## 2. The unique PANGAEA angle

**"Evidence ledger, not a grade."** Four commitments that no dead tool combined:

1. **No verdict.** We never say "fake". We report *observations* with measured confidence and always show the **benign explanation alongside the concerning one**. A burst of 5-star reviews might be a product launch. We say both.
2. **Substance over statistics.** Add signals the old tools lacked: specificity (numbers, units, measurements), product-detail density vs scene-setting, pronoun ratio, emotional extremity, rating/text mismatch. These work on AI-written reviews.
3. **Local-first, zero data collection.** Everything runs in the user's browser. No upload, no account, no keys. Directly answers the privacy criticism of Fakespot.
4. **Real economics.** A working landed-cost engine (unit price + shipping + duty + VAT + bundle math across shops), not a claim about price comparison.

## 3. What to build now (before auth/Vercel/Supabase)

| Piece | Purpose |
|---|---|
| Pure TypeScript analysis engine | Deterministic, testable, no dependencies |
| Workbench UI | Paste reviews or upload CSV/JSON, see evidence ledger |
| Landed-cost calculator | Real cross-shop math |
| Exportable report | Shareable evidence with methodology attached |
| Clearly synthetic demo dataset | Proves the tool works without pretending to be real data |
| Documented real dataset sources | For later validation, with license caveats |

**Explicitly out of scope for now:** sign-in, Supabase, scraping marketplaces (ToS and legal risk), paid APIs, marketing, growth.

## 4. Sources
- AltexSoft, "Fake Review Detection: Data, Methods, Tools, Real Cases" (2024) — signals, tools, statistics, cases.
- arXiv:2110.15130, "Confounds and Overestimations in Fake Review Detection" — why detectors overestimate.
- reviewai.pro, "Fakespot vs ReviewMeta in 2026" — shutdown, methodology gap, AI-written reviews.
- trustmebro.reviews — community reports of false positives and privacy concerns.
- review42.com, "What Percentage of Amazon Reviews Are Fake? (2026)" — why estimates disagree (7–42%).
- GitHub topic `fake-review-detection` — Yelp/Amazon datasets exist but licenses are unclear; treat as leads, not confirmed sources.
