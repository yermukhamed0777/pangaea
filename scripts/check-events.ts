/**
 * Automated assertion that the pilot event harness stays content-free.
 * Feeds it hostile strings resembling review text and account data, then
 * verifies the snapshot contains only allowlisted names and counts.
 */
import assert from "node:assert/strict";
import { EVENT_NAMES, assertContentFree, eventSink } from "../src/lib/events.ts";

eventSink.reset();
for (const name of EVENT_NAMES) eventSink.emit(name);
eventSink.emit("analysis.run");

const hostile = [
  "5 | 2026-03-02 | alice | Texture is light and absorbs in 20 seconds.",
  "account: alice@example.com password: hunter2",
  "journal entry about a terrible purchase",
];
for (const value of hostile) {
  assert.throws(() => eventSink.emit(value), /Rejected non-allowlisted event name/);
}

const snapshot = eventSink.snapshot();
assertContentFree(snapshot);
assert.equal(Object.keys(snapshot).length, EVENT_NAMES.length);
assert.equal(snapshot["analysis.run"], 2);
assert.equal(eventSink.sequence, EVENT_NAMES.length + 1);
assert.throws(() => assertContentFree({ "review.text": 1 }), /Unknown event name/);
assert.throws(() => assertContentFree({ "analysis.run": "alice" }), /not a non-negative integer/);
console.log(`PASS events: ${EVENT_NAMES.length} allowlisted names, ${eventSink.sequence} counts, 0 content fields`);
