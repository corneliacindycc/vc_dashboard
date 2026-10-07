export type Geography =
  | "Singapore"
  | "Australia"
  | "Indonesia"
  | "Malaysia"
  | "Vietnam"
  | "Thailand"
  | "Philippines"
  | "India"
  | "Other APAC";

export type Stage =
  | "Pre-seed"
  | "Seed"
  | "Pre-Series A"
  | "Series A"
  | "Other";

export type Sector =
  | "AI"
  | "Enterprise SaaS"
  | "Fintech"
  | "Climate"
  | "Deep Tech"
  | "Robotics"
  | "Logistics"
  | "Food & Agriculture"
  | "Health"
  | "Advanced Manufacturing"
  | "Consumer"
  | "Other";

export type SignalType =
  | "New funding"
  | "Rapid hiring"
  | "Accelerator participation"
  | "New product launch"
  | "Founder change"
  | "Partnership"
  | "Emerging technology"
  | "Market trend"
  | "University spinout"
  | "Repeat founder";

export type FitBand = "High" | "Medium" | "Low" | "Not assessed";
export type Confidence = "High" | "Medium" | "Low";
export type ClaimKind = "FACT" | "AI INTERPRETATION" | "TEAM VIEW";
export type DataOrigin = "public" | "synthetic";

export type ReviewStatus =
  | "New"
  | "Reviewing"
  | "Founder Meeting"
  | "Due Diligence"
  | "Investment Committee"
  | "Watchlist"
  | "Pass"
  | "Invested";

export type NextAction =
  | "Research further"
  | "Contact founder"
  | "Request information"
  | "Schedule meeting"
  | "Introduce to partner"
  | "Move to DD"
  | "Pass"
  | "Watch";

export type Decision = "Advance" | "Hold" | "Pass" | "Invest" | null;

export type Recommendation =
  | "Strong Interest"
  | "Investigate Further"
  | "Watch"
  | "Pass";

export type AnalysisType =
  | "Initial Screen"
  | "Full Preliminary DD"
  | "Market DD"
  | "Commercial DD"
  | "Founder DD"
  | "Financial DD"
  | "Competition DD"
  | "Re-run analysis";

export type DiligencePriority = "Critical" | "Important" | "Nice to Have";
export type DiligenceItemStatus =
  | "Missing"
  | "Requested"
  | "Received"
  | "Verified"
  | "Needs clarification";

export type RiskLevel = "Low" | "Medium" | "High";
export type VcCategory =
  | "Capital"
  | "Partnerships"
  | "Market Expansion"
  | "Talent"
  | "GTM / Marketing"
  | "Strategic";

export type VcPriority = "Critical" | "High" | "Medium" | "Low";
export type VcStatus =
  | "Identified"
  | "Planned"
  | "In Progress"
  | "Completed"
  | "Dismissed";

export type PortfolioStatus = "Invested" | "Exited" | "Partially Exited";

// CUSTOMIZE: team members — change this union first, then TEAM + DEFAULT_OWNER in src/data/constants.ts, then bump STORAGE_KEY
export type TeamMember = "Cindy" | "Alex" | "Sarah" | "James";

export interface Founder {
  id: string;
  companyId: string;
  name: string;
  role: string;
  bio: string;
  linkedinUrl?: string;
  previousCompanies: string[];
  domainExpertise: string;
  technicalBackground: string;
}

export interface FundingRound {
  id: string;
  companyId: string;
  roundType: string;
  amount: string;
  currency: string;
  date: string;
  investors: string[];
  source: string;
  sourceUrl?: string;
}

export interface OpportunitySignal {
  id: string;
  companyId: string;
  signalType: SignalType;
  description: string;
  source: string;
  sourceUrl?: string;
  detectedAt: string;
  strength: "High" | "Medium" | "Low";
  synthetic?: boolean;
}

export interface ScoreDimension {
  key: string;
  label: string;
  score: number;
  max: number;
  confidence: Confidence;
  evidence: string;
}

export interface FitScorecard {
  overall: number;
  confidence: Confidence;
  dimensions: ScoreDimension[];
  driving: string[];
  dragging: string[];
  rationale: string;
  publicCriteriaNote: string;
}

export interface Evidence {
  id: string;
  companyId: string;
  diligenceReportId?: string;
  claim: string;
  kind: ClaimKind;
  source: string;
  sourceUrl?: string;
  sourceType: string;
  sourceDate: string;
  documentReference?: string;
  snippet?: string;
  confidence: Confidence;
}

