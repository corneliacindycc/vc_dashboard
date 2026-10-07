import type { TeamMember } from "@/lib/types";

// CUSTOMIZE: team members — 1) change TeamMember in src/lib/types.ts  2) update TEAM + DEFAULT_OWNER  3) bump STORAGE_KEY
export const TEAM: TeamMember[] = ["Cindy", "Alex", "Sarah", "James"];
export const DEFAULT_OWNER: TeamMember = "Cindy";
export const STORAGE_KEY = "vc-internal-pipeline-demo-v4";

// CUSTOMIZE: taxonomy — Radar filters and Team Review columns. Keep in sync with src/lib/types.ts Geography / Stage / Sector / ReviewStatus.
export const GEOGRAPHIES = [
  "Singapore",
  "Australia",
  "Indonesia",
  "Malaysia",
  "Vietnam",
  "Thailand",
  "Philippines",
  "India",
  "Other APAC",
] as const;

export const STAGES = [
  "Pre-seed",
  "Seed",
  "Pre-Series A",
  "Series A",
  "Other",
] as const;

export const SECTORS = [
  "AI",
  "Enterprise SaaS",
  "Fintech",
  "Climate",
  "Deep Tech",
  "Robotics",
  "Logistics",
  "Food & Agriculture",
  "Health",
  "Advanced Manufacturing",
  "Consumer",
  "Other",
] as const;

export const SIGNALS = [
  "New funding",
  "Rapid hiring",
  "Accelerator participation",
  "New product launch",
  "Founder change",
  "Partnership",
  "Emerging technology",
  "Market trend",
  "University spinout",
  "Repeat founder",
] as const;

export const REVIEW_COLUMNS = [
  "New",
  "Reviewing",
  "Founder Meeting",
  "Due Diligence",
  "Investment Committee",
  "Watchlist",
  "Pass",
  "Invested",
] as const;

export { FIT_WEIGHTS, PUBLIC_CRITERIA_NOTE } from "./mandate";
