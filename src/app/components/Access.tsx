import Link from "next/link";
import { ArrowUpRight, Cpu } from "lucide-react";

export default function Access() {
  return (
    <section id="access" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div className="absolute right-[-10%] top-[-40%] h-[600px] w-[600px] rounded-full bg-acid/30 blur-[130px]" />

      <div className="container-edge relative py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">06 / Try it</p>
            <h2 className="mt-6 font-serif text-[54px] leading-[0.96] sm:text-[76px]">
              Buy with
              <br />
              <span className="mark">better eyes.</span>
            </h2>
            <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-muted">
              No sign-up, no email, no waitlist. Open the workbench, paste a set of reviews,
              and see the evidence for yourself. Everything runs in your browser.
            </p>
          </div>

          <div className="border-2 border-ink bg-paper p-8 sm:p-10">
            <div className="flex items-center gap-2">
              <Cpu size={18} />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Forensics workbench v0.1</span>
            </div>
            <ul className="mt-6 space-y-3 text-[14px] text-muted">
              {[
                "Seven measurable signals, each with a benign explanation",
                "Adjusted average with the excluded review IDs visible",
                "Landed-cost calculator across three offers",
                "Export a report with full methodology attached",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-acid-dim">↳</span>{t}</li>
              ))}
            </ul>
            <Link href="/workbench" className="btn-solid mt-8 w-full justify-between">
              Open the workbench <ArrowUpRight size={18} />
            </Link>
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
              No account · No data leaves your device
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