export interface DiligenceItem {
  id: string;
  category: DiligencePriority;
  item: string;
  status: DiligenceItemStatus;
  evidence: string;
  owner?: TeamMember;
  nextAction: string;
}

export interface RiskItem {
  category: string;
  level: RiskLevel;
  explanation: string;
  evidence: string;
  mitigation: string;
  unresolvedQuestion: string;
}

export interface CompetitorRow {
  name: string;
  product: string;
  customer: string;
  geography: string;
  pricing: string;
  technology: string;
  funding: string;
  traction: string;
  differentiation: string;
}

export interface DiligenceReport {
  id: string;
  companyId: string;
  analysisType: AnalysisType;
  recommendation: Recommendation;
  fit: FitScorecard;
  thesis: string[];
  whyNow: string;
  positives: string[];
  negatives: string[];
  company: Record<string, string>;
  founders: {
    name: string;
    role: string;
    assessment: string;
    strengths: string[];
    weaknesses: string[];
    founderMarketFit: string;
  }[];
  market: Record<string, string>;
  product: Record<string, string>;
  competition: { rows: CompetitorRow[]; takeaway: string };
  traction: Record<string, string>;
  risks: RiskItem[];
  checklist: DiligenceItem[];
  missing: { critical: string[]; important: string[]; niceToHave: string[] };
  founderQuestions: { category: string; question: string }[];
  sources: { title: string; url?: string; type: string; date: string }[];
  createdAt: string;
  depth: "full" | "shallow";
}

export interface TeamNote {
  id: string;
  companyId: string;
  author: TeamMember;
  text: string;
  createdAt: string;
}

export interface TeamReview {
  id: string;
  companyId: string;
  owner: TeamMember;
  status: ReviewStatus;
  conviction: number;
  thesis: string;
  whyNow: string;
  concerns: string;
  whatChangesMyMind: string;
  nextAction: NextAction;
  nextActionDate: string;
  decision: Decision;
  decisionRationale: string;
  analystOverrideScore?: number;
  overrideReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioCompany {
  id: string;
  companyId: string;
  fund: string;
  investmentStage: string;
  investmentDate: string;
  status: PortfolioStatus;
  notes: string;
}

export interface ValueCreationOpportunity {
  id: string;
  portfolioCompanyId: string;
  category: VcCategory;
  description: string;
  priority: VcPriority;
  owner: TeamMember;
  status: VcStatus;
  relatedContact: string;
  nextAction: string;
  dueDate: string;
  notes: string;
  synthetic?: boolean;
}

export interface ActivityEvent {
  id: string;
  at: string;
  text: string;
  companyId?: string;
  kind:
    | "signal"
    | "review"
    | "diligence"
    | "decision"
    | "portfolio"
    | "note"
    | "system";
}

export interface Company {
  id: string;
  name: string;
  logoInitials: string;
  website: string;
  country: Geography;
  city: string;
  foundedYear: string;
  sector: Sector;
  subSector: string;
  stage: Stage;
  description: string;
  businessModel: string;
  pipelineStatus: string;
  origin: DataOrigin;
  source: string;
  knownInvestors: string[];
  fundingSummary: string;
  opportunityScore: number;
  fitBand: FitBand;
  whyItMatters: string;
  oneLiner: string;
  createdAt: string;
  updatedAt: string;
  hero?: "strong" | "ambiguous" | "pass";
}

export interface DemoState {
  reviews: TeamReview[];
  notes: TeamNote[];
  portfolio: PortfolioCompany[];
  valueCreation: ValueCreationOpportunity[];
  activity: ActivityEvent[];
  overrides: Record<
    string,
    { score: number; reason: string; by: TeamMember; at: string }
  >;
  savedAnalyses: string[];
}

export interface SeedDataset {
  companies: Company[];
  founders: Founder[];
  funding: FundingRound[];
  signals: OpportunitySignal[];
  diligence: DiligenceReport[];
  reviews: TeamReview[];
  notes: TeamNote[];
  portfolio: PortfolioCompany[];
  valueCreation: ValueCreationOpportunity[];
  activity: ActivityEvent[];
  evidence: Evidence[];
  emergingThemes: {
    theme: string;
    delta: string;
    sector: Sector;
    method: string;
    sources: { title: string; publisher: string; url: string }[];
  }[];
  morningBrief: {
    topSignal: string;
    newOpportunities: string[];
    themes: string[];
    analystAttention: string;
    lastRefresh: string;
    processed: number;
    relevant: number;
    newCount: number;
    highPriority: number;
  };
}
