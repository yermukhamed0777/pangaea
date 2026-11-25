"use client";

import { motion } from "framer-motion";
import { ScanSearch, Fingerprint, Scale } from "lucide-react";

const steps = [
  {
    icon: ScanSearch,
    n: "I",
    title: "Read everything",
    body: "We parse every written review, not the average. Recurring praise, repeated complaints, and the words people actually use.",
    footnote: "1,204 reviews → 14 real themes (illustrative)",
  },
  {
    icon: Fingerprint,
    n: "II",
    title: "Find the fingerprints",
    body: "Timing clusters, duplicated sentences, thin accounts, and rating jumps. Patterns that look human until you line them up.",
    footnote: "312 reviews in 19 minutes → flagged (illustrative)",
  },
  {
    icon: Scale,
    n: "III",
    title: "Weigh the real cost",
    body: "Match the identical item across shops, add shipping and duty, then show what you'd actually pay today.",
    footnote: "Same formula → 68% less elsewhere (illustrative)",
  },
];

export default function Method() {
  return (
    <section id="method" className="container-edge py-24 sm:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6">
        <div>
          <p className="eyebrow">02 / Method</p>
          <h2 className="mt-4 font-serif text-[46px] leading-none sm:text-[64px]">Three passes. Evidence, not verdicts.</h2>
        </div>
        <p className="max-w-sm text-[14px] leading-relaxed text-muted">
          No black box. Every conclusion in a PANGAEA sheet links back to the review or
          listing that produced it.
        </p>
      </div>

      <div className="grid gap-px bg-line lg:grid-cols-3">
        {steps.map((s, i) => (
          <motion.article
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="group flex flex-col bg-paper p-8 sm:p-10"
          >
            <div className="flex items-start justify-between">
              <s.icon size={30} strokeWidth={1.5} />
              <span className="font-serif text-[48px] leading-none text-line">{s.n}</span>
            </div>
            <h3 className="mt-12 font-serif text-[34px] leading-tight sm:text-[40px]">{s.title}</h3>
            <p className="mt-5 text-[14px] leading-relaxed text-muted">{s.body}</p>
            <div className="mt-auto pt-10">
              <div className="border-t border-ink pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted group-hover:text-ink transition-colors">
                {s.footnote}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
