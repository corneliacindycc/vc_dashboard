import type {
  ActivityEvent,
  Company,
  Evidence,
  Founder,
  FundingRound,
  OpportunitySignal,
  PortfolioCompany,
  SeedDataset,
  TeamNote,
  TeamReview,
  ValueCreationOpportunity,
} from "@/lib/types";
import ingestedJson from "./ingested.json";
import { publicScreen } from "./public-diligence";

type IngestedRow = Company & { book?: "radar" | "portfolio"; wikipediaUrl?: string };

const ingested = ingestedJson as {
  fetchedAt: string;
  source: string;
  companies: IngestedRow[];
  founders: Founder[];
};

export const allCompanies: Company[] = ingested.companies.map(({ book: _book, wikipediaUrl: _wiki, ...c }) => c);

const portfolioIds = new Set(ingested.companies.filter((c) => c.book === "portfolio").map((c) => c.id));

function co(id: string) {
  const found = allCompanies.find((c) => c.id === id);
  if (!found) throw new Error(`Missing ingested company ${id}. Run npm run ingest.`);
  return found;
}

const founders: Founder[] = ingested.founders;

function sig(
  id: string,
  companyId: string,
  signalType: OpportunitySignal["signalType"],
  description: string,
  strength: OpportunitySignal["strength"] = "Medium",
): OpportunitySignal {
  return {
    id,
    companyId,
    signalType,
    description,
    source: co(companyId).source,
    sourceUrl: co(companyId).website,
    detectedAt: ingested.fetchedAt.slice(0, 10),
    strength,
    synthetic: false,
  };
}

const signals: OpportunitySignal[] = [
  sig("s1", "grab", "Market trend", "Public superapp coverage across ride-hailing, deliveries and payments.", "High"),
  sig("s2", "ninja-van", "Rapid hiring", "Regional last-mile network continues to show up in public logistics coverage.", "Medium"),
  sig("s3", "carousell", "New product launch", "Public marketplace / classifieds product surface (encyclopedia profile)."),
  sig("s4", "goto", "Partnership", "Public profile of the Gojek–Tokopedia combination.", "High"),
  sig("s5", "razorpay", "New funding", "Public payments-infrastructure profile for Indian businesses.", "High"),
  sig("s6", "airwallex", "Emerging technology", "Public global-payments infrastructure profile.", "High"),
  sig("s7", "carsome", "Market trend", "Used-car marketplace coverage in Southeast Asia.", "Medium"),
  sig("s8", "freshworks", "New product launch", "Public SaaS customer-engagement platform.", "Medium"),
];

const funding: FundingRound[] = allCompanies
  .filter((c) => ["grab", "goto", "canva", "atlassian"].includes(c.id))
  .map((c) => ({
    id: `r-${c.id}`,
    companyId: c.id,
    roundType: "Not disclosed",
    amount: "Not disclosed",
    currency: "USD",
    date: "Not disclosed",
    investors: ["Not disclosed"],
    source: c.source,
    sourceUrl: c.website,
  }));

const grab = co("grab");
const ninja = co("ninja-van");
const carousel = co("carousell");

const diligence = [
  publicScreen(grab, { recommendation: "Investigate Further", depth: "full" }),
  publicScreen(ninja, { recommendation: "Investigate Further", depth: "full" }),
  publicScreen(carousel, { recommendation: "Watch", depth: "full" }),
  ...allCompanies
    .filter((c) => !["grab", "ninja-van", "carousell"].includes(c.id) && !portfolioIds.has(c.id))
    .slice(0, 8)
    .map((c) => publicScreen(c, { recommendation: "Investigate Further", depth: "shallow" })),
];

