/**
 * Deterministic micro-benchmark for the analysis engine.
 * No randomness, no network, no thresholds: reports numbers only so CI can
 * track regressions without failing on timing jitter.
 */
import { analyze } from "../src/lib/engine.ts";
import { syntheticReviews } from "./bench-fixtures.ts";

const REVIEW_COUNT = Number(process.env.BENCH_REVIEWS || 2000);
const RUNS = Number(process.env.BENCH_RUNS || 10);

const reviews = syntheticReviews(REVIEW_COUNT);
const samples: number[] = [];
for (let i = 0; i < RUNS; i++) {
  const start = performance.now();
  analyze(reviews);
  samples.push(performance.now() - start);
}
samples.sort((a, b) => a - b);
const median = samples[Math.floor(samples.length / 2)];
console.log(
  `engine bench: ${REVIEW_COUNT} reviews, ${RUNS} runs, median ${median.toFixed(2)} ms, ` +
    `${(1000 / median).toFixed(1)} analyses/s, signals ${analyze(reviews).signals.length}`,
);
