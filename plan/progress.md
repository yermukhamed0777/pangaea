# PANGAEA — progress log (append-only)

Never rewrite an earlier entry. New sessions append at the bottom. Every entry records
exact changes, exact commands and results, and open items mapped to backlog IDs.

## 2026-11-25 — S1: Phase 1 inspection (research only, read-only)

**Changed:** nothing. No file was written, no git repo created, no push performed.

**Commands and results (exact):**
- `Get-ChildItem -Force` → `.github`, `.next`, `node_modules`, `public`, `src`,
  `.gitignore`, `next-env.d.ts`, `next.config.ts`, `package.json`, `postcss.config.js`,
  `README.md`, `tailwind.config.ts`, `tsconfig.json`, `PANGAEA-RECOVERY.md`. No `out/`
  at start, no `plan/`, no `package-lock.json`, no `LICENSE`.
- `git status --short; git rev-parse --is-inside-work-tree` → `fatal: not a git repository`.
- `node --version` → `v24.18.1`. `npm --version` → blocked: `npm.ps1 cannot be loaded
  because running scripts is disabled on this system`. Workaround used: `npm.cmd`.
- `gh auth status` → logged in to github.com as `yermukhamed0777`; token scopes
  `delete_repo, gist, read:org, repo, workflow`.
- `gh repo view yermukhamed0777/pangaea --json name,visibility,url,pushedAt,defaultBranchRef`
  → `PUBLIC`, `main`, pushed 2026-11-23T14:31:57Z.
- `npm.cmd run build` → `✓ Compiled successfully in 3.9s`, TypeScript clean, routes
  `/`, `/workbench`, `/_not-found`; `out/` generated with `/pangaea/` asset paths.
- `npm.cmd run test` → `npm error Missing script: "test"`.
  `npm.cmd run lint` → `npm error Missing script: "lint"`.
- `Invoke-WebRequest https://yermukhamed0777.github.io/pangaea/` → status 200,
  length 48683, body contains `Know what`.
- `Get-FileHash` on both recovery `RESEARCH_BRIEF.md` copies → identical SHA-256
  `D46EFC323013965A0A2ABFD81A9DF349990F8C8F8E03B5AF1AF3A1670C9CD5D3`.
- `node --experimental-strip-types -e "...analyze(demoReviews())..."` → count 20,
  average 4.4, cleanAverage 4.31, excluded 7, score 67, 6 signals in order:
  `timing-burst, text-duplicates, rating-five-heavy, identity-concentration,
  verification-low, text-low-substance` (the 7th check, `rating-text-mismatch`,
  does not fire on the demo data).

**Findings:** no tests/lint/benchmark; no lockfile; dangling `RESEARCH_BRIEF.md`
reference; engine wording said a centred window "ended" on the peak date; landing page
claimed verdicts, five marketplaces, seller verification, price history and named
tester quotes the code does not support; recovery notes exposed paths and credential
locations; O(n²) duplicate scan.

**Open items mapped:** P0-1 … P0-10, P1-1, P1-2, M1-1 … M1-4, M2-1 … M2-3, M3-1, M3-2.

## 2026-11-25 — S2: Phase 2/3 implementation

**Changed (files/surfaces):**
- `package.json`: added `typecheck`, `test`, `bench`, `verify` scripts.
- `tsconfig.json`: `allowImportingTsExtensions: true` so Node-style `.ts` imports pass.
- `tests/engine.test.ts`, `tests/cost.test.ts`: 12 tests; `scripts/bench.ts`: deterministic benchmark.
- `package-lock.json`: generated (`npm.cmd install --package-lock-only`).
- `src/lib/engine.ts:106`: centred-window wording fix.
- `src/app/components/{Hero,Method,Capabilities,Evidence,Voices}.tsx`: illustrative
  labels, removed false capability words and named tester quotes, dropped `4.1×`.
- `RESEARCH_BRIEF.md`: restored from recovery (byte-identical).
- `PANGAEA-RECOVERY.md`: scrubbed.
- `.gitignore`: `out/`, `.env`, `.env.*`, `!.env.example`.
- `.github/workflows/ci.yml`: new; `.github/workflows/deploy.yml`: Node 24 + `npm ci`.
- `LICENSE`, `THIRD_PARTY_NOTICES.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`.
- `README.md`: verified claims, CI badge, plan links, verification and licence sections.
- `plan/{README,strategy,roadmap,backlog,decisions,progress}.md`: created.

**Commands and results (exact, final pass):**
- `npm.cmd run verify` → exit 0. `tsc --noEmit` clean; `node
  --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test`
  → `tests 12 / pass 12 / fail 0` in 143.9874 ms; `npm run bench` →
  `engine bench: 2000 reviews, 10 runs, median 1260.35 ms, 0.8 analyses/s, signals 3`;
  `next build` → compiled in 2.9 s, TypeScript 2.2 s, 3 static routes.
- Earlier in this session, `npm.cmd run verify` at 5,000 reviews / 20 runs →
  `median 8240.58 ms, 0.1 analyses/s`; this is the measured O(n²) finding.
- Two failed intermediate runs were fixed, not hidden: (1) TS5097 on `.ts` import
  extensions → added `allowImportingTsExtensions`; (2) `node --test tests` was treated
  as a module path → removed the directory argument so Node auto-discovers tests.
- `Select-String` on `out/index.html` → `Illustrative mockup` 1, `Illustrative verdict`
  1, `Composite example` 3, `Three passes. Evidence` 1; `Do not buy`, `fake bursts`,
  `4.1×`, and all three former tester names → 0 matches.
- Secrets scan over all non-generated files for `sk-`, `service_role`, private-key
  headers, `password=`, `api_key=`, `FINAL_CREDENTIALS`, `gho_` → `NO SECRET-LIKE
  PATTERNS FOUND`.

**Open items mapped:** P0-2, P0-6, P0-7, P0-8, P0-9, P0-10, P1-1, P1-2, M1-1 … M1-4,
M2-1 … M2-3, M3-1, M3-2. P0-1, P0-3, P0-4 and P0-5 are complete and checked in the backlog.
