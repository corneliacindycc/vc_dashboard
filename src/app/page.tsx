"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { OpportunityCard } from "@/components/OpportunityCard";
import { KpiCard, StatusBadge } from "@/components/ui";
import { providers } from "@/lib/providers";
import { useDemoStore, useSeedMeta } from "@/lib/store";

function formatToday() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Singapore",
  }).format(new Date());
}

export default function OverviewPage() {
  const { state } = useDemoStore();
  const seed = useSeedMeta();
  const radar = providers.opportunities.radarCompanies();
  const highFit = radar.filter((c) => c.fitBand === "High").length;
  const newThisWeek = seed.morningBrief.newCount;
  const activeDd = state.reviews.filter((r) =>
    ["Due Diligence", "Investment Committee", "Founder Meeting"].includes(r.status),
  ).length;
  const attention = state.valueCreation.filter((v) =>
    ["Identified", "Planned", "In Progress"].includes(v.status),
  );

  const priority = useMemo(() => {
    return radar
      .filter((c) => c.hero || c.fitBand === "High")
      .slice(0, 6);
  }, [radar]);

  const tasks: { owner: string; companyId: string; label: string }[] = [];
  for (const r of state.reviews) {
    if (r.status === "Pass" || r.status === "Invested") continue;
    const c = providers.companies.get(r.companyId);
    tasks.push({
      owner: r.owner,
      companyId: r.companyId,
      label: `${r.nextAction} · ${c?.name ?? r.companyId}`,
    });
  }
  const tasksByOwner = tasks.reduce<Record<string, typeof tasks>>((acc, t) => {
    acc[t.owner] = [...(acc[t.owner] ?? []), t];
    return acc;
  }, {});

  return (
    <>
      <PageMasthead
        kicker="Internal · Demo environment"
        title={
          <>
            VENTURE CAPITAL
            <br />
            INTERNAL PIPELINE
          </>
        }
        subtitle="Good morning, team! Now grab a coffee; overnight signals, open reviews, and portfolio items are on the desk. Here’s what you missed:"
        meta={formatToday()}
      />

      <div className="mx-auto max-w-[1400px] px-8 py-16 md:px-12">
        <div className="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard href="/radar" label="Opportunities tracked" value={radar.length} />
          <KpiCard href="/radar" label="New opportunities" value={newThisWeek} hint="this week (simulated refresh)" />
          <KpiCard href="/radar?fit=High" label="High-fit opportunities" value={highFit} />
          <KpiCard href="/review" label="Team review" value={state.reviews.length} />
          <KpiCard href="/agent" label="Active diligence" value={activeDd} />
          <KpiCard href="/portfolio" label="Portfolio companies" value={state.portfolio.length} />
        </div>

        <section className="mt-20">
          <h2 className="display text-4xl">Priority opportunities</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {priority.map((c) => (
              <OpportunityCard
                key={c.id}
                company={c}
                signal={providers.companies.signals(c.id)[0]}
              />
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display text-4xl">Emerging signals</h2>
            <p className="mt-3 max-w-xl text-sm text-ink/60">
              This demo version does not actively crawl the live web. Theme deltas shown here are from a simulated
              refresh over the curated Deal Radar set. In production, this section can be set to crawl the web and
              refresh every morning, using whatever metrics the team configures.
            </p>
            <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
              {seed.emergingThemes.map((t) => (
                <li key={t.theme} className="py-5">
                  <Link
                    href={`/radar?sector=${encodeURIComponent(t.sector)}`}
                    className="flex items-baseline justify-between hover:text-brand"
                  >
                    <span className="text-lg font-medium">{t.theme}</span>
                    <span className="text-sm text-ink/60">{t.delta}</span>
                  </Link>
                  <p className="mt-2 text-xs text-ink/50">{t.method}</p>
                  <p className="mt-3 text-[11px] uppercase tracking-wide text-ink/40">Live articles (mockup)</p>
                  <ul className="mt-2 space-y-2">
                    {t.sources.map((s) => (
                      <li key={s.url} className="text-sm">
                        <span className="text-brand">{s.title}</span>
                        <span className="mt-0.5 block text-xs text-ink/45">{s.url}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-4xl">Team actions</h2>
            <div className="mt-8 space-y-3">
              {Object.entries(tasksByOwner).map(([owner, items]) => (
                <div key={owner} className="rounded-xl border border-black/15 bg-white p-4">
                  <p className="text-sm font-semibold">{owner}</p>
                  <ul className="mt-3 space-y-2 border-t border-black/10 pt-3">
                    {items.slice(0, 3).map((item) => (
                      <li key={item.companyId + item.label}>
                        <Link href={`/review/${item.companyId}`} className="text-ink/80 hover:text-brand">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="display text-4xl">Portfolio attention</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {attention.slice(0, 6).map((v) => {
              const pf = state.portfolio.find((p) => p.id === v.portfolioCompanyId);
              const c = pf ? providers.companies.get(pf.companyId) : undefined;
              return (
                <Link
                  key={v.id}
                  href={pf ? `/portfolio/${pf.id}` : "/portfolio"}
                  className="border border-black/10 bg-white p-5 hover:border-brand"
                >
                  <p className="text-sm text-ink/50">{c?.name}</p>
                  <p className="mt-1 font-medium">{v.description}</p>
                  <div className="mt-3">
                    <StatusBadge tone="attention">
                      {v.category} · {v.priority} · {v.status}
                    </StatusBadge>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