const reviews: TeamReview[] = [
  { id: "tr-grab", companyId: "grab", owner: "Cindy", status: "Reviewing", conviction: 4, thesis: "Category-defining SEA superapp. Public profile only.", whyNow: "Still the regional consumer-internet reference.", concerns: "Late-stage / public — not a seed check.", whatChangesMyMind: "A specific early-stage wedge the team could still underwrite.", nextAction: "Research further", nextActionDate: "2026-09-08", decision: null, decisionRationale: "", createdAt: "2026-08-21", updatedAt: "2026-08-29" },
  { id: "tr-ninja", companyId: "ninja-van", owner: "Alex", status: "New", conviction: 3, thesis: "Last-mile density is the APAC logistics story.", whyNow: "E-commerce parcel volumes.", concerns: "Capital intensity; unit economics not in this dataset.", whatChangesMyMind: "Verified contribution margins.", nextAction: "Request information", nextActionDate: "2026-09-05", decision: null, decisionRationale: "", createdAt: "2026-08-30", updatedAt: "2026-08-30" },
  { id: "tr-carousell", companyId: "carousell", owner: "Sarah", status: "Founder Meeting", conviction: 3, thesis: "Liquidity in C2C classifieds is hard to displace.", whyNow: "Recommerce theme.", concerns: "Take-rate and trust & safety load.", whatChangesMyMind: "Evidence of high-intent verticals working.", nextAction: "Schedule meeting", nextActionDate: "2026-09-03", decision: null, decisionRationale: "", createdAt: "2026-08-10", updatedAt: "2026-08-27" },
  { id: "tr-razorpay", companyId: "razorpay", owner: "James", status: "Due Diligence", conviction: 4, thesis: "Payments infrastructure compounds with every merchant.", whyNow: "India digital public infrastructure.", concerns: "Private numbers not here.", whatChangesMyMind: "Cohort-level take-rate quality.", nextAction: "Move to DD", nextActionDate: "2026-09-10", decision: null, decisionRationale: "", createdAt: "2026-07-15", updatedAt: "2026-08-22" },
  { id: "tr-carsome", companyId: "carsome", owner: "Cindy", status: "Investment Committee", conviction: 4, thesis: "Inspection + marketplace is the used-car wedge.", whyNow: "SEA motorisation + trust gap.", concerns: "Ops-heavy; capex.", whatChangesMyMind: "Contribution margin by market.", nextAction: "Introduce to partner", nextActionDate: "2026-09-12", decision: "Advance", decisionRationale: "Advance on public profile; still need private metrics.", createdAt: "2026-06-01", updatedAt: "2026-08-18" },
  { id: "tr-traveloka", companyId: "traveloka", owner: "Alex", status: "Watchlist", conviction: 2, thesis: "Travel platforms are cyclical.", whyNow: "Post-covid travel.", concerns: "OTA margin structure.", whatChangesMyMind: "A software wedge besides media.", nextAction: "Watch", nextActionDate: "2026-10-01", decision: "Hold", decisionRationale: "Watch; public profile only.", createdAt: "2026-07-01", updatedAt: "2026-08-12" },
  { id: "tr-bukalapak", companyId: "bukalapak", owner: "Sarah", status: "Pass", conviction: 1, thesis: "Marketplace competition in ID is brutal.", whyNow: "None for a new check on this name.", concerns: "Public-market history is not a seed story.", whatChangesMyMind: "Unlikely in this mandate.", nextAction: "Pass", nextActionDate: "2026-08-01", decision: "Pass", decisionRationale: "Illustrative pass: not an early-stage software check.", createdAt: "2026-05-01", updatedAt: "2026-08-01" },
  { id: "tr-patsnap", companyId: "patsnap", owner: "James", status: "Reviewing", conviction: 4, thesis: "IP analytics is a real workflow.", whyNow: "R&D teams drowning in filings.", concerns: "Wikipedia page missing — homepage ingest only.", whatChangesMyMind: "Named enterprise logos + retention.", nextAction: "Research further", nextActionDate: "2026-09-06", decision: null, decisionRationale: "", createdAt: "2026-08-05", updatedAt: "2026-08-25" },
  { id: "tr-xendit", companyId: "xendit", owner: "Cindy", status: "Founder Meeting", conviction: 4, thesis: "SEA payments rails.", whyNow: "SME digital commerce.", concerns: "No encyclopedia page; homepage-only ingest.", whatChangesMyMind: "Net revenue retention.", nextAction: "Contact founder", nextActionDate: "2026-09-04", decision: null, decisionRationale: "", createdAt: "2026-08-08", updatedAt: "2026-08-26" },
  { id: "tr-airwallex", companyId: "airwallex", owner: "Alex", status: "New", conviction: 3, thesis: "Global accounts for APAC-founded exporters.", whyNow: "Cross-border SME stack.", concerns: "Late / large.", whatChangesMyMind: "An entry point that is still early.", nextAction: "Research further", nextActionDate: "2026-09-09", decision: null, decisionRationale: "", createdAt: "2026-08-31", updatedAt: "2026-08-31" },
];

const notes: TeamNote[] = [
  { id: "n1", companyId: "grab", author: "Cindy", text: "Public superapp profile is solid. This is not a seed memo — treat as a reference file.", createdAt: "2026-08-22T09:00:00+08:00" },
  { id: "n2", companyId: "carousell", author: "Sarah", text: "Ask what is still early vs what is a scaled classifieds business.", createdAt: "2026-08-27T14:00:00+08:00" },
  { id: "n3", companyId: "razorpay", author: "James", text: "Want licensed data on take-rate and net retention before this is a real IC file.", createdAt: "2026-08-22T11:30:00+08:00" },
  { id: "n4", companyId: "carsome", author: "Cindy", text: "Inspection quality is the moat claim. Not in Wikipedia. Need operator refs.", createdAt: "2026-08-18T16:00:00+08:00" },
];

