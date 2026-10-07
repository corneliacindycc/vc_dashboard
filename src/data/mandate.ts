// CUSTOMIZE: INA mandate — this is the firm’s IC sheet. publicScreen() in public-diligence.ts reads it.
// Change stage/geo/check size, fit weights, and the default DD checklist here. Unknowns stay Not disclosed.

import type { AnalysisType, DiligenceItemStatus, DiligencePriority } from "@/lib/types";

export const FIRM_MANDATE = {
  name: "Example early-stage APAC fund",
  stageFocus: "Pre-seed to Series A software",
  geography: "Singapore, rest of Southeast Asia, India, Australia",
  checkSize: "Not disclosed in this demo — set your typical ticket",
  weDo: "Back software and applied-AI companies with a path to regional or global scale.",
  weDoNot:
    "We do not invent private metrics. If it is not in a licensed source or the data room, it stays Not disclosed.",
};

export const FIT_WEIGHTS = [
  { key: "founder", label: "Founder quality", weight: 1 },
  { key: "fmf", label: "Founder-market fit", weight: 1 },
  { key: "market", label: "Market opportunity", weight: 1 },
  { key: "global", label: "Global scalability", weight: 1 },
  { key: "tech", label: "Technology differentiation", weight: 1 },
  { key: "traction", label: "Traction", weight: 1 },
  { key: "model", label: "Business model", weight: 1 },
  { key: "apac", label: "APAC relevance", weight: 1 },
  { key: "stage", label: "Stage fit", weight: 1 },
  { key: "timing", label: "Timing", weight: 1 },
] as const;

export const PUBLIC_CRITERIA_NOTE = `${FIRM_MANDATE.name}. Weighted fit across ${FIT_WEIGHTS.length} dimensions (each /10). Overall = weighted average × 10. Illustrative public-info screen, not a licensed scoring product.`;

export const CLAIM_RULES = {
  factVsInterpretation: "Label every claim FACT or AI INTERPRETATION. Do not mix them.",
  unknowns: "If something is unknown, write Not disclosed. Do not invent a number to complete the dashboard.",
};

export const DD_CHECKLIST: {
  idSuffix: string;
  category: DiligencePriority;
  item: string;
  status: DiligenceItemStatus;
  nextAction: string;
}[] = [
  {
    idSuffix: "financials",
    category: "Critical",
    item: "Financial statements / operating metrics",
    status: "Missing",
    nextAction: "Request from the company or a licensed data vendor",
  },
  {
    idSuffix: "concentration",
    category: "Critical",
    item: "Customer concentration",
    status: "Missing",
    nextAction: "Ask what % of revenue is the top three customers",
  },
  {
    idSuffix: "runway",
    category: "Critical",
    item: "Cash and runway",
    status: "Missing",
    nextAction: "Request burn and cash",
  },
  {
    idSuffix: "retention",
    category: "Important",
    item: "Retention / cohort quality",
    status: "Missing",
    nextAction: "Data room",
  },
  {
    idSuffix: "cap-table",
    category: "Important",
    item: "Cap table and round terms",
    status: "Missing",
    nextAction: "Counsel / data room",
  },
];

export const FOUNDER_QUESTIONS: { category: string; question: string }[] = [
  { category: "Mandate", question: `How does this company sit in: ${FIRM_MANDATE.stageFocus}?` },
  { category: "Process", question: "What may we see in a data room that is not in the public record?" },
  { category: "Unknowns", question: CLAIM_RULES.unknowns },
];

export const ANALYSIS_TYPES: AnalysisType[] = [
  "Initial Screen",
  "Full Preliminary DD",
  "Market DD",
  "Commercial DD",
  "Founder DD",
  "Financial DD",
  "Competition DD",
  "Re-run analysis",
];
