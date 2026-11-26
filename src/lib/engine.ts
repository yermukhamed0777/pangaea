import type { Review, Analysis, Signal } from "./types";

/* ------------------------------------------------------------------ *
 * PANGAEA forensics engine v0.2
 *
 * Design rule: this engine NEVER says a review is fake. It reports
 * measurable observations, a confidence in the *signal*, and the
 * benign explanation beside the concerning one. See RESEARCH_BRIEF.md.
 *
 * All parsing is deterministic and locale-independent: dates are
 * accepted only as ISO dates (an ISO time suffix is ignored), so no
 * locale-sensitive Date.parse is used. See plan/backlog.md P0-7.
 * ------------------------------------------------------------------ */

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "is", "was", "were", "be", "been",
  "it", "its", "this", "that", "these", "those", "i", "me", "my", "we",
  "our", "you", "your", "he", "she", "they", "them", "their", "to", "of",
  "in", "on", "at", "for", "from", "with", "as", "by", "so", "very", "just",
  "really", "got", "get", "have", "has", "had", "do", "did", "not", "no",
]);

const DETAIL = [
  "texture", "packaging", "package", "shipping", "delivery", "size", "fit",
  "smell", "taste", "battery", "screen", "price", "quality", "material",
  "weight", "build", "button", "zip", "seam", "stitch", "fabric", "skin",
  "absorption", "cast", "formula", "ingredient", "charge", "cable", "noise",
];

const SCENE = [
  "gift", "birthday", "anniversary", "christmas", "wedding", "holiday",
  "for my", "bought for", "present", "surprise", "mom", "dad", "wife", "husband",
];

const POSITIVE = ["amazing", "perfect", "excellent", "love", "great", "best", "wonderful", "fantastic", "obsessed"];
const NEGATIVE = ["terrible", "awful", "worst", "hate", "useless", "broken", "disappointed", "waste", "scam"];

const DUPLICATE_THRESHOLD = 0.55;
const BURST_DAYS = 7;

type Prepared = {
  review: Review;
  time: number | null;
  words: string[];
  lower: string;
  grams: string[];
};

function words(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s%.-]/g, " ").split(/\s+/).filter(Boolean);
}

function contentWords(text: string): string[] {
  return words(text).filter((w) => w.length > 2 && !STOP.has(w));
}

function gramList(text: string, n = 5): string[] {
  const toks = contentWords(text);
  const out: string[] = [];
  for (let i = 0; i <= toks.length - n; i++) out.push(toks.slice(i, i + n).join(" "));
  return out;
}

function jaccard(a: number[], b: number[]): number {
  if (!a.length || !b.length) return 0;
  let inter = 0;
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { inter++; i++; j++; }
    else if (a[i] < b[j]) i++;
    else j++;
  }
  return inter / (a.length + b.length - inter);
}

/**
 * Locale-independent ISO date parser. Accepts YYYY-MM-DD, optionally
 * followed by a time suffix (which is deliberately ignored). Anything
 * else is null, so the same input gives the same result in every locale.
 */
export function parseDate(value: string | null | undefined): number | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[Tt ].*)?$/.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const time = Date.UTC(y, mo - 1, d);
  const check = new Date(time);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null;
  return time;
}

function round(n: number, d = 2): number {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}

export function reviewsFromText(raw: string): Review[] {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((line, i) => {
    // supported: "rating | date | author | text" or plain text
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length >= 4 && /^[1-5]$/.test(parts[0])) {
      return {
        id: `r${i + 1}`,
        rating: Number(parts[0]),
        date: parseDate(parts[1]) !== null ? parts[1] : null,
        author: parts[2] || `anon-${i + 1}`,
        text: parts.slice(3).join(" | "),
        verified: null,
      };
    }
    return { id: `r${i + 1}`, rating: 0, date: null, author: `anon-${i + 1}`, verified: null, text: line };
  });
}

function prepare(reviews: Review[]): Prepared[] {
  return reviews.map((review) => {
    const ws = words(review.text);
    return {
      review,
      time: parseDate(review.date),
      words: ws,
      lower: review.text.toLowerCase(),
      grams: [...new Set(gramList(review.text))].sort(),
    };
  });
}

type Dupe = { a: string; b: string; sim: number };

/**
 * Exact near-duplicate detection without materialising every pair.
 *
 * The old scan compared all n² pairs and pushed every hit into an array,
 * which was both slow and memory-hungry when many reviews shared a text
 * shape. This keeps only the pair count and the five strongest pairs, and
 * compresses reviews with identical gram sets into one group:
 *
 *  - length filter: Jaccard <= min(|A|,|B|)/max(|A|,|B|);
 *  - prefix filter: a pair reaching t must share one of the first
 *    |S| - ceil(t*|S|) + 1 grams, indexed by document frequency (rare first);
 *  - identical gram sets are counted combinatorially, so a large cluster
 *    costs O(k) instead of O(k²) pair objects.
 *
 * Candidate pairs are visited in (i, j) order, preserving the old output.
 * (P0-6)
 */
