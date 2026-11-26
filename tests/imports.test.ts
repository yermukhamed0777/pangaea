import { test } from "node:test";
import assert from "node:assert/strict";
import { parseReviews } from "../src/lib/imports.ts";

const pipe = [
  "5 | 2026-03-02 | alice | Texture is light and absorbs in 20 seconds.",
  "2 | 2026-03-04 | bob | The cap broke on day two, very disappointing.",
].join("\n");

// The pipe format has no verification column, so equivalence is checked on
// the four shared fields; verified is asserted separately where supplied.
const shape = (r: { rating: number; date: string | null; author: string; text: string }) => ({
  rating: r.rating, date: r.date, author: r.author, text: r.text,
});

test("pipe and plain-text formats are unchanged", () => {
  const parsed = parseReviews(pipe);
  assert.equal(parsed.format, "pipe");
  assert.equal(parsed.error, null);
  assert.equal(parsed.reviews.length, 2);
  assert.equal(parseReviews("just a plain review").format, "text");
});

test("CSV with a header matches the equivalent pipe input", () => {
  const csv = [
    "rating,date,author,text,verified",
    "5,2026-03-02,alice,Texture is light and absorbs in 20 seconds.,true",
    '2,2026-03-04,bob,"The cap broke on day two, very disappointing.",false',
  ].join("\n");
  const parsed = parseReviews(csv);
  assert.equal(parsed.format, "csv");
  assert.equal(parsed.error, null);
  assert.deepEqual(parsed.reviews.map(shape), parseReviews(pipe).reviews.map(shape));
  assert.deepEqual(parsed.reviews.map((r) => r.verified), [true, false]);
});

test("CSV without a header uses the documented column order", () => {
  const parsed = parseReviews("4,2026-05-01,carla,Works as described.,yes");
  assert.equal(parsed.format, "csv");
  assert.equal(parsed.reviews[0].author, "carla");
  assert.equal(parsed.reviews[0].verified, true);
});

test("JSON array and object wrapper parse into reviews", () => {
  const json = JSON.stringify([
    { id: "j1", rating: 5, date: "2026-03-02", author: "alice", text: "Texture is light and absorbs in 20 seconds.", verified: true },
    { rating: 2, date: "2026-03-04", author: "bob", text: "The cap broke on day two, very disappointing.", verified: false },
  ]);
  const parsed = parseReviews(json);
  assert.equal(parsed.format, "json");
  assert.equal(parsed.error, null);
  assert.equal(parsed.reviews[0].id, "j1");
  assert.deepEqual(parsed.reviews.map(shape), parseReviews(pipe).reviews.map(shape));
  assert.equal(parseReviews(`{"reviews":${json}}`).reviews.length, 2);
});

test("malformed JSON reports an error instead of throwing", () => {
  const bad = parseReviews("{not json");
  assert.equal(bad.format, "json");
  assert.ok(bad.error && bad.error.length > 0);
  assert.deepEqual(bad.reviews, []);
  const wrongShape = parseReviews('{"foo":1}');
  assert.ok(wrongShape.error && wrongShape.error.includes("array"));
});

test("invalid dates are dropped but review text is kept", () => {
  const parsed = parseReviews("rating,date,author,text\n5,03/02/2026,alice,Good texture and fit.");
  assert.equal(parsed.reviews[0].date, null);
  assert.equal(parsed.reviews[0].text, "Good texture and fit.");
});
