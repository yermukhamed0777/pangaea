import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../src/lib/engine.ts";
import { evalCases } from "./fixtures/eval-cases.ts";

test("synthetic eval fixtures cover at least eight distinct cases", () => {
  assert.ok(evalCases.length >= 8);
  assert.equal(new Set(evalCases.map((c) => c.name)).size, evalCases.length);
});

for (const c of evalCases) {
  test(`eval: ${c.name}`, () => {
    const got = analyze(c.reviews).signals.map((s) => s.key).sort();
    assert.deepEqual(got, [...c.expected].sort());
  });
}
