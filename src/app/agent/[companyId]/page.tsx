"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageMasthead } from "@/components/PageMasthead";
import { EvidencePanel } from "@/components/EvidencePanel";
import { CompanyActions } from "@/components/OpportunityCard";
import { ClaimLabel, FitScore, StatusBadge } from "@/components/ui";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";
import { TEAM } from "@/data/constants";
import type { DiligenceReport, TeamMember } from "@/lib/types";

// CUSTOMIZE: INA model API — this list is fake progress. The pack already comes from providers.diligence.getByCompany.
const STEPS = [
  "Reading uploaded documents",
  "Extracting company information",
  "Researching founders",
  "Mapping market",
  "Mapping competitors",
  "Reviewing financials",
  "Running investment-fit screen",
  "Identifying diligence gaps",
  "Preparing analyst brief",
];

const TABS = [
  "Executive Summary",
  "Company",
  "Founders",
  "Market",
  "Product & Technology",
  "Competition",
  "Traction & Financials",
  "Investment Fit",
  "Risks",
  "DD Checklist",
  "Founder Questions",
  "Sources",
] as const;

function KV({ data }: { data: Record<string, string> }) {
  return (
    <dl className="divide-y divide-black/10">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 gap-4 py-3">
          <dt className="text-sm capitalize text-ink/50">{k}</dt>
          <dd className="col-span-2">{v || "Not disclosed"}</dd>
        </div>
      ))}
    </dl>
  );
}

