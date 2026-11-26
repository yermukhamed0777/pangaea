# PANGAEA — concise demonstration

**Canonical URL:** https://yermukhamed0777.github.io/pangaea/
Open **Workbench** from the landing page, or go directly to
https://yermukhamed0777.github.io/pangaea/workbench .

Alternative deployment (kept, not deleted):
https://pangaea-gules.vercel.app/pangaea/workbench .
Both served the same commit and passed the same six browser checks on
2026-11-26; see `docs/RELEASE.md`.

## Four steps, about two minutes

1. **Load the demo.** Press **Demo data**. The workbench shows 20 clearly
   synthetic reviews, average `4.4`, adjusted `4.18`, and six observations.
   The seventh check (rating/text mismatch) does not fire on this fixture.
2. **Read one signal.** Expand **Review timing is uneven**. It reports the
   observed burst and, immediately below, the benign explanation (launch,
   restock, sale or a popular video). Nothing is labelled fake or real.
3. **Import a local file.** Use **Or load a local file** with a `.csv` containing
   `rating,date,author,text,verified`. The label changes to `csv · local only`.
   Nothing is uploaded; the browser check asserts no review text leaves the tab.
4. **Export.** Press **Export report** and save `pangaea-report.json`. It
   contains the full analysis, `excludedIds`, costs and methodology limits.

## Deterministic capture (no live run needed)

```
npm ci
npm run walkthrough
CAPTURE=1 npm run test:e2e
```

`npm run walkthrough` writes `docs/walkthrough/report.json` and `SCENES.md`
byte-identically (verified by SHA-256). With `CAPTURE=1`, the browser check also
writes `docs/walkthrough/01-landing.png` and `02-workbench.png` at a fixed
1440×900 viewport with animations disabled, so a video can be made later
without re-running the whole app. On Windows PowerShell set `$env:CAPTURE="1"`
first and use `npm.cmd`.

To run the same browser checks against a deployment:

```
$env:E2E_BASE_URL="https://yermukhamed0777.github.io"; npm.cmd run test:e2e
```

Expected: six PASS lines (landing, ledger, export, CSV import, zero external
requests, no transmitted review text).

No real customer data, marketplace import, account, payment or AI call is used
or needed.
