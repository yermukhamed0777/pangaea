"use client";

import { motion } from "framer-motion";

const claims = [
  { n: "01", title: "Review inflation", text: "A product jumps from 4.1 to 4.9 in a week. Two hundred new reviews, all five stars, all the same phrasing." },
  { n: "02", title: "Hidden cost", text: "The listing looks cheap until shipping, duty, and the “bundle” are added at checkout." },
  { n: "03", title: "Fake urgency", text: "Only three left — a counter that resets every time you refresh the page." },
];

export default function Problem() {
  return (
    <section id="problem" className="bg-ink text-paper">
      <div className="container-edge py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">01 / The problem</p>
            <h2 className="mt-6 font-serif text-[46px] leading-[0.98] sm:text-[60px]">
              The rating is
              <br />
              not the <span className="line-through decoration-coral decoration-4">truth</span>.
            </h2>
          </div>

          <div className="border-t border-paper/20">
            {claims.map((c, i) => (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid grid-cols-[48px_1fr] gap-6 border-b border-paper/20 py-8 sm:grid-cols-[80px_0.8fr_1.2fr] sm:gap-8"
              >
                <span className="font-mono text-[12px] text-acid">{c.n}</span>
                <h3 className="font-serif text-[26px] leading-tight sm:text-[32px]">{c.title}</h3>
                <p className="text-[14px] leading-relaxed text-paper/55 sm:text-[15px]">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-baseline gap-4 border-t border-paper/20 pt-8">
          <span className="font-serif text-[64px] leading-none text-acid sm:text-[92px]">78%</span>
          <p className="max-w-md text-[15px] leading-relaxed text-paper/60">
            of shoppers say they&apos;ve been misled by reviews. Most still buy anyway — because
            there&apos;s no better signal at hand.
          </p>
        </div>
      </div>
    </section>
  );
}
