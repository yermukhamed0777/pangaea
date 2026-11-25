# PANGAEA plan — index and update convention

This folder is the source of truth for long-term execution. `strategy.md` holds the
thesis and status snapshot; `roadmap.md` holds the three horizons; `backlog.md` holds
ordered executable IDs; `decisions.md` and `progress.md` are append-only.

| File | What it is |
|---|---|
| [`strategy.md`](strategy.md) | Market/thesis, users, positioning, measured metrics, risks, open questions, session-history table. |
| [`roadmap.md`](roadmap.md) | The plan: short term (numbered, with "Done when"), midterm, long term, plus the alternatives-by-job expansion and selection rule. Every milestone splits into Intelligence and Human. |
| [`backlog.md`](backlog.md) | Ordered tasks with stable IDs, file:line anchors and a "Done when" for each; horizon map P0/P1 → short term, M1/M2 → midterm, M3+ → long term. |
| [`decisions.md`](decisions.md) | Append-only decision log: date, decision, why. Never rewrite old rows. |
| [`progress.md`](progress.md) | Append-only session log: exact changes, exact commands and results, open items mapped to backlog IDs. Research-only sessions get an entry too. |
| [`README.md`](README.md) | This index and the binding convention below. |

## Binding update convention

After **every** work session, in the **same commit** as the work:

1. Tick, split or add items in `backlog.md`.
2. Append a `progress.md` entry with exact changes, commands and results.
3. Append to `decisions.md` if direction, scope or cost changed.
4. Update `roadmap.md` and the session-history table in `strategy.md` if the horizon,
   milestone or work split changed.
5. Update the status snapshot (stage, latest measured numbers, next action).
6. Re-run tests, benchmark/lint and build; record results.

Research or scoping sessions still produce a plan entry. The command that runs steps 1-6
locally is `npm run verify` (typecheck -> tests -> benchmark -> build); its exact output
must be pasted or summarised with numbers in the progress entry. Append-only files are
never rewritten, even when a decision is later reversed — append a superseding row.

CI mirrors the local order in `.github/workflows/ci.yml`: tests/typecheck -> benchmark
(report only, no threshold) -> static build. Deployment is separate
(`.github/workflows/deploy.yml`) and runs on push to `main`.
