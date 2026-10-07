"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";

export function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const { state } = useDemoStore();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) {
          /* parent opens */
        }
      }
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return { companies: [], notes: [] };
    const companies = providers.companies.list().filter((c) => {
      const founders = providers.companies
        .founders(c.id)
        .map((f) => f.name)
        .join(" ");
      const blob = `${c.name} ${c.sector} ${c.country} ${c.oneLiner} ${c.description} ${founders}`.toLowerCase();
      return query.split(/\s+/).every((t) => blob.includes(t));
    });
    const notes = state.notes.filter((n) => n.text.toLowerCase().includes(query));
    return { companies: companies.slice(0, 8), notes: notes.slice(0, 5) };
  }, [q, state.notes]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={onClose}>
      <div
        className="mx-auto mt-24 max-w-xl rounded-2xl bg-paper p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search companies, founders, sectors, notes…"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none"
        />
        {q && results && (
          <div className="mt-3 max-h-80 overflow-y-auto text-sm">
            {results.companies.length === 0 && results.notes.length === 0 && (
              <p className="px-2 py-4 text-ink/60">No matches. Try another keyword or clear filters on Deal Radar.</p>
            )}
            {results.companies.map((c) => (
              <Link
                key={c.id}
                href={`/companies/${c.id}`}
                onClick={onClose}
                className="block rounded-xl px-3 py-2 hover:bg-white"
              >
                <span className="font-medium">{c.name}</span>
                <span className="ml-2 text-ink/50">
                  {c.country} · {c.sector} · {c.stage}
                </span>
              </Link>
            ))}
            {results.notes.map((n) => (
              <Link
                key={n.id}
                href={`/review/${n.companyId}`}
                onClick={onClose}
                className="block rounded-xl px-3 py-2 text-ink/70 hover:bg-white"
              >
                Note · {n.author}: {n.text.slice(0, 80)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
