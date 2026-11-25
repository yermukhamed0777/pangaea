import type { Review, Analysis, Signal } from "./types";

/* ------------------------------------------------------------------ *
 * PANGAEA forensics engine v0.1
 *
 * Design rule: this engine NEVER says a review is fake. It reports
 * measurable observations, a confidence in the *signal*, and the
 * benign explanation beside the concerning one. See RESEARCH_BRIEF.md.
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

function words(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s%.-]/g, " ").split(/\s+/).filter(Boolean);
}

function contentWords(text: string): string[] {
  return words(text).filter((w) => w.length > 2 && !STOP.has(w));
}

function ngrams(text: string, n = 5): Set<string> {
  const toks = contentWords(text);
  const out = new Set<string>();
  for (let i = 0; i <= toks.length - n; i++) out.add(toks.slice(i, i + n).join(" "));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  a.forEach((v) => { if (b.has(v)) inter++; });
  return inter / (a.size + b.size - inter);
}

function daysBetween(a: string, b: string): number {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000;
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
        date: parts[1] && !isNaN(Date.parse(parts[1])) ? parts[1] : null,
        author: parts[2] || `anon-${i + 1}`,
        text: parts.slice(3).join(" | "),
        verified: null,
      };
    }
    return { id: `r${i + 1}`, rating: 0, date: null, author: `anon-${i + 1}`, verified: null, text: line };
  });
}

export function analyze(reviews: Review[]): Analysis {
  const signals: Signal[] = [];
  const count = reviews.length;
  const rated = reviews.filter((r) => r.rating >= 1 && r.rating <= 5);
  const average = rated.length ? round(rated.reduce((s, r) => s + r.rating, 0) / rated.length) : 0;
  const distribution = [1, 2, 3, 4, 5].map((n) => rated.filter((r) => r.rating === n).length);

  /* --- 1. Temporal bursts --- */
  const dated = reviews.filter((r) => r.date).sort((a, b) => (a.date! < b.date! ? -1 : 1));
  if (dated.length >= 8) {
    const span = Math.max(1, daysBetween(dated[0].date!, dated[dated.length - 1].date!));
    const expected = (dated.length * 7) / span;
    let peak = { start: dated[0].date!, n: 0, ids: [] as string[] };
    for (let i = 0; i < dated.length; i++) {
      const window = dated.filter((r) => daysBetween(dated[i].date!, r.date!) <= 7);
      if (window.length > peak.n) peak = { start: dated[i].date!, n: window.length, ids: window.map((r) => r.id) };
    }
    const ratio = expected > 0 ? peak.n / expected : 0;
    if (ratio >= 2.2 && peak.n >= 5) {
      signals.push({
        key: "timing-burst", label: "Review timing is uneven", family: "timing",
        severity: ratio >= 4 ? "strong" : "notable", confidence: round(Math.min(0.95, ratio / 6)),
        observed: `${peak.n} reviews fall within 7 days of ${peak.start}; about ${round(expected, 1)} would be expected if reviews were evenly spread across the ${round(span)} days.`,
        benign: "A launch, restock, sale, or a popular video can genuinely produce a real spike of reviews.",
        concern: "Coordinated review campaigns also produce bursts that are dense and tightly packed.",
        evidenceIds: peak.ids.slice(0, 8),
      });
    }
  }

  /* --- 2. Near-duplicate text --- */
  const grams = reviews.map((r) => ({ id: r.id, text: r.text, set: ngrams(r.text) }));
  const dupes: { a: string; b: string; sim: number }[] = [];
  for (let i = 0; i < grams.length; i++) {
    for (let j = i + 1; j < grams.length; j++) {
      const sim = jaccard(grams[i].set, grams[j].set);
      if (sim >= 0.55) dupes.push({ a: grams[i].id, b: grams[j].id, sim: round(sim) });
    }
  }
  if (dupes.length) {
    dupes.sort((a, b) => b.sim - a.sim);
    const top = dupes.slice(0, 5);
    signals.push({
      key: "text-duplicates", label: "Repeated wording across reviews", family: "text",
      severity: dupes.length > 6 ? "strong" : "notable", confidence: round(Math.min(0.9, top[0].sim)),
      observed: `${dupes.length} review pairs share at least 55% of their 5-word sequences; closest pair ${top[0].sim * 100}% similar.`,
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
  const byAuthor = new Map<string, Review[]>();
  reviews.forEach((r) => byAuthor.set(r.author, [...(byAuthor.get(r.author) || []), r]));
  const heavy = [...byAuthor.entries()].filter(([, rs]) => rs.length >= 3).sort((a, b) => b[1].length - a[1].length);
  if (heavy.length) {
    const [author, rs] = heavy[0];
    signals.push({
      key: "identity-concentration", label: "Several reviews share one author", family: "identity",
      severity: rs.length >= 6 ? "strong" : "watch", confidence: round(Math.min(0.8, rs.length / 12)),
      observed: `Author "${author}" appears ${rs.length} times (${Math.round((rs.length / count) * 100)}% of all reviews).`,
      benign: "Enthusiastic customers do write multiple reviews, and shared names are common.",
      concern: "A small set of accounts producing many reviews can indicate an organised campaign.",
      evidenceIds: rs.slice(0, 8).map((r) => r.id),
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
  const lowSubstance = reviews.filter((r) => {
    const ws = words(r.text);
    if (ws.length < 15) return false;
    const lower = r.text.toLowerCase();
    const specificity = (lower.match(/\b\d+(\.\d+)?\s*(ml|g|kg|cm|mm|oz|%|w|mah|hours?|days?|weeks?|months?)\b/g) || []).length;
    const detail = DETAIL.filter((d) => lower.includes(d)).length;
    const scene = SCENE.filter((s) => lower.includes(s)).length;
    const pronouns = ws.filter((w) => ["i", "me", "my", "we", "our"].includes(w)).length;
    const extremity = [...POSITIVE, ...NEGATIVE].filter((p) => lower.includes(p)).length;
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
      evidenceIds: lowSubstance.slice(0, 6).map((r) => r.id),
    });
  }

  /* --- 7. Rating / text mismatch --- */
  const mismatch = reviews.filter((r) => {
    if (r.rating < 1 || r.rating > 5) return false;
    const lower = r.text.toLowerCase();
    const pos = POSITIVE.filter((p) => lower.includes(p)).length;
    const neg = NEGATIVE.filter((p) => lower.includes(p)).length;
    return (r.rating >= 4 && neg > pos + 1) || (r.rating <= 2 && pos > neg + 1);
  });
  if (mismatch.length >= 2) {
    signals.push({
      key: "rating-text-mismatch", label: "Some star ratings disagree with the text", family: "rating",
      severity: "watch", confidence: round(Math.min(0.7, mismatch.length / count)),
      observed: `${mismatch.length} reviews use strongly worded sentiment that runs opposite to their star rating.`,
      benign: "People often praise one feature while rating the whole product poorly, or write ironically.",
      concern: "Rating and text drifting apart can be a sign of copy-pasted or incentive-driven content.",
      evidenceIds: mismatch.slice(0, 6).map((r) => r.id),
    });
  }

  /* Clean average: exclude reviews flagged by the three strongest text/rating signals */
  const flagged = new Set<string>();
  ["text-duplicates", "text-low-substance", "rating-text-mismatch"].forEach((k) => {
    const s = signals.find((x) => x.key === k);
    if (s) s.evidenceIds.forEach((id) => flagged.add(id));
  });
  const cleanPool = rated.filter((r) => !flagged.has(r.id));
  const cleanAverage = cleanPool.length >= 5 ? round(cleanPool.reduce((s, r) => s + r.rating, 0) / cleanPool.length) : null;

  const limits = [
    "These are observations, not verdicts. No review is declared fake or real.",
    "We cannot verify who bought what, see IP addresses, or read private account history.",
    "A benign explanation is shown for every signal — always read it before drawing a conclusion.",
    "Confidence describes the strength of the measured pattern, not the probability of manipulation.",
    "AI-written reviews may pass every statistical check. Substance signals reduce but do not remove this risk.",
    "Results depend entirely on the data you provide; the tool never fetches reviews from any platform.",
  ];

  const score = signals.length === 0 ? 0 : Math.min(100, Math.round(signals.reduce((s, x) => s + x.confidence * 20, 0)));

  return { count, average, cleanAverage, distribution, excluded: flagged.size, signals, score, limits };
}
