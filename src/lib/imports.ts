import type { Review } from "./types";
import { parseDate, reviewsFromText } from "./engine.ts";

/* ------------------------------------------------------------------ *
 * Local-only input parsing. Nothing here fetches, uploads or stores
 * anything. Four accepted shapes:
 *
 *   pipe : `rating | date | author | text` (one per line)
 *   csv  : optional header rating,date,author,text,verified
 *   json : array of review objects, or { "reviews": [...] }
 *   text : one plain review per line, no metadata
 *
 * See plan/backlog.md P1-1.
 * ------------------------------------------------------------------ */

export type ImportFormat = "pipe" | "csv" | "json" | "text";

export type ImportResult = {
  reviews: Review[];
  format: ImportFormat;
  error: string | null;
};

const FIELDS = ["rating", "date", "author", "text", "verified"] as const;

function toRating(value: unknown): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 0;
}

function toVerified(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  const s = String(value ?? "").trim().toLowerCase();
  if (["true", "1", "yes", "verified"].includes(s)) return true;
  if (["false", "0", "no", "unverified"].includes(s)) return false;
  return null;
}

function toDate(value: unknown): string | null {
  const s = value == null ? "" : String(value).trim();
  return parseDate(s) !== null ? s : null;
}

function review(i: number, rating: number, date: string | null, author: string, text: string, verified: boolean | null): Review {
  return { id: `r${i + 1}`, rating, date, author: author || `anon-${i + 1}`, text, verified };
}

/** Small RFC-4180-style reader: quoted commas, escaped quotes and quoted newlines. */
function csvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"') {
        if (input[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field.trim()); field = ""; }
    else if (c === "\n") { row.push(field.trim()); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) rows.push([...row, field.trim()]);
  return rows.filter((r) => r.some((c) => c.length > 0));
}

function fromCsv(input: string): ImportResult {
  const rows = csvRows(input);
  if (!rows.length) return { reviews: [], format: "csv", error: null };
  const first = rows[0].map((s) => s.replace(/^\uFEFF/, "").toLowerCase());
  const hasHeader = first.some((h) => FIELDS.includes(h as (typeof FIELDS)[number]));
  const columns: readonly string[] = hasHeader
    ? first.map((h) => (FIELDS.includes(h as (typeof FIELDS)[number]) ? h : ""))
    : FIELDS;
  const data = hasHeader ? rows.slice(1) : rows;
  const reviews = data.map((cells, i) => {
    const get = (name: string) => {
      const idx = columns.indexOf(name);
      return idx >= 0 ? cells[idx] ?? "" : "";
    };
    return review(
      i, toRating(get("rating")), toDate(get("date")), get("author"), get("text"),
      toVerified(get("verified")),
    );
  }).filter((r) => r.text.length > 0);
  return { reviews, format: "csv", error: null };
}

function fromJson(input: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch (err) {
    return { reviews: [], format: "json", error: `Invalid JSON: ${(err as Error).message}` };
  }
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { reviews?: unknown }).reviews)
      ? (data as { reviews: unknown[] }).reviews
      : null;
  if (!list) {
    return { reviews: [], format: "json", error: 'JSON must be an array of review objects, or { "reviews": [...] }.' };
  }
  const reviews = list.map((item, i) => {
    if (typeof item === "string") return review(i, 0, null, `anon-${i + 1}`, item, null);
    const o = (item && typeof item === "object") ? item as Record<string, unknown> : {};
    const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : `r${i + 1}`;
    return {
      id,
      rating: toRating(o.rating),
      date: toDate(o.date),
      author: String(o.author ?? `anon-${i + 1}`),
      text: String(o.text ?? ""),
      verified: toVerified(o.verified),
    };
  });
  return { reviews, format: "json", error: null };
}

export function parseReviews(raw: string): ImportResult {
  const input = raw.trim();
  if (!input) return { reviews: [], format: "text", error: null };
  if (input.startsWith("[") || input.startsWith("{")) return fromJson(input);
  const first = input.split(/\r?\n/, 1)[0].replace(/^\uFEFF/, "");
  if (first.includes(",") && !first.includes("|")) return fromCsv(input);
  return {
    reviews: reviewsFromText(raw),
    format: first.includes("|") ? "pipe" : "text",
    error: null,
  };
}
