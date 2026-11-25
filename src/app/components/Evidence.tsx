"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "2.4M", label: "Reviews parsed", note: "illustrative · not measured" },
  { value: "11k", label: "Listings checked", note: "illustrative · not measured" },
  { value: "38%", label: "Flagged as noisy", note: "illustrative · not measured" },
  { value: "20", label: "Synthetic demo reviews", note: "src/lib/sample.ts" },
];

export default function Evidence() {
  return (
    <section id="evidence" className="container-edge py-24 sm:py-28">
      <p className="eyebrow">04 / Illustrative prototype figures</p>
      <h2 className="mt-4 max-w-3xl font-serif text-[46px] leading-[1.02] sm:text-[62px]">
        Small team. Unreasonable amount of reading.
      </h2>

      <div className="mt-14 grid grid-cols-2 gap-px border-2 border-ink bg-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-paper p-6 sm:p-8"
          >
            <div className="font-serif text-[52px] leading-none sm:text-[64px]">{s.value}</div>
            <div className="mt-5 border-t border-ink pt-3">
              <div className="text-[14px] font-medium">{s.label}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{s.note}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 border-l-4 border-acid bg-acid/15 p-6 sm:flex-row sm:items-center sm:gap-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Note from us</span>
        <p className="text-[14px] leading-relaxed">
          These are demo figures from the prototype dataset. PANGAEA is in private testing —
          we publish real numbers only once the sample is large enough to mean something.
        </p>
      </div>
    </section>
  );
}
