# Runtime and memory benchmark

Reproduce with `npm run bench:memory` (Node with `--expose-gc`).

Hardware: **AMD Ryzen 9 8940HX with Radeon Graphics**, 32 logical cores, 31.2 GiB RAM, win32 x64 (10.0.26300), v24.18.1.

Fixture: fixed-seed synthetic reviews from `scripts/bench-fixtures.ts`;
identical prefix at every size. Two unmeasured warm-ups, then 5 measured runs per size. Forced GC before each run; `heapUsed` sampled before and after; wall time via `performance.now()`.
`rss` is a process high-water mark, not a per-analysis allocation.

| Reviews | Runs | Median ms | p95 ms | Median heap Δ (KiB) | Peak RSS (MiB) | Signals |
|---:|---:|---:|---:|---:|---:|---:|
| 500 | 5 | 19.84 | 24.86 | 7677 | 78 | 3 |
| 1000 | 5 | 50.29 | 61.79 | 8149 | 129 | 3 |
| 2000 | 5 | 138.52 | 178.81 | 48882 | 200 | 3 |
| 5000 | 5 | 619.59 | 697.5 | 66884 | 222 | 3 |
| 10000 | 5 | 2871.4 | 4645.85 | 27304 | 256 | 3 |
| 20000 | 5 | 14458.24 | 26059.87 | 89719 | 344 | 3 |

These are measurements on the hardware named above, not performance guarantees.
No real customer data or third-party service was used.

**Scaling note.** This fixed fixture deliberately gives every review the same
5-gram set, so the duplicate-cluster pair count grows roughly quadratically.
The 10,000/20,000 rows characterise that worst case; pasted sets with
distinct wording are cheaper. The scan remains exact and is covered by a
pair-count regression test.
