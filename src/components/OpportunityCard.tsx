"use client";

import Link from "next/link";
import type { Company, OpportunitySignal } from "@/lib/types";
import { FitScore, LogoMark, OriginTag, StatusBadge } from "./ui";
import { useDemoStore } from "@/lib/store";

export function CompanyActions({
  companyId,
  compact,
}: {
  companyId: string;
  compact?: boolean;
}) {
  const { addToTeamReview, reviewFor } = useDemoStore();
  const existing = reviewFor(companyId);
  const cls = compact ? "btn h-11 min-h-11 px-4 py-0 text-sm" : "btn";
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`/agent/${companyId}`} className={`${cls} btn-blue`}>
        Analyse with Agent
      </Link>
      {existing ? (
        <Link href={`/review/${companyId}`} className={`${cls} btn-dark`}>
          Open Review
        </Link>
      ) : (
        <button
          type="button"
          className={`${cls} btn-add`}
          onClick={() => addToTeamReview(companyId)}
        >
          Add to Team Review
        </button>
      )}
      <Link href={`/companies/${companyId}`} className={`${cls} btn-ghost text-ink`}>
        View Company
      </Link>
    </div>
  );
}

export function OpportunityCard({
  company,
  signal,
}: {
  company: Company;
  signal?: OpportunitySignal;
}) {
  return (
    <article className="flex h-full flex-col border border-black/10 bg-white p-6">
      <div className="flex items-start gap-4">
        <LogoMark initials={company.logoInitials} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <OriginTag origin={company.origin} />
          </div>
          <p className="mt-1 text-sm text-ink/60">
            {company.city ? `${company.city}, ` : ""}
            {company.country} · {company.stage} · {company.subSector}
          </p>
          <a
            href={company.website}
            className="text-sm text-brand"
            target="_blank"
            rel="noreferrer"
          >
            {company.website.replace("https://", "")}
          </a>
        </div>
        <FitScore score={company.opportunityScore} />
      </div>
      <p className="mt-4 text-[16px] leading-relaxed">{company.oneLiner}</p>
      <p className="mt-2 text-sm text-ink/70">{company.whyItMatters}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge>{company.pipelineStatus}</StatusBadge>
        {signal && (
          <StatusBadge tone="info">
            {signal.signalType}: {signal.description}
          </StatusBadge>
        )}
      </div>
      <p className="mt-3 text-sm text-ink/50">
        Funding {company.fundingSummary} · Investors {company.knownInvestors.join(", ")}
      </p>
      <div className="mt-auto pt-6">
        <CompanyActions companyId={company.id} compact />
      </div>
    </article>
  );
}
