"use client";

import Link from "next/link";
import { useState } from "react";
import { PageMasthead } from "@/components/PageMasthead";
import { StatusBadge } from "@/components/ui";
import { REVIEW_COLUMNS } from "@/data/constants";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";
import type { ReviewStatus } from "@/lib/types";

const PIPELINE_HEADER: Record<ReviewStatus, string> = {
  New: "bg-slate-600",
  Reviewing: "bg-brand",
  "Founder Meeting": "bg-teal-700",
  "Due Diligence": "bg-amber-700",
  "Investment Committee": "bg-violet-700",
  Watchlist: "bg-orange-600",
  Pass: "bg-rose-800",
  Invested: "bg-emerald-700",
};

export default function ReviewBoard() {
  const { state, updateReview } = useDemoStore();
  const [view, setView] = useState<"kanban" | "table">("kanban");

  return (
    <>
      <PageMasthead
        title="TEAM REVIEW"
        subtitle="Let’s get cooking, team!"
      >
        <div className="flex gap-3">
          <button type="button" className={view === "kanban" ? "btn" : "btn btn-ghost"} onClick={() => setView("kanban")}>
            Pipeline
          </button>
          <button type="button" className={view === "table" ? "btn" : "btn btn-ghost"} onClick={() => setView("table")}>
            Table
          </button>
        </div>
      </PageMasthead>
      <div className="mx-auto max-w-[1600px] px-6 py-12">
        {view === "kanban" ? (
          <div className="flex gap-3 overflow-x-auto pb-6">
            {REVIEW_COLUMNS.map((col) => {
              const items = state.reviews.filter((r) => r.status === col);
              return (
                <section key={col} className="w-64 shrink-0 rounded-2xl bg-black/[0.03] p-2">
                  <h2
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-white ${PIPELINE_HEADER[col]}`}
                  >
                    <span>{col}</span>
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-white px-1.5 text-xs font-semibold text-brand">
                      {items.length}
                    </span>
                  </h2>
                  <div className="mt-2 space-y-2">
                    {items.map((r) => {
                      const c = providers.companies.get(r.companyId);
                      return (
                        <article key={r.id} className="border border-black/10 bg-white p-4">
                          <p className="font-medium">{c?.name}</p>
                          <p className="text-xs text-ink/50">
                            {c?.sector} · {c?.country} · {c?.stage}
                          </p>
                          <p className="mt-2 text-sm">Fit {c?.opportunityScore}</p>
                          <p className="text-sm">Owner {r.owner} · Conviction {r.conviction}/5</p>
                          <p className="text-sm text-ink/60">Next: {r.nextAction}</p>
                          <select
                            className="mt-2 w-full rounded-lg border border-black/10 px-2 py-1 text-xs"
                            value={r.status}
                            onChange={(e) => {
                              const status = e.target.value as ReviewStatus;
                              if (status === "Invested") {
                                updateReview(r.companyId, { status });
                              } else {
                                updateReview(r.companyId, { status });
                              }
                            }}
                          >
                            {REVIEW_COLUMNS.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <Link href={`/review/${r.companyId}`} className="mt-2 inline-block text-sm text-brand">
                            Open Review
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10">
                {["Company", "Fit", "Owner", "Conviction", "Status", "Next", "Updated"].map((h) => (
                  <th key={h} className="py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.reviews.map((r) => {
                const c = providers.companies.get(r.companyId);
                return (
                  <tr key={r.id} className="border-b border-black/10">
                    <td className="py-2">
                      <Link className="text-brand" href={`/review/${r.companyId}`}>
                        {c?.name}
                      </Link>
                    </td>
                    <td>{c?.opportunityScore}</td>
                    <td>{r.owner}</td>
                    <td>{r.conviction}/5</td>
                    <td>
                      <StatusBadge>{r.status}</StatusBadge>
                    </td>
                    <td>{r.nextAction}</td>
                    <td>{r.updatedAt.slice(0, 10)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
