import type {
  ActivityEvent,
  Company,
  DiligenceReport,
  Evidence,
  Founder,
  FundingRound,
  OpportunitySignal,
  PortfolioCompany,
  TeamNote,
  TeamReview,
  ValueCreationOpportunity,
} from "@/lib/types";

export interface CompanyProvider {
  list(): Company[];
  get(id: string): Company | undefined;
  founders(companyId: string): Founder[];
  funding(companyId: string): FundingRound[];
  signals(companyId: string): OpportunitySignal[];
  evidence(companyId: string): Evidence[];
}

export interface OpportunityProvider {
  radarCompanies(): Company[];
}

export interface DiligenceProvider {
  getByCompany(companyId: string): DiligenceReport | undefined;
  list(): DiligenceReport[];
}

export interface PortfolioProvider {
  list(): PortfolioCompany[];
  getByCompany(companyId: string): PortfolioCompany | undefined;
  valueCreation(portfolioCompanyId: string): ValueCreationOpportunity[];
}

export interface ActivityProvider {
  list(): ActivityEvent[];
}

export interface ReviewProvider {
  list(): TeamReview[];
  getByCompany(companyId: string): TeamReview | undefined;
  notes(companyId: string): TeamNote[];
}
