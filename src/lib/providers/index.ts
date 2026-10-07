import { seed } from "@/data/seed";
import type { Company } from "@/lib/types";
import type {
  ActivityProvider,
  CompanyProvider,
  DiligenceProvider,
  OpportunityProvider,
  PortfolioProvider,
  ReviewProvider,
} from "./types";

const PORTFOLIO_IDS = new Set(seed.portfolio.map((p) => p.companyId));

export const demoCompanyProvider: CompanyProvider = {
  // CUSTOMIZE: live discovery — replace this seed read with your licensed API or crawl job
  list: () => seed.companies,
  get: (id) => seed.companies.find((c) => c.id === id),
  founders: (companyId) => seed.founders.filter((f) => f.companyId === companyId),
  funding: (companyId) => seed.funding.filter((f) => f.companyId === companyId),
  // CUSTOMIZE: live discovery — company signals from a licensed news/CRM feed, not HTML scrapes of gated sites
  signals: (companyId) => seed.signals.filter((s) => s.companyId === companyId),
  evidence: (companyId) => seed.evidence.filter((e) => e.companyId === companyId),
};

export const demoOpportunityProvider: OpportunityProvider = {
  // CUSTOMIZE: live discovery — Deal Radar list; cron belongs behind this method, not in React
  radarCompanies: () => seed.companies.filter((c) => !PORTFOLIO_IDS.has(c.id)),
};

export const demoDiligenceProvider: DiligenceProvider = {
  // CUSTOMIZE: live discovery — return DiligenceReport from your model/backend instead of seed packs
  getByCompany: (companyId) => seed.diligence.find((d) => d.companyId === companyId),
  list: () => seed.diligence,
};

export const demoPortfolioProvider: PortfolioProvider = {
  list: () => seed.portfolio,
  getByCompany: (companyId) => seed.portfolio.find((p) => p.companyId === companyId),
  valueCreation: (portfolioCompanyId) =>
    seed.valueCreation.filter((v) => v.portfolioCompanyId === portfolioCompanyId),
};

export const demoActivityProvider: ActivityProvider = {
  list: () => seed.activity,
};

export const demoReviewProvider: ReviewProvider = {
  list: () => seed.reviews,
  getByCompany: (companyId) => seed.reviews.find((r) => r.companyId === companyId),
  notes: (companyId) => seed.notes.filter((n) => n.companyId === companyId),
};

export function isRadarCompany(c: Company) {
  return !PORTFOLIO_IDS.has(c.id);
}

export const providers = {
  companies: demoCompanyProvider,
  opportunities: demoOpportunityProvider,
  diligence: demoDiligenceProvider,
  portfolio: demoPortfolioProvider,
  activity: demoActivityProvider,
  reviews: demoReviewProvider,
};