const portfolio: PortfolioCompany[] = allCompanies
  .filter((c) => portfolioIds.has(c.id))
  .map((c, i) => ({
    id: `pf-${c.id}`,
    companyId: c.id,
    fund: ["Early Stage Fund III", "Climate Fund", "Early Stage Fund II", "Opportunity Syndicate"][i % 4],
    investmentStage: "Not disclosed",
    investmentDate: "Not disclosed",
    status: "Invested",
    notes: "Example holdings so the portfolio module can be used. Public facts only — not a statement that this fund invested.",
  }));

const valueCreation: ValueCreationOpportunity[] = [
  { id: "vc1", portfolioCompanyId: "pf-canva", category: "Talent", description: "Map senior GTM introductions (demo support scenario).", priority: "High", owner: "Cindy", status: "Identified", relatedContact: "Operator network (demo)", nextAction: "Three introduction slots", dueDate: "2026-09-15", notes: "Support scenario — not a real live mandate.", synthetic: true },
  { id: "vc2", portfolioCompanyId: "pf-atlassian", category: "Partnerships", description: "Enterprise customer mapping in SEA (demo).", priority: "Medium", owner: "Alex", status: "Planned", relatedContact: "SEA enterprise accounts (demo)", nextAction: "Shortlist 5 logos", dueDate: "2026-09-20", notes: "Demo support scenario.", synthetic: true },
  { id: "vc3", portfolioCompanyId: "pf-xero", category: "Market Expansion", description: "Accountant-channel expansion in ASEAN (demo).", priority: "High", owner: "Sarah", status: "In Progress", relatedContact: "Practice principals (demo)", nextAction: "Workshop date", dueDate: "2026-09-10", notes: "Demo support scenario.", synthetic: true },
  { id: "vc4", portfolioCompanyId: "pf-wisetech", category: "GTM / Marketing", description: "Forwarder-channel brief for new corridors (demo).", priority: "Medium", owner: "James", status: "Identified", relatedContact: "AU/NZ freight (demo)", nextAction: "Draft partner brief", dueDate: "2026-09-30", notes: "Demo support scenario.", synthetic: true },
  { id: "vc5", portfolioCompanyId: "pf-afterpay", category: "Capital", description: "Follow-on / parent-company context briefing (demo).", priority: "Low", owner: "Cindy", status: "Identified", relatedContact: "Fintech coverage (demo)", nextAction: "Internal note", dueDate: "2026-10-05", notes: "Demo support scenario.", synthetic: true },
  { id: "vc6", portfolioCompanyId: "pf-seek", category: "Strategic", description: "SEA jobs-marketplace adjacency map (demo).", priority: "Low", owner: "Alex", status: "Identified", relatedContact: "Not disclosed", nextAction: "Advisor intro", dueDate: "2026-10-12", notes: "Demo support scenario.", synthetic: true },
];

const activity: ActivityEvent[] = [
  { id: "a1", at: "2026-09-01T09:42:00+08:00", text: "Cindy added Grab to Team Review.", companyId: "grab", kind: "review" },
  { id: "a2", at: "2026-09-01T09:18:00+08:00", text: "Public-source screen completed for Grab (Wikipedia ingest).", companyId: "grab", kind: "diligence" },
  { id: "a3", at: "2026-08-31T16:00:00+08:00", text: "Ninja Van surfaced on Deal Radar from the public ingest.", companyId: "ninja-van", kind: "signal" },
  { id: "a4", at: "2026-08-31T11:00:00+08:00", text: "Alex moved Ninja Van into New.", companyId: "ninja-van", kind: "review" },
  { id: "a5", at: "2026-08-30T10:00:00+08:00", text: "Canva has a new value-creation opportunity (talent — demo).", companyId: "canva", kind: "portfolio" },
  { id: "a6", at: "2026-08-29T15:20:00+08:00", text: "Sarah booked a founder meeting for Carousell.", companyId: "carousell", kind: "review" },
  { id: "a7", at: "2026-08-28T09:00:00+08:00", text: "Wikipedia / homepage ingest refreshed the company book.", kind: "system" },
  { id: "a8", at: "2026-08-22T11:30:00+08:00", text: "James added a note on Razorpay.", companyId: "razorpay", kind: "note" },
  { id: "a9", at: "2026-08-18T16:00:00+08:00", text: "Cindy advanced Carsome to IC.", companyId: "carsome", kind: "decision" },
  { id: "a10", at: "2026-08-01T12:00:00+08:00", text: "Sarah passed Bukalapak — not an early-stage software check.", companyId: "bukalapak", kind: "decision" },
];

