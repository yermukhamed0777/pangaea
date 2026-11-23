"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "The problem", href: "#problem" },
  { label: "Method", href: "#method" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Evidence", href: "#evidence" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-ink/15 bg-paper/95 backdrop-blur" : "border-transparent bg-paper"
      }`}
    >
      <div className="container-edge flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-ink text-acid font-serif text-[22px] leading-none">
            p
          </span>
          <span className="font-serif text-[26px] tracking-tight">pangaea</span>
          <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-[0.2em] text-muted mt-1">
            / intelligence
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#access" className="hidden sm:inline-flex btn-solid !px-5 !py-3">
            Request access
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="lg:hidden flex flex-col gap-[5px] p-2"
          >
            <span className="block h-[2px] w-6 bg-ink" />
            <span className="block h-[2px] w-6 bg-ink" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-paper">
          <div className="container-edge flex flex-col py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-mono text-[12px] uppercase tracking-[0.12em] border-b border-line"
              >
                {l.label}
              </a>
            ))}
            <a href="#access" onClick={() => setOpen(false)} className="mt-4 btn-solid justify-center">
              Request access
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
