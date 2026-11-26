/**
 * Deterministic micro-benchmark for the analysis engine.
 * No randomness, no network, no thresholds: reports numbers only so CI can
 * track regressions without failing on timing jitter.
 */
import { analyze } from "../src/lib/engine.ts";
import type { Review } from "../src/lib/types.ts";

const REVIEW_COUNT = Number(process.env.BENCH_REVIEWS || 2000);
const RUNS = Number(process.env.BENCH_RUNS || 10);

function syntheticReviews(n: number): Review[] {
  let seed = 42;
  const next = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff);
  const out: Review[] = [];
  for (let i = 0; i < n; i++) {
    const rating = 1 + (next() % 5);
    const day = 1 + (next() % 28);
    const month = 1 + (next() % 12);
    out.push({
      id: `b${i}`,
      rating,
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      author: `author-${next() % 400}`,
      verified: next() % 2 === 0,
      text: `Bought this item in ${month} month. The texture feels light and the 50 ml bottle lasted about six weeks. Shipping took ${1 + (next() % 14)} days.`,
    });
  }
  return out;
}

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
