"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FlaskConical, Info, Play, Trash2 } from "lucide-react";
import { analyze } from "../../lib/engine";
import { parseReviews, type ImportFormat } from "../../lib/imports";
import { compareOffers, savingPercent } from "../../lib/cost";
import { demoReviews, demoText } from "../../lib/sample";
import type { Offer } from "../../lib/types";

const INITIAL_OFFERS: Offer[] = [
  { shop: "Shop A", price: 42, units: 1, shipping: 8.5, dutyPct: 8, vatPct: 12 },
  { shop: "Shop B", price: 34, units: 2, shipping: 6, dutyPct: 8, vatPct: 12 },
  { shop: "Shop C", price: 29.9, units: 1, shipping: 12, dutyPct: 0, vatPct: 12 },
];

export default function Workbench() {
  const [text, setText] = useState("");
  const [ran, setRan] = useState(false);
  const [format, setFormat] = useState<ImportFormat>("pipe");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState(() => analyze(demoReviews()));
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [openSignal, setOpenSignal] = useState<string | null>("timing-burst");

  const costs = useMemo(() => compareOffers(offers), [offers]);
  const saving = useMemo(() => savingPercent(costs), [costs]);

  function run(input = text) {
    const parsed = parseReviews(input);
    setFormat(parsed.format);
    setError(parsed.error);
    const reviews = parsed.reviews.length ? parsed.reviews : demoReviews();
    setAnalysis(analyze(reviews));
    setRan(!parsed.error);
  }

  function loadDemo() {
    setText(demoText());
    run(demoText());
  }

  function exportReport() {
    const payload = {
      product: "PANGAEA forensics report",
      generated: new Date().toISOString(),
      notice: "Observations only. No review is declared fake or real.",
      analysis,
      costs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pangaea-report.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function updateOffer(i: number, key: keyof Offer, value: string) {
    setOffers((prev) => prev.map((o, idx) => idx === i ? { ...o, [key]: key === "shop" ? value : Number(value) || 0 } : o));
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="container-edge flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center bg-ink font-serif text-[22px] leading-none text-acid">p</span>
            <span className="font-serif text-[26px] tracking-tight">pangaea</span>
            <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-[0.2em] text-muted mt-1">/ workbench</span>
          </Link>
          <button onClick={exportReport} className="inline-flex items-center gap-2 border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-acid">
            <Download size={14} /> Export report
          </button>
        </div>
      </header>

      <div className="container-edge py-12">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6">
          <div>
            <p className="eyebrow">Forensics workbench · v0.1</p>
            <h1 className="mt-3 font-serif text-[46px] leading-none sm:text-[64px]">Evidence, not verdicts.</h1>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted">
              Paste reviews and see measurable patterns, each with the innocent explanation beside the concerning one.
              Nothing leaves your browser. This tool never labels a review fake or real.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-ink">
            <ArrowLeft size={14} /> Back to site
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* INPUT */}
          <section className="space-y-6">
            <div className="border-2 border-ink bg-paper">
              <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">01 · Review data</span>
                <span className="font-mono text-[9px] text-muted">{format} · local only</span>
              </div>
              <div className="p-5">
                <label htmlFor="reviews" className="eyebrow">One review per line</label>
                <textarea
                  id="reviews"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={14}
                  placeholder={"5 | 2026-03-02 | author | The texture is light and absorbs in 20 seconds."}
                  className="mt-3 w-full resize-y border border-line bg-white/40 p-3 font-mono text-[11px] leading-relaxed outline-none focus:border-ink"
                />
                <p className="mt-2 font-mono text-[9px] leading-relaxed text-muted">
                  Formats: <code>rating | date | author | text</code>, CSV (rating,date,author,text,verified),
                  JSON (<code>[ ... ]</code>) or plain text. Metadata is optional; fewer signals are then available.
                </p>
                <div className="mt-4">
                  <label htmlFor="review-file" className="eyebrow">Or load a local file</label>
                  <input
                    id="review-file"
                    type="file"
                    accept=".csv,.json,.txt,text/csv,application/json,text/plain"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const content = await file.text();
                      setText(content);
                      run(content);
                      e.target.value = "";
                    }}
                    className="mt-2 block w-full font-mono text-[10px] text-muted file:border file:border-ink file:bg-paper file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.1em] file:text-ink"
                  />
                  <p className="mt-1 font-mono text-[9px] text-muted">Read in your browser only — never uploaded.</p>
                </div>
                {error && (
                  <p role="alert" className="mt-3 border-l-2 border-coral pl-3 font-mono text-[10px] leading-relaxed text-coral">
                    {error}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => run()} className="btn-solid !px-5 !py-3">
                    <Play size={14} /> Analyze
                  </button>
                  <button onClick={loadDemo} className="btn-outline !px-5 !py-3">
                    <FlaskConical size={14} /> Demo data
                  </button>
                  <button onClick={() => { setText(""); setRan(false); }} className="inline-flex items-center gap-2 border border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:border-ink hover:text-ink">
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
                {ran && <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-acid-dim">Analysis complete</p>}
              </div>
            </div>

            {/* COST CALCULATOR */}
            <div className="border-2 border-ink">
              <div className="border-b-2 border-ink bg-ink px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper">02 · Landed cost</span>
              </div>
              <div className="space-y-4 p-5">
                {offers.map((o, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 border-b border-line pb-4 sm:grid-cols-4">
                    <label className="col-span-2 font-mono text-[9px] uppercase text-muted">
                      Shop {i + 1}
                      <input value={o.shop} onChange={(e) => updateOffer(i, "shop", e.target.value)} className="mt-1 w-full border-b border-ink bg-transparent py-1 text-[13px] text-ink outline-none" />
                    </label>
                    {([
                      ["price", "Price"],
                      ["units", "Units"],
                      ["shipping", "Shipping"],
                      ["dutyPct", "Duty %"],
                      ["vatPct", "VAT %"],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="font-mono text-[9px] uppercase text-muted">
                        {label}
                        <input type="number" step="0.1" value={o[key] as number} onChange={(e) => updateOffer(i, key, e.target.value)} className="mt-1 w-full border-b border-ink bg-transparent py-1 font-mono text-[12px] text-ink outline-none" />
                      </label>
                    ))}
                  </div>
                ))}
                <div className="bg-acid px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">
                  Best per unit: {costs[0]?.shop} · {costs[0]?.perUnit} · saving {saving}% vs worst
                </div>
                <div className="space-y-1">
                  {costs.map((c, i) => (
                    <div key={c.shop} className="flex items-center justify-between border-b border-line py-2 text-[12px]">
                      <span>{i === 0 ? "★ " : ""}{c.shop}</span>
                      <span className="font-mono">item {c.itemCost} + duty {c.duty} + VAT {c.vat} + ship {c.shipping} = <strong>{c.total}</strong> ({c.perUnit}/unit)</span>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[9px] leading-relaxed text-muted">
                  Duty and VAT vary by country and category. Enter your own rates. No external tax lookup.
                </p>
              </div>
            </div>
          </section>

          {/* RESULTS */}
          <section className="space-y-6">
            <div className="border-2 border-ink">
              <div className="border-b-2 border-ink px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">03 · Evidence ledger</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 gap-px bg-line">
                  {[
                    ["Reviews", analysis.count],
                    ["Average", analysis.average || "—"],
                    ["Adjusted", analysis.cleanAverage ?? "—"],
                    ["Signals", analysis.signals.length],
                  ].map(([l, v]) => (
                    <div key={l as string} className="bg-paper p-3">
                      <div className="font-serif text-[28px] leading-none">{v}</div>
                      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">{l}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-mono text-[9px] text-muted">
                  “Adjusted” removes only reviews surfaced by text/rating signals. It is an estimate, not a truth score.
                </p>

                <div className="mt-6 space-y-3">
                  {analysis.signals.length === 0 && (
                    <div className="border border-line p-6 text-center text-[13px] text-muted">
                      No signals crossed the threshold with this data. That is not proof of honesty — only that nothing stood out.
                    </div>
                  )}
                  {analysis.signals.map((s) => (
                    <div key={s.key} className="border border-ink">
                      <button
                        onClick={() => setOpenSignal(openSignal === s.key ? null : s.key)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-acid/20"
                      >
                        <span className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${s.severity === "strong" ? "bg-coral" : s.severity === "notable" ? "bg-ink" : "bg-line"}`} />
                          <span className="font-serif text-[18px]">{s.label}</span>
                        </span>
                        <span className="font-mono text-[9px] uppercase text-muted">{s.family} · {Math.round(s.confidence * 100)}%</span>
                      </button>
                      {openSignal === s.key && (
                        <div className="space-y-3 border-t border-line bg-white/40 p-4 text-[12px] leading-relaxed">
                          <p><strong className="font-mono text-[9px] uppercase tracking-wider text-muted">Observed</strong><br />{s.observed}</p>
                          <p className="border-l-2 border-acid pl-3"><strong className="font-mono text-[9px] uppercase tracking-wider">Benign explanation</strong><br />{s.benign}</p>
                          <p className="border-l-2 border-coral pl-3"><strong className="font-mono text-[9px] uppercase tracking-wider">Why it matters</strong><br />{s.concern}</p>
                          {s.evidenceIds.length > 0 && (
                            <p className="font-mono text-[9px] text-muted">Review IDs: {s.evidenceIds.join(", ")}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LIMITS */}
            <div className="border-2 border-ink bg-white/40 p-5">
              <div className="flex items-center gap-2">
                <Info size={15} />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">What we cannot know</span>
              </div>
              <ul className="mt-4 space-y-2 text-[12px] leading-relaxed text-muted">
                {analysis.limits.map((l) => <li key={l}>— {l}</li>)}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
