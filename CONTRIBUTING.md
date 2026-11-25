# Contributing

PANGAEA's source is public but **not open source**. See `LICENSE`: no licence to
copy, modify, or redistribute is granted. This document is for people invited to
work on the project.

## Before you start

- Read `README.md`, `RESEARCH_BRIEF.md`, `plan/strategy.md` and `plan/roadmap.md`.
- The engine's hard rule: it reports observations, never verdicts. Every signal
  must carry a benign explanation beside the concerning one.
- Never add network calls, accounts, analytics, telemetry, or keys to the
  browser build. Local-first is a product promise, not a preference.

## Local workflow

Node 24 is used in CI. On Windows PowerShell, use `npm.cmd` if `npm.ps1` is
blocked by execution policy.

```
npm ci
npm run verify      # typecheck -> tests -> benchmark -> build
```

`npm run verify` must pass before any push. The benchmark reports numbers but
has no pass/fail threshold; note a large regression in your commit message.

## Change rules

- Add or update tests in `tests/` for any engine or cost change.
- Do not edit generated `out/` or `.next/`; they are ignored and regenerated.
- No secrets, `.env` files, personal data, or credential locations in tracked files.
- Follow `plan/README.md`: in the **same commit** as the work, update the backlog,
  append a progress entry, append to decisions if scope/cost changed, and update
  the roadmap and strategy session table if the split changed.

## Pull requests

Describe the user-visible change, the exact commands you ran, and their results.
Link each item to a backlog ID from `plan/backlog.md`.