function duplicatePairs(prepared: Prepared[]): { count: number; top: Dupe[]; ids: Set<string> } {
  const active = prepared.filter((p) => p.grams.length > 0);
  const empty = { count: 0, top: [] as Dupe[], ids: new Set<string>() };
  if (active.length < 2) return empty;

  const df = new Map<string, number>();
  for (const p of active) {
    for (const g of p.grams) df.set(g, (df.get(g) || 0) + 1);
  }
  const terms = [...df.keys()].sort((a, b) => (df.get(a)! - df.get(b)!) || (a < b ? -1 : a > b ? 1 : 0));
  const rank = new Map(terms.map((t, i) => [t, i] as const));
  const ranked = active.map((p) => p.grams.map((g) => rank.get(g)!).sort((a, b) => a - b));

  // Group identical gram sets and index prefixes by group, not by review.
  const groups = new Map<string, number>();
  const groupOf: number[] = [];
  const members: number[][] = [];
  ranked.forEach((gs, i) => {
    const key = gs.join(",");
    let g = groups.get(key);
    if (g === undefined) {
      g = members.length;
      groups.set(key, g);
      members.push([]);
    }
    groupOf[i] = g;
    members[g].push(i);
  });

  const posting = new Map<number, number[]>();
  const prefixLength = ranked.map((gs) => Math.max(1, gs.length - Math.ceil(DUPLICATE_THRESHOLD * gs.length) + 1));
  members.forEach((list, g) => {
    const seen = new Set<number>();
    for (const i of list) {
      for (let k = 0; k < prefixLength[i]; k++) {
        const token = ranked[i][k];
        if (!seen.has(token)) {
          seen.add(token);
          const postingList = posting.get(token) || [];
          postingList.push(g);
          posting.set(token, postingList);
        }
      }
    }
  });

  let count = 0;
  const top: Dupe[] = [];
  const ids = new Set<string>();
  // Every member of a duplicate group is excluded; record that once.
  members.forEach((list) => {
    if (list.length >= 2) list.forEach((i) => ids.add(active[i].review.id));
  });
  const consider = (i: number, j: number, sim: number) => {
    count++;
    if (groupOf[i] !== groupOf[j]) {
      ids.add(active[i].review.id);
      ids.add(active[j].review.id);
    }
    // Only the five strongest pairs are retained; avoid an allocation per hit.
    if (top.length >= 5 && sim <= top[top.length - 1].sim) return;
    const pair = { a: active[i].review.id, b: active[j].review.id, sim };
    if (top.length < 5) {
      top.push(pair);
      top.sort((x, y) => y.sim - x.sim);
    } else {
      top[top.length - 1] = pair;
      top.sort((x, y) => y.sim - x.sim);
    }
  };

  for (let i = 0; i < ranked.length; i++) {
    const a = ranked[i];
    const ownGroup = groupOf[i];
    const candidates = new Set<number>(members[ownGroup].filter((j) => j > i));
    for (let k = 0; k < prefixLength[i]; k++) {
      for (const g of posting.get(a[k]) || []) {
        if (g === ownGroup) continue;
        for (const j of members[g]) if (j > i) candidates.add(j);
      }
    }
    for (const j of [...candidates].sort((x, y) => x - y)) {
      const b = ranked[j];
      // Jaccard(A,B) <= min(|A|,|B|) / max(|A|,|B|).
      if (Math.min(a.length, b.length) / Math.max(a.length, b.length) < DUPLICATE_THRESHOLD) continue;
      const sim = groupOf[j] === ownGroup ? 1 : jaccard(a, b);
      if (sim >= DUPLICATE_THRESHOLD) consider(i, j, round(sim));
    }
  }
  return { count, top, ids };
}

