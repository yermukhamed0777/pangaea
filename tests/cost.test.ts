import { test } from "node:test";
import assert from "node:assert/strict";
import { compareOffers, landedCost, savingPercent } from "../src/lib/cost.ts";

const base = { shop: "A", price: 42, units: 1, shipping: 8.5, dutyPct: 8, vatPct: 12 };

test("landedCost applies duty to item cost and VAT to item + duty + shipping", () => {
  const result = landedCost(base);
  assert.equal(result.itemCost, 42);
  assert.equal(result.duty, 3.36);
  assert.equal(result.vat, 6.46);
  assert.equal(result.shipping, 8.5);
  assert.equal(result.total, 60.32);
  assert.equal(result.perUnit, 60.32);
});

test("landedCost divides the total across units", () => {
  const result = landedCost({ shop: "B", price: 34, units: 2, shipping: 6, dutyPct: 8, vatPct: 12 });
  assert.equal(result.itemCost, 68);
  assert.equal(result.perUnit, Math.round((result.total / 2) * 100) / 100);
});

test("landedCost clamps negative percentages and units", () => {
  const result = landedCost({ shop: "C", price: -10, units: 0, shipping: -5, dutyPct: -5, vatPct: -5 });
  assert.equal(result.itemCost, 0);
  assert.equal(result.duty, 0);
  assert.equal(result.vat, 0);
  assert.equal(result.shipping, 0);
  assert.equal(result.perUnit, 0);
});

test("compareOffers drops non-positive prices and sorts by per-unit cost", () => {
  const results = compareOffers([
    { ...base, shop: "expensive", price: 100 },
    { ...base, shop: "free", price: 0 },
    { ...base, shop: "cheap", price: 10 },
  ]);
  assert.deepEqual(results.map((r) => r.shop), ["cheap", "expensive"]);
  assert.ok(results[0].perUnit < results[1].perUnit);
});

test("savingPercent compares best against worst per-unit cost", () => {
  const results = compareOffers([
    { ...base, shop: "A", price: 100, units: 1, shipping: 0, dutyPct: 0, vatPct: 0 },
    { ...base, shop: "B", price: 50, units: 1, shipping: 0, dutyPct: 0, vatPct: 0 },
  ]);
  assert.equal(savingPercent(results), 50);
  assert.equal(savingPercent([]), 0);
  assert.equal(savingPercent(results.slice(0, 1)), 0);
});
