import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, parseDate, reviewsFromText } from "../src/lib/engine.ts";
import { parseReviews } from "../src/lib/imports.ts";
import { compareOffers, landedCost, savingPercent } from "../src/lib/cost.ts";
import { evalCases } from "./fixtures/eval-cases.ts";
import type { Review } from "../src/lib/types.ts";

const review = (
  i: number,
  text: string,
  extra: Partial<Review> = {},
): Review => ({
  id: `v${i}`,
  author: `tester-${i}`,
  rating: 5,
  date: null,
  verified: null,
  text,
  ...extra,
});

/* A burst must still carry the benign launch/restock explanation. */
test("promotional timing burst fires with its benign explanation intact", () => {
  const signal = analyze(
    evalCases.find((c) => c.name === "timing burst only")!.reviews,
  ).signals.find((s) => s.key === "timing-burst");
  assert.ok(signal);
  assert.match(signal!.benign, /launch|restock|sale|video/);
  assert.match(signal!.concern, /coordinated/i);
  assert.doesNotMatch(signal!.observed, /fake|fraud|verdict/i);
});

/* Repeated product terminology is not automatically copied text. */
test("legitimate repeated product terminology does not fire text-duplicates", () => {
  const reviews = [
    "The 50 ml bottle lasts about six weeks and feels light on skin.",
    "The 50 ml bottle lasts about six weeks but the cap is cheap.",
    "The 50 ml bottle lasts about six weeks under foundation.",
    "The 50 ml bottle lasts about six weeks in dry weather.",
    "The 50 ml bottle lasts about six weeks for the daily commute.",
  ].map((text, i) => review(i, text));
  const signals = analyze(reviews).signals.map((s) => s.key);
  assert.ok(!signals.includes("text-duplicates"), signals.join(","));
});

/* Tiny and highly imbalanced inputs must stay defined, not verdict-like. */
test("small and imbalanced datasets are handled without a verdict", () => {
  for (const reviews of [
    [],
    [review(1, "Good texture and sturdy packaging.")],
    Array.from({ length: 6 }, (_, i) => review(i, `Good item ${i}.`))
      .concat(review(6, "Awful, broken, waste of money.", { rating: 1 })),
  ]) {
    const result = analyze(reviews);
    assert.equal(result.excluded, result.excludedIds.length);
    assert.ok(result.signals.every((s) => s.benign.length > 0 && s.concern.length > 0));
    assert.ok(result.limits.every((l) => !/is fake|is real|verdict: /i.test(l)));
  }
});

/* Duplicated and malformed imports are accepted or rejected, never crashing. */
test("duplicated and malformed imports stay side-effect free", () => {
  const csv = parseReviews(
    "rating,date,author,text,verified\r\n" +
      "5,2026-01-01,alice,The 50 ml bottle lasted about six weeks.,true\r\n" +
      "5,2026-01-01,alice,The 50 ml bottle lasted about six weeks.,true",
  );
  assert.equal(csv.error, null);
  assert.equal(csv.reviews.length, 2);
  assert.deepEqual(csv.reviews.map((r) => r.id), ["r1", "r2"]);
  const dupes = analyze(csv.reviews).signals.find((s) => s.key === "text-duplicates");
  assert.ok(dupes);
  assert.match(dupes!.observed, /^1 review pairs/);

  const bom = parseReviews("\uFEFFrating,date,author,text\n5,2026-01-01,alice,Good fit.");
  assert.equal(bom.reviews.length, 1);
  assert.ok(bom.error === null);
  const malformed = parseReviews("{\"reviews\": [1, null, {\"text\": 42}]}");
  assert.equal(malformed.error, null);
  assert.equal(malformed.reviews.length, 3);
});

/* Missing verification metadata must never be treated as unverified. */
test("missing verification metadata does not fire verification-low", () => {
  const reviews = Array.from({ length: 10 }, (_, i) =>
    review(i, `Item ${i}: the 50 ml bottle lasted about six weeks.`, {
      verified: null,
    }),
  );
  const keys = analyze(reviews).signals.map((s) => s.key);
  assert.ok(!keys.includes("verification-low"), keys.join(","));
});

/* Non-Latin text is not silently claimed to have been analysed. */
test("multilingual reviews are processed without fabrication", () => {
  const reviews = [
    review(1, "这个产品质感很好，50 毫升用了六周，包装结实。"),
    review(2, "材质が軽く、50 ml は六週間持ちました。"),
    review(3, "The texture is light; the 50 ml bottle lasted six weeks."),
  ];
  const result = analyze(reviews);
  assert.equal(result.count, 3);
  assert.ok(result.signals.every((s) => s.benign && s.concern));
  assert.deepEqual(result.excludedIds, []);
  assert.match(result.limits.join(" "), /data you provide|never fetches/i);
});

/* Bad dates and ratings are retained as text, never promoted to facts. */
test("incorrect date and rating formats are rejected deterministically", () => {
  assert.equal(parseDate("2026-02-30"), null);
  assert.equal(parseDate("2026-01-01T09:00:00Z"), parseDate("2026-01-01"));
  const parsed = reviewsFromText(
    "6 | 2026-01-01 | a | Out of range rating.\n" +
      "5 | 2026-13-01 | b | Impossible month.\n" +
      "5 | 2026-03-02T08:00:00Z | c | ISO time suffix.",
  );
  // An invalid date does not invalidate an otherwise valid rating.
  assert.deepEqual(parsed.map((r) => r.rating), [0, 5, 5]);
  assert.deepEqual(parsed.map((r) => r.date), [null, null, "2026-03-02T08:00:00Z"]);
});

/* Landed cost must obey its documented formula at awkward numbers. */
test("currency rounding, shipping and tax edge cases obey the formula", () => {
  const result = landedCost({
    shop: "fractional", price: 0.1, units: 3, shipping: 0.01, dutyPct: 2.5, vatPct: 7.5,
  });
  assert.equal(result.itemCost, 0.3);
  assert.equal(result.duty, 0.01);
  assert.equal(result.vat, 0.02);
  assert.equal(result.total, 0.34);
  assert.equal(result.perUnit, 0.11);

  const clamped = landedCost({
    shop: "clamped", price: -5, units: 0, shipping: -1, dutyPct: -10, vatPct: -10,
  });
  assert.equal(clamped.total, 0);
  assert.equal(clamped.perUnit, 0);

  const offers = compareOffers([
    { shop: "A", price: 10, units: 1, shipping: 5, dutyPct: 0, vatPct: 0 },
    { shop: "B", price: 10, units: 2, shipping: 5, dutyPct: 0, vatPct: 0 },
  ]);
  assert.deepEqual(offers.map((o) => o.shop), ["B", "A"]);
  // A: 15/unit; B: (20+5)/2 = 12.5/unit -> 16.7% saving.
  assert.equal(savingPercent(offers), 16.7);
});

/* The adjusted average is reproducible from the exported IDs in every case. */
test("every eval case reproduces its adjusted average from excludedIds", () => {
  for (const c of evalCases) {
    const result = analyze(c.reviews);
    assert.equal(result.excluded, result.excludedIds.length, c.name);
    assert.equal(new Set(result.excludedIds).size, result.excludedIds.length, c.name);
    if (result.cleanAverage === null) continue;
    const rated = c.reviews.filter(
      (r) => r.rating >= 1 && r.rating <= 5 && !result.excludedIds.includes(r.id),
    );
    const expected = Math.round(
      (rated.reduce((s, r) => s + r.rating, 0) / rated.length) * 100,
    ) / 100;
    assert.equal(result.cleanAverage, expected, c.name);
  }
});