export function analyze(reviews: Review[]): Analysis {
  const signals: Signal[] = [];
  const prepared = prepare(reviews);
  const count = reviews.length;
  const rated = reviews.filter((r) => r.rating >= 1 && r.rating <= 5);
  const average = rated.length ? round(rated.reduce((s, r) => s + r.rating, 0) / rated.length) : 0;
  const distribution = [1, 2, 3, 4, 5].map((n) => rated.filter((r) => r.rating === n).length);

  /* --- 1. Temporal bursts (two-pointer window, no repeated Date.parse) --- */
  const dated = prepared
    .filter((p) => p.time !== null)
    .sort((a, b) => (a.time! - b.time!) || (a.review.id < b.review.id ? -1 : a.review.id > b.review.id ? 1 : 0));
  if (dated.length >= 8) {
    const span = Math.max(1, (dated[dated.length - 1].time! - dated[0].time!) / 86400000);
    const expected = (dated.length * BURST_DAYS) / span;
    let peak = { start: dated[0].review.date!, n: 0, ids: [] as string[] };
    const windowMs = BURST_DAYS * 86400000;
    let left = 0;
    let right = 0;
    for (let i = 0; i < dated.length; i++) {
      const t = dated[i].time!;
      while (left < i && t - dated[left].time! > windowMs) left++;
      if (right < i) right = i;
      while (right + 1 < dated.length && dated[right + 1].time! - t <= windowMs) right++;
      const window = dated.slice(left, right + 1);
      if (window.length > peak.n) {
        peak = { start: dated[i].review.date!, n: window.length, ids: window.map((p) => p.review.id) };
      }
    }
    const ratio = expected > 0 ? peak.n / expected : 0;
    if (ratio >= 2.2 && peak.n >= 5) {
      signals.push({
        key: "timing-burst", label: "Review timing is uneven", family: "timing",
        severity: ratio >= 4 ? "strong" : "notable", confidence: round(Math.min(0.95, ratio / 6)),
        observed: `${peak.n} reviews fall within ${BURST_DAYS} days of ${peak.start}; about ${round(expected, 1)} would be expected if reviews were evenly spread across the ${round(span)} days.`,
        benign: "A launch, restock, sale, or a popular video can genuinely produce a real spike of reviews.",
        concern: "Coordinated review campaigns also produce bursts that are dense and tightly packed.",
        evidenceIds: peak.ids.slice(0, 8),
      });
    }
  }

  /* --- 2. Near-duplicate text --- */
  const dupes = duplicatePairs(prepared);
  if (dupes.count) {
    const top = dupes.top;
    signals.push({
      key: "text-duplicates", label: "Repeated wording across reviews", family: "text",
      severity: dupes.count > 6 ? "strong" : "notable", confidence: round(Math.min(0.9, top[0].sim)),
      observed: `${dupes.count} review pairs share at least 55% of their 5-word sequences; closest pair ${top[0].sim * 100}% similar.`,
      benign: "People describing the same product often use the same natural phrases, especially for simple products.",
      concern: "Copy-paste templates and AI-generated reviews produce unusually similar text across different authors.",
      evidenceIds: [...new Set(top.flatMap((d) => [d.a, d.b]))].slice(0, 8),
    });
  }

  /* --- 3. Rating distribution --- */
  const fiveShare = rated.length ? distribution[4] / rated.length : 0;
  const lowShare = rated.length ? (distribution[0] + distribution[1]) / rated.length : 0;
  if (rated.length >= 15 && fiveShare >= 0.7) {
    signals.push({
      key: "rating-five-heavy", label: "Ratings cluster at five stars", family: "rating",
      severity: fiveShare >= 0.85 ? "strong" : "notable", confidence: round(Math.min(0.9, fiveShare)),
      observed: `${Math.round(fiveShare * 100)}% of ${rated.length} rated reviews are five stars; only ${Math.round(lowShare * 100)}% are one or two stars.`,
      benign: "A genuinely excellent product sold to happy customers can legitimately have very few low ratings.",
      concern: "Inflation campaigns and suppression of negative reviews create the same shape.",
      evidenceIds: rated.filter((r) => r.rating === 5).slice(0, 6).map((r) => r.id),
    });
  }

  /* --- 4. Author concentration --- */
  const byAuthor = new Map<string, Prepared[]>();
  prepared.forEach((p) => {
    const list = byAuthor.get(p.review.author) || [];
    list.push(p);
    byAuthor.set(p.review.author, list);
  });
  const heavy = [...byAuthor.entries()].filter(([, rs]) => rs.length >= 3).sort((a, b) => b[1].length - a[1].length);
  if (heavy.length) {
    const [author, rs] = heavy[0];
    signals.push({
      key: "identity-concentration", label: "Several reviews share one author", family: "identity",
      severity: rs.length >= 6 ? "strong" : "watch", confidence: round(Math.min(0.8, rs.length / 12)),
      observed: `Author "${author}" appears ${rs.length} times (${Math.round((rs.length / count) * 100)}% of all reviews).`,
      benign: "Enthusiastic customers do write multiple reviews, and shared names are common.",
      concern: "A small set of accounts producing many reviews can indicate an organised campaign.",
      evidenceIds: rs.slice(0, 8).map((p) => p.review.id),
    });
  }

  /* --- 5. Verification metadata --- */
  const withVerified = reviews.filter((r) => r.verified !== null);
  if (withVerified.length >= 8) {
    const unverified = withVerified.filter((r) => r.verified === false);
    const share = unverified.length / withVerified.length;
    if (share >= 0.35) {
      signals.push({
        key: "verification-low", label: "Many reviews lack purchase verification", family: "verification",
        severity: share >= 0.6 ? "notable" : "watch", confidence: round(Math.min(0.85, share)),
        observed: `${Math.round(share * 100)}% of ${withVerified.length} reviews with verification data are marked unverified.`,
        benign: "Some platforms do not verify purchases at all, and verified badges are not proof of honesty.",
        concern: "A high unverified share is one of the most cited signals in fake-review research.",
        evidenceIds: unverified.slice(0, 6).map((r) => r.id),
      });
    }
  }

  /* --- 6. Substance (works on AI-written text) --- */
  const lowSubstance = prepared.filter((p) => {
    if (p.words.length < 15) return false;
    const specificity = (p.lower.match(/\b\d+(\.\d+)?\s*(ml|g|kg|cm|mm|oz|%|w|mah|hours?|days?|weeks?|months?)\b/g) || []).length;
    const detail = DETAIL.filter((d) => p.lower.includes(d)).length;
    const scene = SCENE.filter((s) => p.lower.includes(s)).length;
    const pronouns = p.words.filter((w) => ["i", "me", "my", "we", "our"].includes(w)).length;
    const extremity = [...POSITIVE, ...NEGATIVE].filter((x) => p.lower.includes(x)).length;
    const substance = specificity * 2 + detail - scene * 1.5 - extremity * 0.5 - pronouns * 0.1;
    return substance < 1.5;
  });
  if (lowSubstance.length >= 3) {
    signals.push({
      key: "text-low-substance", label: "Some reviews lack concrete detail", family: "text",
      severity: lowSubstance.length >= 8 ? "notable" : "watch", confidence: round(Math.min(0.75, lowSubstance.length / count)),
      observed: `${lowSubstance.length} of ${count} reviews are long but contain few measurements, product specifics, or first-hand details.`,
      benign: "Short on detail is not the same as dishonest — many people simply write brief, emotional reviews.",
      concern: "Generated or template reviews often sound positive but describe no specific experience.",
      evidenceIds: lowSubstance.slice(0, 6).map((p) => p.review.id),
    });
  }

  /* --- 7. Rating / text mismatch --- */
  const mismatch = prepared.filter((p) => {
    const r = p.review;
    if (r.rating < 1 || r.rating > 5) return false;
    const pos = POSITIVE.filter((x) => p.lower.includes(x)).length;
    const neg = NEGATIVE.filter((x) => p.lower.includes(x)).length;
    return (r.rating >= 4 && neg > pos + 1) || (r.rating <= 2 && pos > neg + 1);
  });
  if (mismatch.length >= 2) {
    signals.push({
      key: "rating-text-mismatch", label: "Some star ratings disagree with the text", family: "rating",
      severity: "watch", confidence: round(Math.min(0.7, mismatch.length / count)),
      observed: `${mismatch.length} reviews use strongly worded sentiment that runs opposite to their star rating.`,
      benign: "People often praise one feature while rating the whole product poorly, or write ironically.",
      concern: "Rating and text drifting apart can be a sign of copy-pasted or incentive-driven content.",
      evidenceIds: mismatch.slice(0, 6).map((p) => p.review.id),
    });
  }

  /* Clean average: exclude EVERY review behind the three strongest
   * text/rating signals, not just the capped display IDs (P0-8). The full
   * list is exported as `excludedIds` so the figure is reproducible. */
  const flagged = new Set<string>(dupes.ids);
  lowSubstance.forEach((p) => flagged.add(p.review.id));
  mismatch.forEach((p) => flagged.add(p.review.id));
  const excludedIds = [...flagged];
  const cleanPool = rated.filter((r) => !flagged.has(r.id));
  const cleanAverage = cleanPool.length >= 5 ? round(cleanPool.reduce((s, r) => s + r.rating, 0) / cleanPool.length) : null;

  const limits = [
    "These are observations, not verdicts. No review is declared fake or real.",
    "We cannot verify who bought what, see IP addresses, or read private account history.",
    "A benign explanation is shown for every signal — always read it before drawing a conclusion.",
    "Confidence describes the strength of the measured pattern, not the probability of manipulation.",
    "AI-written reviews may pass every statistical check. Substance signals reduce but do not remove this risk.",
    "Results depend entirely on the data you provide; the tool never fetches reviews from any platform.",
    "Each signal caps its displayed review IDs; the full exclusion set is exported as excludedIds.",
  ];

  return { count, average, cleanAverage, distribution, excluded: excludedIds.length, excludedIds, signals, limits };
}
