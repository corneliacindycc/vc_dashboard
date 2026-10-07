# Customize Venture Capital Internal Pipeline

This app is a **venture capital operating system**. Screens talk to **provider interfaces**, not arrays in React. Treat this file as the fork handbook: what to change, where it lives, and what “done” looks like for a real firm.

## 1. How to find fork points

One banner, one map:

```bash
rg "CUSTOMIZE:"
```

Every fork that matters is marked with `CUSTOMIZE:` (team, mandate, ingest, providers, INA `run()`, persist, branding). Do not hunt through pages.

Architecture:

```
Deal Radar / Company / INA / Team Review / Portfolio
                    │
                    ▼
           src/lib/providers/index.ts
                    │
                    ▼
     src/data/seed.ts  ←  src/data/ingested.json  ←  ingest-targets.json
                    ▲
           src/data/mandate.ts  (INA fit + checklist)
```

## 2. Team members

**What it does.** Names on reviews, notes, portfolio tasks, and the default owner.

**Files.** Two-file rule:

1. Union: `src/lib/types.ts` → `TeamMember`
2. List + default: `src/data/constants.ts` → `TEAM`, `DEFAULT_OWNER`

Then bump `STORAGE_KEY` in `constants.ts` so old `localStorage` does not keep dead names.

**Done.** Partners appear in Team Review owner pickers; demo reset does not resurrect the previous roster.

## 3. Investment mandate and INA diligence

**What it does.** The firm’s IC sheet: stage/geo/check size, what you do not do, weighted fit, default DD gaps, FACT vs interpretation rules.

**File.** `src/data/mandate.ts`

- `FIRM_MANDATE` — injected into thesis and founder questions
- `FIT_WEIGHTS` — **used** by `publicScreen()` in `src/data/public-diligence.ts` (overall = weighted average of /10 dimensions × 10)
- `DD_CHECKLIST` — Critical / Important items on every public pack
- `CLAIM_RULES` — always label FACT vs AI INTERPRETATION; unknowns stay `Not disclosed`
- `ANALYSIS_TYPES` — INA dropdown (`src/app/agent/page.tsx`)

**Done.** Editing `mandate.ts` and reloading changes the INA pack (criteria note, checklist, thesis), not just comments.

## 4. Company book

**What it does.** Real public names in Deal Radar and Portfolio.

**Files.** `src/data/ingest-targets.json` then `npm run ingest` (`scripts/ingest-wikipedia.mjs` → `src/data/ingested.json`). Do not hand-edit `ingested.json`.

**Done.** A new `id` in `radar` or `portfolio` appears after ingest; Wikipedia/homepage text is attributed; private metrics stay `Not disclosed`.

## 5. Live discovery / morning refresh

**What it does.** Deal Radar’s company list and the Overview “morning desk”.

**Files.**

- `OpportunityProvider.radarCompanies` in `src/lib/providers/index.ts`
- `seed.morningBrief` and `seed.emergingThemes` in `src/data/seed.ts`

Cron belongs **behind** the provider (or a job that rewrites what the provider reads), not in React.

**Done.** Overnight jobs change Radar + Overview without editing page components.

## 6. INA model API

**What it does.** Today INA navigates to a preloaded pack. `run()` does not call a model.

**Files.** `src/app/agent/page.tsx` (`run()`) then persist a `DiligenceReport`. Fake progress `STEPS` live in `src/app/agent/[companyId]/page.tsx`; the pack is `providers.diligence.getByCompany`.

**Done.** Uploads/links hit your backend; the UI still renders `DiligenceReport`. Claims stay `FACT` or `AI INTERPRETATION` (`ClaimKind` in `src/lib/types.ts`).

## 7. Reviews and portfolio persistence

**What it does.** Stage, conviction, notes, invest/pass, value-creation tasks.

**File.** `src/lib/store.tsx` → `persist` (browser `localStorage` via `STORAGE_KEY`).

**Done.** Mutations write to your CRM/database; `localStorage` is gone in production.

## 8. Branding

**What it does.** Product name and chrome.

**Files.** `src/components/AppShell.tsx` (wordmark, nav), `src/app/layout.tsx` (`metadata`).

**Done.** The fork looks like your firm, not Venture Capital Internal Pipeline.

## 9. What not to scrape

Do **not** scrape Crunchbase, PitchBook, or LinkedIn without a license. Use licensed APIs or public sources with attribution (Wikipedia is CC BY-SA — keep source URLs). Private ARR, cap tables, and customer lists stay `Not disclosed` until a licensed or first-party source exists.

## Taxonomy (Radar + Team Review)

`GEOGRAPHIES`, `SECTORS`, `STAGES`, `REVIEW_COLUMNS`, `SIGNALS` in `src/data/constants.ts` must stay in sync with the matching unions in `src/lib/types.ts`.
