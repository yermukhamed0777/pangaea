"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    q: "It caught a textbook burst of five-star reviews on a product I was about to buy. I checked the dates — all within one hour. Sold me.",
    who: "M. Artyomova",
    role: "Early tester · Almaty",
  },
  {
    q: "The same bottle was 40% cheaper from a different shop once shipping was counted. That alone paid for the whole idea.",
    who: "D. Sakenov",
    role: "Beta user · Astana",
  },
  {
    q: "Finally, a tool that shows its receipts. Every flag links to the actual review. I don't have to trust a number blindly.",
    who: "A. Volkova",
    role: "Researcher · Prague",
  },
];

export default function Voices() {
  return (
    <section className="border-y-2 border-ink bg-ink text-paper">
      <div className="container-edge py-24 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">05 / From testers</p>
            <h2 className="mt-4 font-serif text-[46px] leading-none sm:text-[60px]">People who read the receipts.</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">unedited · private beta</span>
        </div>

        <div className="mt-14 grid gap-px bg-paper/20 md:grid-cols-3">
          {quotes.map((item, i) => (
            <motion.figure
              key={item.who}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col bg-ink p-8 sm:p-10"
            >
              <span className="font-serif text-[64px] leading-[0.5] text-acid">“</span>
              <blockquote className="mt-6 font-serif text-[22px] leading-[1.35] sm:text-[24px]">
                {item.q}
              </blockquote>
              <figcaption className="mt-auto pt-10 border-t border-paper/20">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em]">{item.who}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/40">{item.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
