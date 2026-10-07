"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageMasthead } from "@/components/PageMasthead";
import { OpportunityCard } from "@/components/OpportunityCard";
import { KpiCard } from "@/components/ui";
import { GEOGRAPHIES, SECTORS, SIGNALS, STAGES } from "@/data/constants";
import { providers } from "@/lib/providers";
import { useSeedMeta } from "@/lib/store";
import type { FitBand } from "@/lib/types";

export default function RadarInner() {
  const params = useSearchParams();
  const seed = useSeedMeta();
  const all = providers.opportunities.radarCompanies();
  const [q, setQ] = useState("");
  const [geo, setGeo] = useState<string>(params.get("country") ?? "");
  const [stage, setStage] = useState("");
  const [sector, setSector] = useState(params.get("sector") ?? "");
  const [signal, setSignal] = useState("");
  const [fit, setFit] = useState(params.get("fit") ?? "");

  const filtered = useMemo(() => {
    return all.filter((c) => {
      const text = `${c.name} ${c.oneLiner} ${c.sector} ${c.country} ${c.knownInvestors.join(" ")} ${providers.companies.founders(c.id).map((f) => f.name).join(" ")}`.toLowerCase();
      if (q && !q.toLowerCase().split(/\s+/).every((t) => text.includes(t))) return false;
      if (geo && c.country !== geo) return false;
      if (stage && c.stage !== stage) return false;
      if (sector && c.sector !== sector) return false;
      if (fit && c.fitBand !== fit) return false;
      if (signal) {
        const sigs = providers.companies.signals(c.id);
        if (!sigs.some((s) => s.signalType === signal)) return false;
      }
      return true;
    });
  }, [all, q, geo, stage, sector, fit, signal]);

  const clear = () => {
    setQ("");
    setGeo("");
    setStage("");
    setSector("");
    setSignal("");
    setFit("");
  };

  return (
    <>
      <PageMasthead
        title="APAC DEAL RADAR"
        subtitle="Discover companies, founders, technologies and market signals across APAC."
        meta={`Public-source ingest · ${seed.morningBrief.lastRefresh}`}
      />
      <div className="mx-auto max-w-[1400px] px-8 py-16 md:px-12">
        <div className="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard href="/radar" label="Total opportunities" value={all.length} />
          <KpiCard href="/radar" label="New this week" value={seed.morningBrief.newCount} />
          <KpiCard href="/radar?fit=High" label="High-fit" value={all.filter((c) => c.fitBand === "High").length} />
          <KpiCard href="/review" label="Under review" value={all.filter((c) => c.pipelineStatus !== "Tracked" && c.pipelineStatus !== "New opportunity").length} />
          <KpiCard href="/radar" label="Emerging themes" value={seed.emergingThemes.length} />
        </div>

        <section className="mt-16 border border-black/10 bg-white p-8">
          <p className="text-[11px] uppercase tracking-wide text-ink/50">APAC morning brief · public ingest</p>
          <h2 className="mt-2 text-2xl font-semibold">{seed.morningBrief.topSignal}</h2>
          <p className="mt-4 text-sm text-ink/60">
            {seed.morningBrief.processed} signals processed · {seed.morningBrief.relevant} relevant · {seed.morningBrief.newCount} new · {seed.morningBrief.highPriority} high-priority
          </p>
          <p className="mt-4 text-ink/80">{seed.morningBrief.analystAttention}</p>
          <p className="mt-2 text-sm">New: {seed.morningBrief.newOpportunities.join(" · ")}</p>
        </section>

        <div className="mt-12 space-y-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search companies, founders, sectors, keywords…"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm" value={geo} onChange={(e) => setGeo(e.target.value)}>
              <option value="">Geography</option>
              {GEOGRAPHIES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm" value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="">Stage</option>
              {STAGES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm" value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="">Sector</option>
              {SECTORS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm" value={signal} onChange={(e) => setSignal(e.target.value)}>
              <option value="">Signals</option>
              {SIGNALS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm" value={fit} onChange={(e) => setFit(e.target.value)}>
              <option value="">Fit</option>
              {(["High", "Medium", "Low", "Not assessed"] as FitBand[]).map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <button type="button" className="text-sm text-brand" onClick={clear}>
              Clear filters
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 border border-black/10 p-12">
            <p className="text-lg">No companies match your current filters.</p>
            <button type="button" className="btn mt-6" onClick={clear}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {filtered.map((c) => (
              <OpportunityCard
                key={c.id}
                company={c}
                signal={providers.companies.signals(c.id)[0]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
