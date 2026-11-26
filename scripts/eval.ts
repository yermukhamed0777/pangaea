/**
 * Local evaluation harness. Reports per-signal counts on a committed,
 * clearly synthetic fixture. No real data, no network, no accuracy claim:
 * counts only, and a mismatch is a hard failure so CI can gate a release.
 *
 * This is NOT real-world validation — see plan/backlog.md P1-2 and M1-1.
 */
import { analyze } from "../src/lib/engine.ts";
import { evalCases } from "../tests/fixtures/eval-cases.ts";

type Counts = { tp: number; fp: number; fn: number };
const counts = new Map<string, Counts>();
const bump = (key: string, field: keyof Counts) => {
  const row = counts.get(key) || { tp: 0, fp: 0, fn: 0 };
  row[field]++;
  counts.set(key, row);
};

let mismatches = 0;
for (const c of evalCases) {
  const got = new Set(analyze(c.reviews).signals.map((s) => s.key));
  const expected = new Set(c.expected);
  for (const key of expected) bump(key, got.has(key) ? "tp" : "fn");
  for (const key of got) if (!expected.has(key)) bump(key, "fp");
  const missing = [...expected].filter((k) => !got.has(k));
  const extra = [...got].filter((k) => !expected.has(k));
  if (missing.length || extra.length) {
    mismatches++;
    console.log(`FAIL ${c.name}: missing=[${missing.join(",")}] unexpected=[${extra.join(",")}]`);
  } else {
    console.log(`PASS ${c.name}`);
  }
}

console.log("signal                       tp  fp  fn");
for (const [key, c] of [...counts].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${key.padEnd(28)} ${String(c.tp).padStart(2)}  ${String(c.fp).padStart(2)}  ${String(c.fn).padStart(2)}`);
}
console.log(`eval: ${evalCases.length} synthetic cases, ${mismatches} mismatches`);
if (mismatches > 0) process.exitCode = 1;
