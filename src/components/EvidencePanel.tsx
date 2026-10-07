"use client";

import { useState } from "react";
import type { Evidence } from "@/lib/types";
import { ClaimLabel } from "./ui";

export function EvidencePanel({ items }: { items: Evidence[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (items.length === 0) {
    return <p className="text-sm text-ink/50">No evidence records attached.</p>;
  }
  return (
    <div className="space-y-2">
      {items.map((e) => (
        <div key={e.id} className="border border-black/10 bg-white">
          <button
            type="button"
            className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left"
            onClick={() => setOpenId(openId === e.id ? null : e.id)}
          >
            <span>
              <ClaimLabel kind={e.kind} />
              {e.claim}
            </span>
            <span className="shrink-0 text-xs uppercase tracking-wide text-ink/40">
              View evidence
            </span>
          </button>
          {openId === e.id && (
            <div className="space-y-1 border-t border-black/10 px-4 py-3 text-sm text-ink/70">
              <p>Source: {e.source}</p>
              <p>Type: {e.sourceType} · {e.sourceDate}</p>
              <p>Confidence: {e.confidence}</p>
              {e.documentReference && <p>{e.documentReference}</p>}
              {e.snippet && <p className="italic">“{e.snippet}”</p>}
              {e.sourceUrl && (
                <a className="text-brand" href={e.sourceUrl} target="_blank" rel="noreferrer">
                  {e.sourceUrl}
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
