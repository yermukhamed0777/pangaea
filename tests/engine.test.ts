import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, reviewsFromText } from "../src/lib/engine.ts";
import { demoReviews, demoText } from "../src/lib/sample.ts";

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

test("reviewsFromText rejects invalid dates but keeps the line", () => {
  const [review] = reviewsFromText("4 | not-a-date | bob | Good build quality on this item.");
  assert.equal(review.date, null);
  assert.equal(review.rating, 4);
});

test("demo dataset produces the documented deterministic result", () => {
  const result = analyze(demoReviews());
  assert.equal(result.count, 20);
  assert.equal(result.average, 4.4);
  assert.equal(result.cleanAverage, 4.31);
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
  assert.equal(result.limits.length, 6);
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

test("empty input yields no signals and a zero average", () => {
  const result = analyze([]);
  assert.equal(result.count, 0);
  assert.equal(result.average, 0);
  assert.equal(result.cleanAverage, null);
  assert.equal(result.signals.length, 0);
  assert.equal(result.score, 0);
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
