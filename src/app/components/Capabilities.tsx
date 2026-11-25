"use client";

import { motion } from "framer-motion";

const features = [
  {
    tag: "Signal",
    title: "Sentiment, decoded",
    text: "Not positive or negative — specific. PANGAEA tells you that 60 people loved the texture and 22 hated the cap.",
    visual: (
      <div className="space-y-2">
        {[
          { l: "Texture", v: 88 },
          { l: "Packaging", v: 64 },
          { l: "Longevity", v: 41 },
        ].map((r) => (
          <div key={r.l} className="flex items-center gap-3">
            <span className="w-20 font-mono text-[9px] uppercase tracking-wider text-muted">{r.l}</span>
            <div className="h-2 flex-1 border border-ink">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${r.v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-acid"
              />
            </div>
            <span className="w-7 text-right font-mono text-[9px]">{r.v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Integrity",
    title: "Manipulation, exposed",
    text: "Burst timing, copy-paste phrases, and repeated author names — surfaced with the evidence attached.",
    visual: (
      <div className="flex h-[76px] items-end gap-1">
        {[12, 14, 11, 16, 13, 15, 88, 92, 84, 95, 78, 14, 12, 10, 16].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
            className={`flex-1 border-b-0 ${h > 50 ? "bg-coral" : "bg-ink/20"}`}
          />
        ))}
      </div>
    ),
  },
  {
    tag: "Economics",
    title: "The price, unpacked",
    text: "Shipping, duties, bundles and subscription traps folded into one honest number. Then matched across shops.",
    visual: (
      <div className="space-y-2 font-mono text-[11px]">
        {[
          ["Listed", "42.00", ""],
          ["Shipping", "+ 8.50", ""],
          ["Duty", "+ 4.20", ""],
          ["Elsewhere", "29.90", "bg-acid"],
        ].map(([l, v, hl]) => (
          <div key={l} className={`flex justify-between border-b border-line pb-1.5 ${hl}`}>
            <span className="uppercase tracking-wider">{l}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Proof",
    title: "Every claim, sourced",
    text: "Tap any conclusion and land on the exact review, timestamp, or listing that produced it. No vague scores.",
    visual: (
      <div className="space-y-2 font-mono text-[10px]">
        <div className="flex items-center gap-2 border border-ink p-2">
          <span className="bg-acid px-1.5 py-0.5 text-[9px]">SOURCE</span>
          <span className="truncate">review ID · evidence list</span>
        </div>
        <div className="flex items-center gap-2 border border-ink p-2">
          <span className="bg-acid px-1.5 py-0.5 text-[9px]">SOURCE</span>
          <span className="truncate">offer · landed-cost row</span>
        </div>
      </div>
    ),
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="border-y-2 border-ink bg-paper">
      <div className="container-edge py-24 sm:py-28">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">03 / Capabilities</p>
            <h2 className="mt-4 font-serif text-[46px] leading-none sm:text-[64px]">Built for the skeptical.</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">v.02 — early build</span>
        </div>

        <div className="grid gap-px bg-line md:grid-cols-2">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="flex flex-col bg-paper p-8 sm:p-10"
            >
              <span className="w-fit border border-ink px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]">
                {f.tag}
              </span>
              <h3 className="mt-7 font-serif text-[32px] leading-tight sm:text-[38px]">{f.title}</h3>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-muted">{f.text}</p>
              <div className="mt-10 border-t-2 border-ink pt-6">{f.visual}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
