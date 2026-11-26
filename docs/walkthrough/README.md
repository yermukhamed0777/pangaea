# Walkthrough fixtures

This directory holds deterministic artefacts for a future recorded walkthrough.
No clock, randomness, network or user data is involved, so regeneration is
byte-identical (verified by SHA-256 on 2026-11-26).

## Files

| File | Source | Purpose |
|---|---|---|
| `report.json` | `npm run walkthrough` | Exact export payload shape with the synthetic input embedded |
| `SCENES.md` | `npm run walkthrough` | Four scenes with the measured figures and limits |
| `01-landing.png`, `02-workbench.png` | `CAPTURE=1 npm run test:e2e` | Optional fixed-viewport browser screenshots (1440×900, animations disabled) |

## Commands

```
npm ci
npm run walkthrough                  # rewrite report.json + SCENES.md deterministically
CAPTURE=1 npm run test:e2e            # build first; writes the two screenshots
```

On Windows PowerShell, set the capture flag with `$env:CAPTURE="1"` before the
second command; use `npm.cmd` if `npm.ps1` is blocked by execution policy.

The screenshots are optional and untracked until generated. A video can be made
later from `SCENES.md` and these images without re-running the app.
