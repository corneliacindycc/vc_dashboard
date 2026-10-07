"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { LogoMark, StatusBadge } from "@/components/ui";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";

export default function PortfolioPage() {
  const { state } = useDemoStore();
  const [fund, setFund] = useState("");
  const [sector, setSector] = useState("");
  const [geo, setGeo] = useState("");
  const [status, setStatus] = useState("");

  const rows = useMemo(() => {
    return state.portfolio.filter((p) => {
      const c = providers.companies.get(p.companyId);
      if (!c) return false;
      if (fund && p.fund !== fund) return false;
      if (sector && c.sector !== sector) return false;
      if (geo && c.country !== geo) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  }, [state.portfolio, fund, sector, geo, status]);

  const funds = [...new Set(state.portfolio.map((p) => p.fund))];

  return (
    <>
      <PageMasthead
        title="PORTFOLIO"
        subtitle="How can the investment team create value after the cheque?"
      />
      <div className="mx-auto max-w-[1400px] px-8 py-16 md:px-12">
        <div className="flex flex-wrap gap-2">
          <select className="rounded-xl border px-3 py-2 text-sm" value={fund} onChange={(e) => setFund(e.target.value)}>
            <option value="">Fund</option>
            {funds.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <select className="rounded-xl border px-3 py-2 text-sm" value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="">Sector</option>
            {[...new Set(rows.map((p) => providers.companies.get(p.companyId)?.sector).filter(Boolean))].map((s) => (
              <option key={String(s)}>{s}</option>
            ))}
          </select>
          <select className="rounded-xl border px-3 py-2 text-sm" value={geo} onChange={(e) => setGeo(e.target.value)}>
            <option value="">Geography</option>
            {[...new Set(state.portfolio.map((p) => providers.companies.get(p.companyId)?.country).filter(Boolean))].map(
              (s) => (
                <option key={String(s)}>{s}</option>
              ),
            )}
          </select>
          <select className="rounded-xl border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status</option>
            <option>Invested</option>
            <option>Exited</option>
            <option>Partially Exited</option>
          </select>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {rows.map((p) => {
            const c = providers.companies.get(p.companyId)!;
            const attn = state.valueCreation.filter(
              (v) => v.portfolioCompanyId === p.id && !["Completed", "Dismissed"].includes(v.status),
            ).length;
            return (
              <Link key={p.id} href={`/portfolio/${p.id}`} className="border border-black/10 bg-white p-6 hover:border-brand">
                <div className="flex gap-4">
                  <LogoMark initials={c.logoInitials} />
                  <div>
                    <h2 className="text-lg font-semibold">{c.name}</h2>
                    <p className="text-sm text-ink/60">
                      {c.country} · {c.sector} · {p.fund}
                    </p>
                    <p className="mt-2 text-sm">{c.oneLiner}</p>
                    <div className="mt-3 flex gap-2">
                      <StatusBadge>{p.status}</StatusBadge>
                      {attn > 0 && (
                        <StatusBadge tone="attention">
                          {attn} support opportunit{attn === 1 ? "y" : "ies"}
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
