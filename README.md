# PANGAEA

**Know what you're buying.** An evidence-first shopping-intelligence tool — not a marketing site.

Live: https://yermukhamed0777.github.io/pangaea/

## What actually works

- **Forensics workbench** (`/workbench`) — paste reviews, get an evidence ledger.
  Seven deterministic signals: timing bursts, near-duplicate text, rating skew,
  author concentration, missing verification, low-substance text, and rating/text mismatch.
- **Every signal shows the benign explanation beside the concerning one.** The tool
  never says a review is fake or real. See `RESEARCH_BRIEF` in the project notes for why.
- **Adjusted average** with the excluded review IDs visible.
- **Landed-cost calculator** — real math for price, units, shipping, duty and VAT across three offers.
- **Export report** — downloadable JSON with the full analysis and methodology.
- **Zero network calls, zero accounts, zero API keys.** Everything runs in the browser.

## Why this exists

Fakespot shut down in 2025; ReviewMeta has been frozen since 2022. Both returned grades,
not decisions, and both had persistent false-positive and privacy complaints. AI-written
reviews no longer show the timing and repetition patterns those tools looked for. PANGAEA
is built around substance signals, explicit uncertainty, and local-first processing.

## Run locally

```
npm install
npm run dev
```

Open `http://localhost:3000/pangaea/workbench`.

For the static build, `npm run build` produces `out/`; serve it under `/pangaea/`
because `next.config.ts` sets `basePath`. GitHub Pages uses that path automatically.

## Structure

| Path | Purpose |
|---|---|
| `src/lib/engine.ts` | Analysis engine — pure functions, no dependencies |
| `src/lib/cost.ts` | Landed-cost math |
| `src/lib/sample.ts` | Clearly synthetic demo dataset for testing |
| `src/lib/types.ts` | Shared types |
| `src/app/workbench/page.tsx` | The workbench UI |
| `src/app/components/` | Landing page sections |
| `.github/workflows/deploy.yml` | Build + Pages deployment on push to `main` |

## Not yet built (planned)

Sign-in and saved reports via Supabase, deployment to Vercel, marketplace importers,
and validation against a properly licensed real-world dataset. No marketing or
user-acquisition work is planned.
