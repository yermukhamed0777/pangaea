import { test } from "node:test";
import assert from "node:assert/strict";
import { EVENT_NAMES, assertContentFree, eventSink } from "../src/lib/events.ts";

test("event harness records only allowlisted names and counts", () => {
  eventSink.reset();
  eventSink.emit("analysis.run");
  eventSink.emit("analysis.run");
  const snapshot = eventSink.snapshot();
  assert.deepEqual(Object.keys(snapshot), [...EVENT_NAMES]);
  assert.equal(snapshot["analysis.run"], 2);
  assert.equal(eventSink.sequence, 2);
  assertContentFree(snapshot);
});

test("event harness rejects user-looking text and hostile payloads", () => {
  assert.throws(() => eventSink.emit("5 | 2026-03-02 | alice | Texture is light"), /Rejected/);
  assert.throws(() => assertContentFree({ "review.text": 1 }), /Unknown event name/);
  assert.throws(() => assertContentFree({ "analysis.run": "alice@example.com" }), /non-negative integer/);
  assert.throws(() => assertContentFree("analysis.run"), /must be an object/);
});
