import type { Review } from "../src/lib/types.ts";

/**
 * Deterministic synthetic review fixture shared by the timing benchmark and
 * the runtime/memory benchmark. No network, no randomness beyond the fixed
 * linear congruential generator below, identical at every size prefix.
 */
export function syntheticReviews(n: number): Review[] {
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
