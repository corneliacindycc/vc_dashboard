import type { Company } from "@/lib/types";
import {
  CLAIM_RULES,
  DD_CHECKLIST,
  FIRM_MANDATE,
  FIT_WEIGHTS,
  FOUNDER_QUESTIONS,
  PUBLIC_CRITERIA_NOTE,
} from "./mandate";
import type {
  DiligenceReport,
  FitScorecard,
  Recommendation,
  ScoreDimension,
} from "@/lib/types";

function dim(
  key: string,
  label: string,
  score: number,
  confidence: ScoreDimension["confidence"],
  evidence: string,
): ScoreDimension {
  return { key, label, score, max: 10, confidence, evidence };
}

function weightFor(key: string) {
  return FIT_WEIGHTS.find((w) => w.key === key)?.weight ?? 1;
}

function card(
  dims: ScoreDimension[],
  extra: Omit<FitScorecard, "overall" | "dimensions" | "publicCriteriaNote">,
): FitScorecard {
  const weightSum = dims.reduce((s, d) => s + weightFor(d.key), 0);
  const weighted = dims.reduce((s, d) => s + d.score * weightFor(d.key), 0);
  const overall = weightSum === 0 ? 0 : Math.round((weighted / weightSum) * 10);
  return { overall, dimensions: dims, publicCriteriaNote: PUBLIC_CRITERIA_NOTE, ...extra };
}

const ND = "Not disclosed";

export function publicScreen(
  c: Company,
  opts: {
    recommendation: Recommendation;
    depth: "full" | "shallow";
    fit?: FitScorecard;
  },
): DiligenceReport {
  const wiki = c.source.startsWith("Wikipedia") ? c.source.replace("Wikipedia · ", "") : c.website;
  const fit =
    opts.fit ??
    card(
      [
        dim("founder", "Founder quality", 6, "Low", "Public names only; no private reference calls."),
        dim("fmf", "Founder-market fit", 6, "Low", ND),
        dim("market", "Market opportunity", 7, "Medium", c.oneLiner),
        dim("global", "Global scalability", 6, "Low", ND),
        dim("tech", "Technology differentiation", 5, "Low", ND),
        dim("traction", "Traction", 4, "Low", "No verified private metrics in this dataset."),
        dim("model", "Business model", 5, "Low", c.businessModel),
        dim("apac", "APAC relevance", c.country === "Other APAC" ? 6 : 8, "Medium", `${c.country} · ${FIRM_MANDATE.geography}`),
        dim("stage", "Stage fit", 5, "Medium", `${c.stage} vs mandate: ${FIRM_MANDATE.stageFocus}`),
        dim("timing", "Timing", 5, "Low", ND),
      ],
      {
        confidence: "Low",
        driving: ["Public profile exists", "APAC relevance"],
        dragging: ["No private financials", "Not a complete diligence pack"],
        rationale: `Illustrative public-information screen for ${c.name} against ${FIRM_MANDATE.name}. ${CLAIM_RULES.unknowns}`,
      },
    );

  return {
    id: `dd-${c.id}`,
    companyId: c.id,
    analysisType: opts.depth === "full" ? "Full Preliminary DD" : "Initial Screen",
    recommendation: opts.recommendation,
    fit,
    thesis: [
      c.oneLiner,
      `Mandate: ${FIRM_MANDATE.weDo}`,
      FIRM_MANDATE.weDoNot,
      "This pack is built from public encyclopedia/homepage text, not a data room.",
    ],
    whyNow: "Public profile is in the book so the pipeline OS can be exercised on real names.",
    positives: [c.oneLiner, `${c.city}, ${c.country}`, FIRM_MANDATE.geography],
    negatives: ["Private metrics not in this dataset", "Fit scores are illustrative"],
    company: {
      description: c.description,
      stage: c.stage,
      geography: `${c.city}, ${c.country}`,
      funding: c.fundingSummary,
      problem: ND,
      solution: c.oneLiner,
      product: ND,
      businessModel: c.businessModel,
      revenueModel: ND,
      customerSegment: ND,
      founded: c.foundedYear,
      investors: c.knownInvestors.join(", "),
      businessModelType: c.businessModel,
    },
    founders: [],
    market: {
      TAM: ND,
      SAM: ND,
      SOM: ND,
      growth: ND,
      trends: ND,
      drivers: ND,
      segments: c.subSector,
      adoption: ND,
      regulatory: ND,
      geo: c.country,
    },
    product: {
      description: c.oneLiner,
      coreTech: ND,
      differentiation: ND,
      moat: ND,
      ip: ND,
      dataAdvantage: ND,
      networkEffects: ND,
      switchingCosts: ND,
      aiDependency: ND,
      technicalRisks: ND,
      commoditisation: ND,
      fmCostFall: ND,
      fmReplicate: ND,
    },
    competition: { rows: [], takeaway: "Competitive set not mapped from public encyclopedia text." },
    traction: {
      revenue: ND,
      ARR: ND,
      MRR: ND,
      growth: ND,
      customers: ND,
      retention: ND,
      grossMargin: ND,
      CAC: ND,
      LTV: ND,
      burn: ND,
      runway: ND,
    },
    risks: [
      {
        category: "Information",
        level: "High",
        explanation: "This is a public-source screen. It is not an investment recommendation.",
        evidence: c.source,
        mitigation: "Request a data room and run licensed research.",
        unresolvedQuestion: "What do private financials and customer cohorts show?",
      },
    ],
    checklist: DD_CHECKLIST.map((row) => ({
      id: `${c.id}-${row.idSuffix}`,
      category: row.category,
      item: row.item,
      status: row.status,
      evidence: ND,
      nextAction: row.nextAction,
    })),
    missing: {
      critical: DD_CHECKLIST.filter((r) => r.category === "Critical").map((r) => r.item),
      important: DD_CHECKLIST.filter((r) => r.category === "Important").map((r) => r.item),
      niceToHave: ["Full competitive map"],
    },
    founderQuestions: FOUNDER_QUESTIONS,
    sources: [{ title: c.source, url: wiki, type: "Public source", date: c.updatedAt }],
    createdAt: c.updatedAt,
    depth: opts.depth,
  };
}