const evidence: Evidence[] = [
  { id: "e1", companyId: "grab", diligenceReportId: "dd-grab", claim: "Grab operates a superapp for ride-hailing, food delivery and digital payments in multiple Southeast Asian countries.", kind: "FACT", source: grab.source, sourceType: "Wikipedia", sourceDate: grab.updatedAt, snippet: grab.description.slice(0, 220), confidence: "High", sourceUrl: grab.website },
  { id: "e2", companyId: "ninja-van", diligenceReportId: "dd-ninja-van", claim: "Ninja Van is a Singaporean last-mile logistics company with warehouses across Southeast Asia.", kind: "FACT", source: ninja.source, sourceType: "Wikipedia", sourceDate: ninja.updatedAt, snippet: ninja.description.slice(0, 220), confidence: "High", sourceUrl: ninja.website },
  { id: "e3", companyId: "carousell", diligenceReportId: "dd-carousell", claim: "Carousell is a classifieds marketplace based in Singapore.", kind: "FACT", source: carousel.source, sourceType: "Wikipedia", sourceDate: carousel.updatedAt, snippet: carousel.description.slice(0, 220), confidence: "High", sourceUrl: carousel.website },
];

export const seed: SeedDataset = {
  companies: allCompanies,
  founders,
  funding,
  signals,
  diligence,
  reviews,
  notes,
  portfolio,
  valueCreation,
  activity,
  evidence,
  // CUSTOMIZE: morning refresh — Overview + Radar consume this payload; refresh it from a job behind providers, not from page.tsx
  emergingThemes: [
    {
      theme: "Superapps & consumer internet",
      delta: "Public profiles in book",
      sector: "Consumer",
      method: "Counted Consumer-sector names in the Wikipedia/homepage ingest (Grab, GoTo, Lazada, Carousell). Not a live crawl of the open web.",
      sources: [
        { title: "Grab (Wikipedia)", publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Grab_(company)" },
        { title: "GoTo (Wikipedia)", publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/GoTo_(company)" },
      ],
    },
    {
      theme: "Payments infrastructure",
      delta: "Public profiles in book",
      sector: "Fintech",
      method: "Fintech names from the ingest list (Razorpay, Xendit, Nium, Airwallex, GCash). Homepage used where Wikipedia is missing.",
      sources: [
        { title: "Airwallex (Wikipedia)", publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Airwallex" },
        { title: "GCash (Wikipedia)", publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/GCash" },
      ],
    },
    {
      theme: "Logistics software & networks",
      delta: "Public profiles in book",
      sector: "Logistics",
      method: "Ninja Van, Flash Express, WiseTech Global from the ingest list.",
      sources: [
        { title: "Ninja Van (Wikipedia)", publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ninja_Van" },
        { title: "WiseTech Global (Wikipedia)", publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/WiseTech_Global" },
      ],
    },
  ],
  // CUSTOMIZE: morning refresh — “refreshed every morning” copy, KPIs, and analystAttention for Overview / Deal Radar
  morningBrief: {
    topSignal: "Public-source ingest loaded real APAC internet, fintech and logistics names into Deal Radar.",
    newOpportunities: ["Grab", "Ninja Van", "Razorpay"],
    themes: ["Superapps & consumer internet", "Payments infrastructure", "Logistics software & networks"],
    analystAttention: "Start with Grab (reference), Ninja Van (ops-heavy logistics), Razorpay (payments infra). All screens are public-info only.",
    lastRefresh: ingested.fetchedAt.slice(0, 16).replace("T", " ") + " UTC",
    processed: allCompanies.length,
    relevant: allCompanies.length,
    newCount: allCompanies.filter((c) => !portfolioIds.has(c.id)).length,
    highPriority: allCompanies.filter((c) => c.fitBand === "High" && !portfolioIds.has(c.id)).length,
  },
};

export function cloneSeedState() {
  return {
    reviews: structuredClone(seed.reviews),
    notes: structuredClone(seed.notes),
    portfolio: structuredClone(seed.portfolio),
    valueCreation: structuredClone(seed.valueCreation),
    activity: structuredClone(seed.activity),
    overrides: {} as Record<string, { score: number; reason: string; by: import("@/lib/types").TeamMember; at: string }>,
    savedAnalyses: ["grab", "ninja-van", "carousell", "goto", "razorpay", "airwallex"],
  };
}
