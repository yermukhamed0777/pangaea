"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

type Status = "idle" | "done";

export default function Access() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setStatus("done");
  }

  return (
    <section id="access" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div className="absolute right-[-10%] top-[-40%] h-[600px] w-[600px] rounded-full bg-acid/30 blur-[130px]" />

      <div className="container-edge relative py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">06 / Early access</p>
            <h2 className="mt-6 font-serif text-[54px] leading-[0.96] sm:text-[76px]">
              Buy with
              <br />
              <span className="mark">better eyes.</span>
            </h2>
            <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-muted">
              We&apos;re opening PANGAEA to a small group. Leave an address and we&apos;ll send
              an invite when there&apos;s room — nothing else, ever.
            </p>
          </div>

          <div className="border-2 border-ink bg-paper p-8 sm:p-10">
            {status === "done" ? (
              <div className="flex flex-col items-start gap-4 py-6">
                <span className="flex h-12 w-12 items-center justify-center bg-acid">
                  <Check size={24} strokeWidth={2.5} />
                </span>
                <div className="font-serif text-[34px] leading-tight">You&apos;re on the list.</div>
                <p className="text-[14px] text-muted">We&apos;ll be in touch at {email}.</p>
                <button
                  onClick={() => { setStatus("idle"); setEmail(""); }}
                  className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] underline"
                >
                  Use another address
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <label htmlFor="email" className="eyebrow">Your email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="field mt-3 font-serif !text-[24px]"
                />
                {error && <p className="mt-2 font-mono text-[10px] text-coral">{error}</p>}
                <button type="submit" className="btn-solid mt-8 w-full justify-between">
                  Request an invite <ArrowUpRight size={18} />
                </button>
                <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  No spam · No sharing · Unsubscribe anytime
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
