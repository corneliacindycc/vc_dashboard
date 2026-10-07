"use client";

import Link from "next/link";
import { useState } from "react";

export function DemoBadge() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl border border-white/25 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/90"
      >
        Demo environment
      </button>
      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-80 rounded-2xl bg-white p-4 text-ink shadow-none ring-1 ring-black/10">
          <p className="display text-sm">Prototype environment</p>
          <ul className="mt-3 space-y-1 text-sm text-ink/80">
            <li>Data: Wikipedia / official homepages (public ingest). Private metrics stay Not disclosed.</li>
            <li>AI: Simulated / pre-generated analysis workflows</li>
            <li>External APIs: Not connected</li>
            <li>Purpose: Demonstrate the investment workflow and product architecture</li>
          </ul>
          <div className="mt-4 border-t border-black/10 pt-3 text-xs text-ink/60">
            <p className="font-semibold text-ink">Current prototype</p>
            <p>Curated data · Simulated AI · Local demo documents</p>
            <p className="mt-2 font-semibold text-ink">Production version</p>
            <p>Live discovery · LLM/RAG · Scheduled refresh · CRM / portfolio integrations</p>
            <Link href="/readme" className="mt-3 inline-block text-sm text-brand" onClick={() => setOpen(false)}>
              Full README.md →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
