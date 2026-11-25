# Security and privacy

## Data handling

PANGAEA runs entirely in the browser. There is no server, no account, no database,
no analytics and no telemetry in the published build. Review text pasted into the
workbench stays in the page; `URL.createObjectURL` is used only to download a report
to the same device. The generated static export makes no network requests for user
data (fonts are fetched at build time by `next/font/google`, not at runtime).

## Reporting a vulnerability

Open a GitHub issue or contact the repository owner privately with:
- what you found and how to reproduce it,
- the affected file:line or URL,
- the impact and any suggested fix.

Do not include real credentials or personal data in a public issue.

## Scope

The workbench is not a security boundary against code running on the same machine.
Do not paste confidential review data you are not allowed to process. The analysis
engine reports statistical observations only; it is not a fraud verdict and must
not be used as one.

## Repository hygiene

`.gitignore` excludes `out/`, `.next/`, `node_modules/`, `*.tsbuildinfo` and `.env*`
(except `.env.example`). No secret values or credential locations belong in tracked
files. See `plan/README.md` for the update convention.
