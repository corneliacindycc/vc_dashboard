"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { PageMasthead } from "@/components/PageMasthead";
import { StatusBadge } from "@/components/ui";
import { TEAM } from "@/data/constants";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";
import type { TeamMember, ValueCreationOpportunity, VcCategory, VcPriority, VcStatus } from "@/lib/types";

const CATS: VcCategory[] = [
  "Capital",
  "Partnerships",
  "Market Expansion",
  "Talent",
  "GTM / Marketing",
  "Strategic",
];

export default function PortfolioDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, updateValueCreation, addValueCreation } = useDemoStore();
  const pf = state.portfolio.find((p) => p.id === id);
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState<VcCategory>("Strategic");

  if (!pf) notFound();
  const c = providers.companies.get(pf.companyId);
  if (!c) notFound();
  const items = state.valueCreation.filter((v) => v.portfolioCompanyId === id);

  const suggestions = items.filter((v) => v.status === "Identified");

  return (
    <>
      <PageMasthead title={c.name} subtitle={c.oneLiner} meta={`${c.country} · ${c.sector} · ${pf.fund}`} />
      <div className="mx-auto max-w-[1400px] px-8 py-16 md:px-12">
        <section className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="display text-3xl">Company overview</h2>
            <p className="mt-4">{c.description}</p>
            <p className="mt-2 text-sm text-ink/60">
              Website:{" "}
              <a className="text-brand" href={c.website}>
                {c.website}
              </a>
            </p>
            <p className="text-sm text-ink/60">Investment date: {pf.investmentDate} · Stage: {pf.investmentStage}</p>
            <p className="mt-2 text-xs text-ink/40">{c.source}. {pf.notes}</p>
          </div>
          <div className="border border-black/10 bg-white p-6">
            <p className="text-[11px] uppercase tracking-wide text-ink/50">Portfolio opportunities · AI suggests, humans execute</p>
            <ul className="mt-4 space-y-3 text-sm">
              {suggestions.length === 0 && <li>No open suggestions.</li>}
              {suggestions.map((s) => (
                <li key={s.id}>
                  {s.description} Potential action: {s.nextAction}
                  {s.synthetic ? " (Demo)" : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="display text-4xl">How can we help?</h2>
          {CATS.map((category) => {
            const list = items.filter((v) => v.category === category);
            return (
              <div key={category} className="mt-10 border-t border-black/10 pt-6">
                <h3 className="text-xl font-semibold">{category}</h3>
                {list.length === 0 && <p className="mt-2 text-sm text-ink/50">None on file.</p>}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {list.map((v) => (
                    <OpportunityEditor key={v.id} item={v} onChange={(patch) => updateValueCreation(v.id, patch)} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-16 border border-black/10 bg-white p-6">
          <h3 className="font-semibold">Add support opportunity</h3>
          <select className="mt-3 rounded-xl border px-3 py-2 text-sm" value={cat} onChange={(e) => setCat(e.target.value as VcCategory)}>
            {CATS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <textarea
            className="mt-3 w-full rounded-2xl border px-3 py-2"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe the support action"
          />
          <button
            type="button"
            className="btn btn-blue mt-3"
            onClick={() => {
              if (!desc.trim()) return;
              addValueCreation({
                portfolioCompanyId: id,
                category: cat,
                description: desc.trim(),
                priority: "Medium",
                owner: "Cindy",
                status: "Identified",
                relatedContact: "",
                nextAction: "Triage",
                dueDate: new Date().toISOString().slice(0, 10),
                notes: "Added in demo session.",
                synthetic: true,
              });
              setDesc("");
            }}
          >
            Add opportunity
          </button>
        </section>
      </div>
    </>
  );
}

function OpportunityEditor({
  item,
  onChange,
}: {
  item: ValueCreationOpportunity;
  onChange: (patch: Partial<ValueCreationOpportunity>) => void;
}) {
  return (
    <article className="border border-black/10 p-4">
      <p>{item.description}</p>
      {item.synthetic && <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">Synthetic demo data</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge>{item.priority}</StatusBadge>
        <StatusBadge tone="info">{item.status}</StatusBadge>
      </div>
      <p className="mt-2 text-sm">Owner {item.owner} · Due {item.dueDate}</p>
      <p className="text-sm text-ink/60">{item.nextAction}</p>
      <div className="mt-3 flex gap-2">
        <select
          className="rounded-lg border px-2 py-1 text-xs"
          value={item.status}
          onChange={(e) => onChange({ status: e.target.value as VcStatus })}
        >
          {["Identified", "Planned", "In Progress", "Completed", "Dismissed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="rounded-lg border px-2 py-1 text-xs"
          value={item.priority}
          onChange={(e) => onChange({ priority: e.target.value as VcPriority })}
        >
          {["Critical", "High", "Medium", "Low"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="rounded-lg border px-2 py-1 text-xs"
          value={item.owner}
          onChange={(e) => onChange({ owner: e.target.value as TeamMember })}
        >
          {TEAM.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </article>
  );
}
