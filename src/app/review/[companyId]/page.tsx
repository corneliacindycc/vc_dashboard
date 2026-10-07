"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageMasthead } from "@/components/PageMasthead";
import { FitScore } from "@/components/ui";
import { REVIEW_COLUMNS, TEAM } from "@/data/constants";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";
import type { Decision, NextAction, ReviewStatus, TeamMember } from "@/lib/types";

const NEXT: NextAction[] = [
  "Research further",
  "Contact founder",
  "Request information",
  "Schedule meeting",
  "Introduce to partner",
  "Move to DD",
  "Pass",
  "Watch",
];

export default function ReviewDetail({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const company = providers.companies.get(companyId);
  const { reviewFor, notesFor, updateReview, addNote, setDecision, markInvested, addToTeamReview } =
    useDemoStore();
  const review = reviewFor(companyId);
  const notes = notesFor(companyId);
  const [note, setNote] = useState("");
  const [author, setAuthor] = useState<TeamMember>("Cindy");
  const [rationale, setRationale] = useState(review?.decisionRationale ?? "");
  const [decision, setDec] = useState<Decision>(review?.decision ?? null);

  if (!company) notFound();

  if (!review) {
    return (
      <>
        <PageMasthead title={company.name} subtitle="Not yet in Team Review." />
        <div className="px-12 py-16">
          <button type="button" className="btn btn-add" onClick={() => addToTeamReview(companyId)}>
            Add to Team Review
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMasthead
        title={company.name}
        subtitle="Human judgment layer. AI does not decide."
      >
        <div className="flex flex-wrap gap-3">
          <Link href={`/agent/${companyId}`} className="btn">
            Open Diligence
          </Link>
          <Link href={`/companies/${companyId}`} className="btn btn-ghost">
            Company profile
          </Link>
        </div>
      </PageMasthead>
      <div className="mx-auto grid max-w-[1400px] gap-12 px-8 py-16 lg:grid-cols-3 md:px-12">
        <div className="space-y-5 lg:col-span-2">
          <label className="block text-sm">Analyst / Owner</label>
          <select
            className="w-full rounded-xl border border-black/10 px-3 py-2"
            value={review.owner}
            onChange={(e) => updateReview(companyId, { owner: e.target.value as TeamMember })}
          >
            {TEAM.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <label className="block text-sm">Status</label>
          <select
            className="w-full rounded-xl border border-black/10 px-3 py-2"
            value={review.status}
            onChange={(e) => {
              const status = e.target.value as ReviewStatus;
              updateReview(companyId, { status });
              if (status === "Invested") markInvested(companyId);
            }}
          >
            {REVIEW_COLUMNS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <label className="block text-sm">Conviction 1–5</label>
          <input
            type="number"
            min={1}
            max={5}
            className="w-full rounded-xl border px-3 py-2"
            value={review.conviction}
            onChange={(e) => updateReview(companyId, { conviction: Number(e.target.value) })}
          />
          <label className="block text-sm">Analyst thesis — why could this become a strong investment?</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 px-3 py-2"
            rows={4}
            value={review.thesis}
            onChange={(e) => updateReview(companyId, { thesis: e.target.value })}
          />
          <label className="block text-sm">Why now?</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 px-3 py-2"
            rows={3}
            value={review.whyNow}
            onChange={(e) => updateReview(companyId, { whyNow: e.target.value })}
          />
          <label className="block text-sm">Key concerns</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 px-3 py-2"
            rows={3}
            value={review.concerns}
            onChange={(e) => updateReview(companyId, { concerns: e.target.value })}
          />
          <label className="block text-sm">What would change my mind?</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 px-3 py-2"
            rows={3}
            value={review.whatChangesMyMind}
            onChange={(e) => updateReview(companyId, { whatChangesMyMind: e.target.value })}
          />
          <label className="block text-sm">Recommended next action</label>
          <select
            className="w-full rounded-xl border px-3 py-2"
            value={review.nextAction}
            onChange={(e) => updateReview(companyId, { nextAction: e.target.value as NextAction })}
          >
            {NEXT.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <label className="block text-sm">Next action date</label>
          <input
            type="date"
            className="w-full rounded-xl border px-3 py-2"
            value={review.nextActionDate.slice(0, 10)}
            onChange={(e) => updateReview(companyId, { nextActionDate: e.target.value })}
          />

          <section className="border-t border-black/10 pt-8">
            <h2 className="display text-3xl">Decision</h2>
            <select
              className="mt-4 w-full rounded-xl border px-3 py-2"
              value={decision ?? ""}
              onChange={(e) => setDec((e.target.value || null) as Decision)}
            >
              <option value="">Select</option>
              <option>Advance</option>
              <option>Hold</option>
              <option>Pass</option>
              <option>Invest</option>
            </select>
            <textarea
              required
              className="mt-3 w-full rounded-2xl border px-3 py-2"
              rows={3}
              placeholder="Decision rationale (required)"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-blue mt-4"
              onClick={() => {
                if (!decision || !rationale.trim()) {
                  alert("Decision and rationale are required for an auditable history.");
                  return;
                }
                setDecision(companyId, decision, rationale);
              }}
            >
              Record decision
            </button>
          </section>
        </div>
        <aside>
          <FitScore score={company.opportunityScore} />
          <h2 className="mt-10 display text-3xl">Team notes</h2>
          <p className="mt-2 text-sm text-ink/50">Append-only. Previous notes are never overwritten.</p>
          <textarea
            className="mt-4 w-full rounded-2xl border px-3 py-2 text-sm"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <select className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" value={author} onChange={(e) => setAuthor(e.target.value as TeamMember)}>
            {TEAM.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn mt-3 h-11 min-h-11 text-sm"
            onClick={() => {
              if (!note.trim()) return;
              addNote(companyId, author, note.trim());
              setNote("");
            }}
          >
            Add note
          </button>
          <ul className="mt-6 space-y-4">
            {notes.map((n) => (
              <li key={n.id} className="border-b border-black/10 pb-3 text-sm">
                <p className="font-medium">
                  {n.author} · {new Date(n.createdAt).toLocaleString()}
                </p>
                <p className="mt-1">{n.text}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
