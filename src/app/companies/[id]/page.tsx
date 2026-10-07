"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PageMasthead } from "@/components/PageMasthead";
import { CompanyActions } from "@/components/OpportunityCard";
import { EvidencePanel } from "@/components/EvidencePanel";
import { FitScore, LogoMark, OriginTag, StatusBadge } from "@/components/ui";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";

export default function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const company = providers.companies.get(id);
  const { state } = useDemoStore();
  if (!company) notFound();
  const founders = providers.companies.founders(id);
  const funding = providers.companies.funding(id);
  const signals = providers.companies.signals(id);
  const evidence = providers.companies.evidence(id);
  const override = state.overrides[id];

  return (
    <>
      <PageMasthead title={company.name} subtitle={company.oneLiner} meta={`${company.country} · ${company.stage} · ${company.sector}`}>
        <CompanyActions companyId={id} />
      </PageMasthead>
      <div className="mx-auto max-w-[1400px] px-8 py-16 md:px-12">
        <div className="flex items-start gap-4">
          <LogoMark initials={company.logoInitials} />
          <div>
            <OriginTag origin={company.origin} />
            <p className="mt-2 max-w-3xl text-lg leading-relaxed">{company.description}</p>
            <p className="mt-2 text-sm text-ink/60">
              {company.city} · Founded {company.foundedYear} · {company.businessModel}
            </p>
            <a className="text-brand" href={company.website} target="_blank" rel="noreferrer">
              {company.website}
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="display text-3xl">Founders</h2>
              {founders.length === 0 ? (
                <p className="mt-4 text-ink/50">Not disclosed / Not found</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {founders.map((f) => (
                    <li key={f.id} className="border border-black/10 bg-white p-5">
                      <p className="font-semibold">
                        {f.name} · {f.role}
                      </p>
                      <p className="mt-2 text-sm">{f.bio}</p>
                      <p className="mt-2 text-sm text-ink/60">
                        Previous: {f.previousCompanies.join(", ") || "Not disclosed"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <h2 className="display text-3xl">Funding</h2>
              {funding.length === 0 ? (
                <p className="mt-4 text-ink/50">Not disclosed</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {funding.map((r) => (
                    <li key={r.id} className="border-b border-black/10 py-3">
                      {r.date} · {r.roundType} · {r.amount} {r.currency === "USD" ? "" : r.currency} · {r.investors.join(", ")} · {r.source}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <h2 className="display text-3xl">Market signals</h2>
              <ul className="mt-4 space-y-2">
                {signals.length === 0 && <li className="text-ink/50">None on file</li>}
                {signals.map((s) => (
                  <li key={s.id}>
                    <StatusBadge tone="info">{s.signalType}</StatusBadge>
                    <span className="ml-2">
                      {s.description} {s.synthetic ? "(Demo signal)" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="display text-3xl">Evidence</h2>
              <div className="mt-4">
                <EvidencePanel items={evidence} />
              </div>
            </section>
          </div>
          <aside className="space-y-6 border border-black/10 bg-white p-6">
            <FitScore score={override?.score ?? company.opportunityScore} />
            {override && (
              <p className="text-sm">
                Analyst override {override.score}/100 by {override.by}. {override.reason}
              </p>
            )}
            <p className="text-sm text-ink/70">{company.whyItMatters}</p>
            <p className="text-xs text-ink/50">{company.source}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
