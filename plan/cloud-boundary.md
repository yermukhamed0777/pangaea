# PANGAEA — cloud boundary (M3-1)

This is an architecture note, not a commitment to build a cloud tier. It records
the boundary that any future hosted capability must respect.

## Default state (today)

- The product is a static export. The analysis engine, landed-cost math, import
  parser and report export all run in the browser.
- Review text, author names and offer values are never sent to a server. There is
  no server, no account, no database, no runtime key and no telemetry.
- The only event mechanism is `src/lib/events.ts`: an in-memory map of allowlisted
  event names to counts. It holds no user content and is never transmitted.
- The network-sniffing browser check (`scripts/e2e.ts`) asserts zero external
  requests, and `scripts/check-offline.ts` fails on runtime network primitives in
  authored source or external asset hosts in the export.

## Boundary for any future hosted tier

1. **Opt-in only.** A user must take a distinct, informed action to enable any
   cloud feature. The free browser tool must keep working with no account.
2. **Separate origin.** Server capability lives on a different origin from the
   static site, so a browser build can never accidentally post review text to it.
3. **No review text by default.** Saved reports, sync and history may store only
   content-free metadata unless the user explicitly consents to upload text for
   that specific feature. Event counts are not review content and stay local.
4. **Keys never in the bundle.** Any server key is used server-side only; the
   browser bundle must contain none. The offline check must still pass.
5. **Deletion and export.** If a hosted store is ever introduced, a user can
   delete all of their stored data and export whatever remains, from a clearly
   labelled control.
6. **Re-check the promise.** Any proposed feature that breaks 1–5 requires an
   explicit change of promise in `plan/decisions.md` before implementation.

## Explicitly rejected for now

- Merging the recovered Supabase auth/saved-report work into this build: it would
  introduce accounts, keys and server-side user data (see `plan/decisions.md`).
- Marketplace importers: no permitted data access has been obtained (ToS risk).
- Runtime analytics: conflicts with the local-first promise; use allowlisted
  in-memory counts instead.

## Human-only before any of this ships

Legal review, pricing/funding decision, a named owner for public claims, and a
consented pilot. See `plan/pilot-handoff.md`.
