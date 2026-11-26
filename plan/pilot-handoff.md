# PANGAEA — pilot handoff (human-owned)

**Status: prepared, not run.** No users have been recruited, contacted or tested.
Everything an agent can do before this boundary is complete and verified locally
(`npm run verify`). This document is the exact handoff point.

## 1. Goal

A seven-day pilot with a **fixed cohort of five consenting testers** to learn
whether the evidence ledger is understandable and useful, and whether the
landed-cost math matches what a careful shopper expects. The pilot is a learning
exercise, **not** an accuracy study: PANGAEA makes no "fake/real" claim and the
synthetic eval harness (`npm run eval`) is threshold regression, not validation.

## 2. Cohort and consent wording

Recruit five people who already buy cross-border and who are not dependent on
you for anything. Do not use family or colleagues who feel obliged to participate.

Consent wording to use verbatim (adapt only the owner's name):

> I agree to take part in a seven-day evaluation of PANGAEA. I understand that
> the tool runs locally in my browser, that I am not required to paste any real
> or confidential review data, and that no review text, account data or personal
> information will be collected or transmitted by the tool. I understand that
> only anonymous counts of five named actions are recorded in the browser and
> are not sent anywhere. I agree to share written feedback. I understand that
> any quote attributed to me will be shown to me and approved in writing before
> publication, and that I may withdraw at any time.

Do not publish a quote without that written approval. `Voices.tsx` currently
contains only composite examples labelled "not a verified testimonial".

## 3. Schedule

| Day | Activity | Owner |
|---|---|---|
| 0 | Confirm consent text, cohort and the exact build SHA to be tested | Human |
| 1–7 | Each tester completes the three tasks below, then gives written feedback | Human |
| 8 | Collate failures into backlog IDs, decide go/no-go, update `plan/decisions.md` | Human |

The build under test should be the commit that passed `npm run verify`; record its
SHA in `plan/progress.md` before starting.

### Tasks (no real customer data needed)

1. Load the synthetic demo with **Demo data** and explain, in the tester's own
   words, what one signal says and what its benign explanation is.
2. Paste the CSV fixture in `docs/walkthrough/report.json` (the `input` field)
   or use the file picker with a `.csv` copied from it, and confirm the analysis
   matches the demo.
3. Change the three landed-cost offers and state which is cheapest per unit and why.

Do not ask testers to find "fake reviews". The product refuses that label.

## 4. What to collect

- **Content-free counts only** from `src/lib/events.ts`: `workbench.opened`,
  `analysis.run`, `demo.loaded`, `import.file`, `report.exported`. Read them from
  the browser console. No text, author, account, journal or timestamp is stored.
- Completion or failure for each of the three tasks above.
- Written feedback, with explicit written consent before any quote is published.
- Any observed contradiction between the UI and the code.

Do **not** collect review text, screenshots containing personal data, browsing
history, or business-confidential information.

## 5. How to file a failure

1. Add a new stable ID to `plan/backlog.md` (the next free ID after `V7`, e.g.
   `V8` for tooling, `P1-3` for product, `M1-5` for validation) with a `file:line`
   anchor and a checkable **Done when**.
2. Append a `plan/progress.md` entry with the exact command/result, if a command
   reproduces it. Do not rewrite earlier entries or renumber IDs.
3. If scope, cost or the product promise changed, append a `plan/decisions.md` row.
4. Fix or defer in a separate commit that references the new ID.

## 6. Go / no-go criteria (proposals, not measurements)

Go only if **all** hold:

- All five testers complete task 1 and task 3 without a crash or a wrong landed-cost
  figure.
- No tester reads a signal as a "fake/real" verdict without correction.
- `npm run verify` remains green on the tested SHA.
- Zero privacy incidents and zero unlabelled illustrative claims.
- Every quote to be published has written approval.

No-go (revisit design) if any tester can't explain a signal, if the cost math is
wrong, or if the promise is misread. Do not publish accuracy, usage or revenue
numbers after this pilot — it is far too small to support them.

## 7. Explicitly human-only (not done, not delegated)

| Item | Backlog ID | Why it cannot be agent-done |
|---|---|---|
| Recruit and obtain genuine informed consent | M1-2 | Requires real people and a relationship |
| Run the seven-day pilot and record feedback | M1-2 | Requires real users |
| Obtain a licensed real dataset and permission | M1-1 | Requires licence/legal permission |
| Legal review of marketplace ToS | M1-3 | Requires a qualified reviewer |
| Decide merge/discard of the recovered Supabase work | M1-4 | Irreversible product/privacy decision (a default no-merge is recorded) |
| Choose price, funding and payments | M2-2 | Requires a money/tax owner (a free default is recorded) |
| Approve every public claim and brand/trademark | M2-1 | Requires an accountable owner |
| Push, publish, change visibility or licence | — | Explicitly withheld pending confirmation |
| Reach MAU/paying-user/real-session targets | M3-2 | Requires real adoption |

Nothing in this document should be read as a claim that the pilot happened.
