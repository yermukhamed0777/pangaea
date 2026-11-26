/**
 * Runtime + memory benchmark at increasing synthetic dataset sizes.
 *
 * Methodology (also written to docs/benchmark/results.json):
 *  - one fixed-seed fixture per size from scripts/bench-fixtures.ts;
 *  - 2 unmeasured warm-up analyses, then N measured repetitions;
 *  - global.gc() before each measured run; heapUsed sampled before/after;
 *  - wall time from performance.now(); records median and p95;
 *  - rss is a process high-water mark, not a per-analysis allocation.
 *
 * Requires `node --expose-gc`. No network, no accounts, no real review text.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { cpus, totalmem, platform, arch, release } from "node:os";
import { join } from "node:path";
import { analyze } from "../src/lib/engine.ts";
import { syntheticReviews } from "./bench-fixtures.ts";

const sizes = (process.env.BENCH_SIZES || "500,1000,2000,5000,10000,20000")
  .split(",")
  .map(Number)
  .filter((n) => Number.isFinite(n) && n > 0);
const runs = Number(process.env.BENCH_RUNS || 5);
const warmup = 2;

if (typeof globalThis.gc !== "function") {
  console.error("bench:memory requires node --expose-gc");
  process.exit(1);
}

const median = (xs: number[]) => {
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};
const percentile = (xs: number[], p: number) => {
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
};

const hardware = {
  cpu: (cpus()[0]?.model || "unknown").trim(),
  logicalCores: cpus().length,
  totalMemoryBytes: totalmem(),
  platform: platform(),
  arch: arch(),
  osRelease: release(),
  node: process.version,
};

const results = [];
for (const size of sizes) {
  const reviews = syntheticReviews(size);
  for (let i = 0; i < warmup; i++) analyze(reviews);
  const times: number[] = [];
  const heaps: number[] = [];
  let peakRss = 0;
  for (let i = 0; i < runs; i++) {
    globalThis.gc!();
    const before = process.memoryUsage();
    const start = performance.now();
    analyze(reviews);
    const elapsed = performance.now() - start;
    const after = process.memoryUsage();
    times.push(elapsed);
    heaps.push(after.heapUsed - before.heapUsed);
    peakRss = Math.max(peakRss, after.rss);
  }
  const row = {
    reviews: size,
    runs,
    warmup,
    medianMs: Math.round(median(times) * 100) / 100,
    p95Ms: Math.round(percentile(times, 0.95) * 100) / 100,
    medianHeapDeltaBytes: Math.round(median(heaps)),
    peakRssBytes: peakRss,
    signals: analyze(reviews).signals.length,
  };
  results.push(row);
  console.log(
    `bench:memory ${size} reviews: median ${row.medianMs} ms, p95 ${row.p95Ms} ms, ` +
      `heap Δ ${Math.round(row.medianHeapDeltaBytes / 1024)} KiB, peak RSS ${Math.round(peakRss / 1048576)} MiB`,
  );
}

const payload = {
  generatedBy: "npm run bench:memory",
  command: "node --expose-gc --experimental-strip-types scripts/bench-memory.ts",
  fixture: "scripts/bench-fixtures.ts (fixed LCG seed 42)",
  methodology:
    "2 unmeasured warm-ups; forced GC before each measured run; heapUsed sampled before/after; wall time via performance.now(); rss is a process high-water mark.",
  hardware,
  sizes,
  runs,
  warmup,
  results,
};

const dir = join(process.cwd(), "docs", "benchmark");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "results.json"), JSON.stringify(payload, null, 2) + "\n");

const lines = [
  "# Runtime and memory benchmark",
  "",
  "Reproduce with `npm run bench:memory` (Node with `--expose-gc`).",
  "",
  `Hardware: **${hardware.cpu}**, ${hardware.logicalCores} logical cores, ` +
    `${Math.round(hardware.totalMemoryBytes / 1073741824 * 10) / 10} GiB RAM, ` +
    `${hardware.platform} ${hardware.arch} (${hardware.osRelease}), ${hardware.node}.`,
  "",
  "Fixture: fixed-seed synthetic reviews from `scripts/bench-fixtures.ts`;",
  "identical prefix at every size. Two unmeasured warm-ups, then " +
    `${runs} measured runs per size. Forced GC before each run; ` +
    "`heapUsed` sampled before and after; wall time via `performance.now()`.",
  "`rss` is a process high-water mark, not a per-analysis allocation.",
  "",
  "| Reviews | Runs | Median ms | p95 ms | Median heap Δ (KiB) | Peak RSS (MiB) | Signals |",
  "|---:|---:|---:|---:|---:|---:|---:|",
  ...results.map(
    (r) =>
      `| ${r.reviews} | ${r.runs} | ${r.medianMs} | ${r.p95Ms} | ` +
      `${Math.round(r.medianHeapDeltaBytes / 1024)} | ${Math.round(r.peakRssBytes / 1048576)} | ${r.signals} |`,
  ),
  "",
  "These are measurements on the hardware named above, not performance guarantees.",
  "No real customer data or third-party service was used.",
  "",
  "**Scaling note.** This fixed fixture deliberately gives every review the same",
  "5-gram set, so the duplicate-cluster pair count grows roughly quadratically.",
  "The 10,000/20,000 rows characterise that worst case; pasted sets with",
  "distinct wording are cheaper. The scan remains exact and is covered by a",
  "pair-count regression test.",
  "",
];
writeFileSync(join(dir, "BENCHMARK.md"), lines.join("\n"));
console.log(`bench:memory: wrote ${results.length} rows to docs/benchmark/`);
