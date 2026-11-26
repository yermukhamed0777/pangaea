/* ------------------------------------------------------------------ *
 * Content-free event harness for the pilot handoff.
 *
 * Only an allowlisted event NAME and a monotonic count are ever recorded.
 * No review text, author, account, journal content or timestamp is stored.
 * Nothing is transmitted: this is an in-memory counter, not telemetry.
 * See plan/pilot-handoff.md and scripts/check-events.ts.
 * ------------------------------------------------------------------ */

export const EVENT_NAMES = [
  "workbench.opened",
  "analysis.run",
  "demo.loaded",
  "import.file",
  "report.exported",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];
export type EventSnapshot = Record<EventName, number>;

const FORBIDDEN_WORDS = ["review", "author", "journal", "account", "email", "password", "token", "text", "rating"];

function blank(): EventSnapshot {
  const out = {} as EventSnapshot;
  EVENT_NAMES.forEach((name) => { out[name] = 0; });
  return out;
}

function createSink() {
  let counts = blank();
  let sequence = 0;
  return {
    emit(name: string): void {
      if (!(EVENT_NAMES as readonly string[]).includes(name)) {
        throw new Error(`Rejected non-allowlisted event name: ${name}`);
      }
      counts[name as EventName]++;
      sequence++;
    },
    snapshot(): EventSnapshot {
      return { ...counts };
    },
    get sequence(): number {
      return sequence;
    },
    reset(): void {
      counts = blank();
      sequence = 0;
    },
  };
}

export const eventSink = createSink();

/** Assert that a snapshot contains only allowlisted names and numeric counts. */
export function assertContentFree(value: unknown): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Event payload must be an object of allowlisted name -> count");
  }
  for (const [key, count] of Object.entries(value as Record<string, unknown>)) {
    if (!(EVENT_NAMES as readonly string[]).includes(key)) throw new Error(`Unknown event name: ${key}`);
    if (typeof count !== "number" || !Number.isInteger(count) || count < 0) {
      throw new Error(`Event count for ${key} is not a non-negative integer`);
    }
  }
  const payload = JSON.stringify(value).toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (payload.includes(word)) throw new Error(`Event payload contains forbidden content: ${word}`);
  }
}
