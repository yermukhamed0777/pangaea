import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, parseDate, reviewsFromText } from "../src/lib/engine.ts";
import { demoReviews, demoText } from "../src/lib/sample.ts";
import type { Review } from "../src/lib/types.ts";

test("reviewsFromText parses structured lines and plain-text lines", () => {
  const reviews = reviewsFromText(
    "5 | 2026-03-02 | alice | Texture is light and absorbs in 20 seconds.\n" +
      "plain review with no metadata",
  );
  assert.equal(reviews.length, 2);
  assert.deepEqual(
    {
      id: reviews[0].id,
      rating: reviews[0].rating,
      date: reviews[0].date,
      author: reviews[0].author,
      verified: reviews[0].verified,
      text: reviews[0].text,
    },
    {
      id: "r1",
      rating: 5,
      date: "2026-03-02",
      author: "alice",
      verified: null,
      text: "Texture is light and absorbs in 20 seconds.",
    },
  );
  assert.equal(reviews[1].rating, 0);
  assert.equal(reviews[1].date, null);
  assert.equal(reviews[1].id, "r2");
});

/* P0-7: locale-independent, strict date parsing. */
test("parseDate accepts ISO dates and ignores an ISO time suffix", () => {
  const day = parseDate("2026-03-02")!;
  assert.equal(day, Date.UTC(2026, 2, 2));
  assert.equal(parseDate("2026-03-02T14:30:00Z"), day);
  assert.equal(parseDate(" 2026-03-02 "), day);
});

test("parseDate rejects non-ISO, impossible and partial dates", () => {
  assert.equal(parseDate("03/02/2026"), null);
  assert.equal(parseDate("2 March 2026"), null);
  assert.equal(parseDate("2026-02-30"), null);
  assert.equal(parseDate("2026-13-01"), null);
  assert.equal(parseDate("2026-03"), null);
  assert.equal(parseDate("not-a-date"), null);
  assert.equal(parseDate(null), null);
});

test("reviewsFromText rejects non-ISO dates but keeps the line", () => {
  const [review] = reviewsFromText("4 | 03/02/2026 | bob | Good build quality on this item.");
  assert.equal(review.date, null);
  assert.equal(review.rating, 4);
  assert.equal(review.text, "Good build quality on this item.");
});

test("demo dataset produces the documented deterministic result", () => {
  const result = analyze(demoReviews());
  assert.equal(result.count, 20);
  assert.equal(result.average, 4.4);
  // P0-8: the adjusted average is now computed from every flagged review.
  assert.equal(result.cleanAverage, 4.18);
  assert.deepEqual(
    result.signals.map((s) => s.key),
    [
      "timing-burst",
      "text-duplicates",
      "rating-five-heavy",
      "identity-concentration",
      "verification-low",
      "text-low-substance",
    ],
  );
  assert.equal(result.limits.length, 7);
  assert.ok(result.signals.every((s) => s.confidence >= 0 && s.confidence <= 1));
});

test("every signal carries a benign explanation and at least one evidence id", () => {
  const result = analyze(demoReviews());
  for (const signal of result.signals) {
    assert.ok(signal.benign.length > 0, `${signal.key} has no benign explanation`);
    assert.ok(signal.concern.length > 0, `${signal.key} has no concern explanation`);
    assert.ok(signal.evidenceIds.length > 0, `${signal.key} has no evidence ids`);
  }
});

/* P0-8: exported exclusion list reproduces the adjusted figure. */
test("adjusted average is reproducible from the excluded ids", () => {
  const result = analyze(demoReviews());
  assert.equal(result.excluded, result.excludedIds.length);
  assert.equal(new Set(result.excludedIds).size, result.excludedIds.length);
  const pool = demoReviews().filter((r) => !result.excludedIds.includes(r.id));
  const expected = Math.round((pool.reduce((s, r) => s + r.rating, 0) / pool.length) * 100) / 100;
  assert.equal(result.cleanAverage, expected);
  assert.notEqual(result.cleanAverage, result.average);
});

/* P0-6: the filtered scan must find exactly the same pairs as all-pairs. */
test("duplicate detection finds every qualifying pair", () => {
  const shared = "The texture feels light and absorbs quickly on skin without any residue.";
  const reviews: Review[] = [
    ["a", shared], ["b", shared], ["c", shared],
    ["d", "Shipping packaging weight button cable screen battery noise."],
    ["e", "Gift birthday anniversary wedding holiday present surprise."],
    ["f", "Formula ingredient seam stitch fabric zipper seam allowance."],
  ].map(([id, text]) => ({ id, author: `author-${id}`, rating: 5, date: null, verified: null, text }));

  const signal = analyze(reviews).signals.find((s) => s.key === "text-duplicates");
  assert.ok(signal, "expected a duplicate signal");
  // a-b, a-c and b-c are the only pairs at or above the 55% threshold.
  assert.match(signal!.observed, /^3 review pairs/);
  assert.deepEqual([...signal!.evidenceIds].sort(), ["a", "b", "c"]);
});

test("empty input yields no signals, a zero average and no score field", () => {
  const result = analyze([]);
  assert.equal(result.count, 0);
  assert.equal(result.average, 0);
  assert.equal(result.cleanAverage, null);
  assert.equal(result.signals.length, 0);
  // P0-9: the unlabelled aggregate number is gone entirely.
  assert.equal("score" in result, false);
  assert.deepEqual(result.excludedIds, []);
});

test("demoText round-trips into the same number of reviews", () => {
  assert.equal(reviewsFromText(demoText()).length, demoReviews().length);
});

test("timing observation describes the window as centred, not ending", () => {
  const signal = analyze(demoReviews()).signals.find((s) => s.key === "timing-burst");
  assert.ok(signal);
  assert.match(signal!.observed, /within 7 days of/);
  assert.doesNotMatch(signal!.observed, /ending/);
});
