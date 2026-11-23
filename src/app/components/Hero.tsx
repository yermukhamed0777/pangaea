"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Asterisk, Check, X } from "lucide-react";
import Link from "next/link";

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function AnalysisSheet() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -1.2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* paper stack behind */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-ink/90 bg-acid/40" />
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border-2 border-ink bg-paper" />

      <div className="relative border-2 border-ink bg-paper">
        {/* header */}
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
          <div className="flex items-center gap-2">
            <Asterisk size={16} strokeWidth={2.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">verification sheet</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">demo · synthetic</span>
        </div>

        {/* score block */}
        <div className="grid grid-cols-[auto_1fr] gap-5 border-b-2 border-ink px-5 py-5">
          <div className="flex flex-col items-center justify-center border-r-2 border-line pr-5">
            <span className="font-serif text-[76px] leading-[0.85]">38</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted mt-1">trust index</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-serif text-[22px] leading-tight">
              “Derma Calm SPF 50 Sun Fluid”
            </p>
            <div className="mt-3 inline-flex w-fit items-center gap-2 bg-coral px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-paper">
              <X size={11} strokeWidth={3} /> Do not buy
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted">1,204 reviews · 4 shops · 6 signals</p>
          </div>
        </div>

        {/* findings */}
        <div className="grid grid-cols-2 divide-x-2 divide-line">
          <div className="p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted mb-3">What holds up</p>
            <ul className="space-y-2.5">
              {["Lightweight texture", "No white cast", "Fair price at source"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12px] leading-snug">
                  <Check size={13} className="mt-[1px] shrink-0" strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted mb-3">What doesn&apos;t</p>
            <ul className="space-y-2.5">
              {["312 reviews in one day", "Same phrase × 84", "Seller rating inflated"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12px] leading-snug">
                  <X size={13} className="mt-[1px] shrink-0 text-coral" strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t-2 border-ink bg-acid px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Same formula elsewhere</span>
          <span className="font-serif text-[20px]">− 68%</span>
        </div>
      </div>

      {/* floating tag */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 -top-6 hidden sm:flex items-center gap-2 border-2 border-ink bg-paper px-3 py-2 shadow-[4px_4px_0_#111110]"
      >
        <span className="h-2 w-2 rounded-full bg-coral animate-pulse" />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em]">3 fake bursts found</span>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div className="absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-acid/30 blur-[120px]" />

      <div className="container-edge relative grid min-h-[calc(100vh-72px)] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <motion.div custom={0} variants={rise} initial="hidden" animate="show">
            <span className="eyebrow inline-flex items-center gap-2 border border-ink px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              Independent shopping intelligence
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-8 font-serif text-[58px] leading-[0.95] tracking-[-0.02em] sm:text-[76px] lg:text-[86px]"
          >
            Know what
            <br />
            you&apos;re <span className="mark">buying.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-[540px] text-[17px] leading-relaxed text-muted sm:text-[19px]"
          >
            Star ratings lie. PANGAEA reads what people actually wrote, catches the
            patterns machines leave behind, and shows you the same product for less —
            before you pay.
          </motion.p>

          <motion.div
            custom={3}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/workbench" className="btn-solid">
              Open workbench <ArrowDownRight size={16} />
            </Link>
            <a href="#method" className="btn-outline">
              See the method
            </a>
          </motion.div>

          <motion.div
            custom={4}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6"
          >
            {["No sponsored results", "Works on 5 marketplaces", "Private by default"].map((t) => (
              <span key={t} className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                ↳ {t}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <AnalysisSheet />
        </div>
      </div>

      {/* ticker */}
      <div className="overflow-hidden border-y-2 border-ink bg-ink text-paper">
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0">
              {[
                "Sentiment mapping",
                "Burst detection",
                "Seller verification",
                "Cross-shop matching",
                "Price history",
                "Bundle math",
              ].map((t) => (
                <span key={`${dup}-${t}`} className="ticker-item flex items-center gap-6">
                  {t} <Asterisk size={13} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