function Report({ report, companyId }: { report: DiligenceReport; companyId: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Executive Summary");
  const { state, overrideScore, saveAnalysis, addToTeamReview, reviewFor } = useDemoStore();
  const evidence = providers.companies.evidence(companyId);
  const override = state.overrides[companyId];
  const [score, setScore] = useState(override?.score ?? report.fit.overall);
  const [reason, setReason] = useState(override?.reason ?? "");
  const [who, setWho] = useState<TeamMember>("Cindy");
  const existing = reviewFor(companyId);

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-12 md:px-12">
      <div className="flex flex-wrap gap-3">
        <Link href={`/agent/${companyId}`} className="btn">
          Re-run analysis
        </Link>
        <Link href="/agent" className="btn">
          Upload more documents
        </Link>
        <button type="button" className="btn" onClick={() => saveAnalysis(companyId)}>
          Save analysis
        </button>
        {existing ? (
          <Link href={`/review/${companyId}`} className="btn btn-dark">
            Open Review
          </Link>
        ) : (
          <button type="button" className="btn btn-add" onClick={() => addToTeamReview(companyId)}>
            Add to Team Review
          </button>
        )}
        <button
          type="button"
          className="btn"
          onClick={() => window.print()}
        >
          Export report
        </button>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-black/10 pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm ${tab === t ? "bg-brand text-white" : "hover:bg-white"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "Executive Summary" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <p className="text-[11px] uppercase tracking-wide text-ink/50">Preliminary AI analysis — not a team decision</p>
              <h2 className="display text-4xl">{report.recommendation}</h2>
              <p>
                <ClaimLabel kind="AI INTERPRETATION" />
                This is an automated assessment. The investment team owns the decision.
              </p>
              <h3 className="text-lg font-semibold">Investment thesis</h3>
              <ol className="list-decimal space-y-2 pl-5">
                {report.thesis.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
              <h3 className="text-lg font-semibold">Why now?</h3>
              <p>{report.whyNow}</p>
              <h3 className="text-lg font-semibold">Key risks</h3>
              <ul className="list-disc pl-5">
                {report.risks.slice(0, 5).map((r) => (
                  <li key={r.category}>
                    {r.category} · {r.level} — {r.explanation}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="border border-black/10 bg-white p-6">
              <FitScore score={override?.score ?? report.fit.overall} />
              <p className="mt-2 text-sm">Confidence: {report.fit.confidence}</p>
              <p className="mt-4 text-sm">
                <span className="font-medium">Positives.</span> {report.positives.join("; ")}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Negatives.</span> {report.negatives.join("; ")}
              </p>
              {report.depth === "shallow" && (
                <p className="mt-4 text-sm">Shallow screen only. Hero companies have full packs.</p>
              )}
              <div className="mt-6 border-t border-black/10 pt-4">
                <p className="text-sm font-medium">Analyst override</p>
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
                <textarea
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                  placeholder="Override reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <select className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" value={who} onChange={(e) => setWho(e.target.value as TeamMember)}>
                  {TEAM.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn mt-3 h-11 min-h-11 text-sm"
                  onClick={() => overrideScore(companyId, score, reason, who)}
                >
                  Save override
                </button>
              </div>
            </aside>
            <div className="lg:col-span-3">
              <h3 className="display text-3xl">What we don’t know</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {(["critical", "important", "niceToHave"] as const).map((k) => (
                  <div key={k} className="border border-black/10 p-4">
                    <p className="text-sm font-semibold capitalize">{k === "niceToHave" ? "Nice to have" : k}</p>
                    <ul className="mt-2 list-disc pl-4 text-sm">
                      {report.missing[k].map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "Company" && <KV data={report.company} />}
        {tab === "Founders" && (
          <div className="space-y-6">
            {report.founders.length === 0 && <p>Not disclosed / Not found</p>}
            {report.founders.map((f) => (
              <article key={f.name} className="border border-black/10 bg-white p-6">
                <h3 className="font-semibold">
                  {f.name} · {f.role}
                </h3>
                <p className="mt-2">{f.assessment}</p>
                <p className="mt-2 text-sm">Founder-market fit: {f.founderMarketFit}</p>
                <p className="mt-2 text-sm">Strengths: {f.strengths.join("; ")}</p>
                <p className="text-sm">Potential weaknesses: {f.weaknesses.join("; ")}</p>
              </article>
            ))}
          </div>
        )}
        {tab === "Market" && <KV data={report.market} />}
        {tab === "Product & Technology" && <KV data={report.product} />}
        {tab === "Competition" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    {["Name", "Product", "Customer", "Geography", "Pricing", "Tech", "Funding", "Traction", "Differentiation"].map((h) => (
                      <th key={h} className="py-2 pr-4 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.competition.rows.map((r) => (
                    <tr key={r.name} className="border-b border-black/10">
                      <td className="py-2 pr-4">{r.name}</td>
                      <td>{r.product}</td>
                      <td>{r.customer}</td>
                      <td>{r.geography}</td>
                      <td>{r.pricing}</td>
                      <td>{r.technology}</td>
                      <td>{r.funding}</td>
                      <td>{r.traction}</td>
                      <td>{r.differentiation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6">
              <ClaimLabel kind="AI INTERPRETATION" />
              {report.competition.takeaway}
            </p>
          </div>
        )}
        {tab === "Traction & Financials" && <KV data={report.traction} />}
        {tab === "Investment Fit" && (
          <div>
            <p className="text-sm text-ink/60">{report.fit.publicCriteriaNote}</p>
            <table className="mt-6 w-full text-left">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="py-2">Dimension</th>
                  <th>Score</th>
                  <th>Confidence</th>
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {report.fit.dimensions.map((d) => (
                  <tr key={d.key} className="border-b border-black/10 text-sm">
                    <td className="py-2">{d.label}</td>
                    <td>
                      {d.score}/{d.max}
                    </td>
                    <td>{d.confidence}</td>
                    <td>{d.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 display text-4xl">Overall {override?.score ?? report.fit.overall}/100</p>
            <p className="mt-4">
              <span className="font-medium">What is driving the score?</span> {report.fit.driving.join("; ")}
            </p>
            <p className="mt-2">
              <span className="font-medium">What is dragging the score down?</span> {report.fit.dragging.join("; ")}
            </p>
            <p className="mt-4">{report.fit.rationale}</p>
          </div>
        )}
        {tab === "Risks" && (
          <ul className="space-y-4">
            {report.risks.map((r) => (
              <li key={r.category} className="border border-black/10 bg-white p-5">
                <StatusBadge tone={r.level === "High" ? "risk" : "attention"}>
                  {r.category} · {r.level}
                </StatusBadge>
                <p className="mt-3">{r.explanation}</p>
                <p className="mt-2 text-sm text-ink/60">Evidence: {r.evidence}</p>
                <p className="text-sm">Mitigation: {r.mitigation}</p>
                <p className="text-sm">Unresolved: {r.unresolvedQuestion}</p>
              </li>
            ))}
          </ul>
        )}
        {tab === "DD Checklist" && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-2">Priority</th>
                <th>Item</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Next</th>
              </tr>
            </thead>
            <tbody>
              {report.checklist.map((i) => (
                <tr key={i.id} className="border-b border-black/10">
                  <td className="py-2">{i.category}</td>
                  <td>{i.item}</td>
                  <td>{i.status}</td>
                  <td>{i.evidence}</td>
                  <td>{i.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "Founder Questions" && (
          <ul className="space-y-4">
            {report.founderQuestions.map((q) => (
              <li key={q.question}>
                <p className="text-xs uppercase tracking-wide text-ink/50">{q.category}</p>
                <p className="text-lg">{q.question}</p>
              </li>
            ))}
          </ul>
        )}
        {tab === "Sources" && (
          <div className="space-y-8">
            <ul className="space-y-2">
              {report.sources.map((s) => (
                <li key={s.title}>
                  {s.title} · {s.type} · {s.date}{" "}
                  {s.url && (
                    <a className="text-brand" href={s.url}>
                      {s.url}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <h3 className="display text-3xl">Evidence</h3>
            <EvidencePanel items={evidence} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentRunPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const company = providers.companies.get(companyId);
  const report = providers.diligence.getByCompany(companyId);
  const { saveAnalysis } = useDemoStore();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!company) return;
    if (done) return;
    if (step >= STEPS.length) {
      setDone(true);
      if (!savedRef.current) {
        savedRef.current = true;
        saveAnalysis(companyId);
      }
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 420);
    return () => clearTimeout(t);
  }, [step, done, company, companyId, saveAnalysis]);

  if (!company) notFound();

  return (
    <>
      <PageMasthead
        title={company.name}
        subtitle="Preliminary AI analysis. Human judgment remains the final decision-maker."
        meta="Demo · no live browsing · curated sources only"
      />
      {!done && (
        <div className="mx-auto max-w-[720px] px-8 py-16">
          <p className="text-sm text-ink/50">Simulated research process</p>
          <ul className="mt-6 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="w-6">{i < step ? "✓" : i === step ? "·" : ""}</span>
                <span className={i < step ? "" : "text-ink/40"}>{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink/60">
            This prototype does not browse the live web. When complete, it loads the pre-generated file for this company.
          </p>
        </div>
      )}
      {done && report && <Report report={report} companyId={companyId} />}
      {done && !report && (
        <div className="mx-auto max-w-[720px] px-8 py-16">
          <p className="text-lg">No pre-generated diligence pack for this company.</p>
          <p className="mt-2 text-ink/60">
            The demo includes fuller public-source screens for Grab, Ninja Van and Carousell, plus shallow screens for a few others.
          </p>
          <CompanyActions companyId={companyId} />
        </div>
      )}
    </>
  );
}
