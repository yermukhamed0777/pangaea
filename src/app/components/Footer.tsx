export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className="container-edge py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center bg-ink font-serif text-[26px] leading-none text-acid">p</span>
              <span className="font-serif text-[32px] tracking-tight">pangaea</span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted">
              Independent shopping intelligence. Read what people actually wrote.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["Method", "#method"],
              ["Capabilities", "#capabilities"],
              ["Evidence", "#evidence"],
              ["Access", "#access"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-ink">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">© 2026 PANGAEA — open tools</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Built for the skeptical</span>
        </div>
      </div>
    </footer>
  );
}
