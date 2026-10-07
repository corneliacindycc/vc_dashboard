"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cloneSeedState, seed } from "@/data/seed";
import { DEFAULT_OWNER, STORAGE_KEY } from "@/data/constants";
import { providers } from "@/lib/providers";
import type {
  ActivityEvent,
  Company,
  Decision,
  DemoState,
  DiligenceReport,
  NextAction,
  ReviewStatus,
  TeamMember,
  TeamNote,
  TeamReview,
  ValueCreationOpportunity,
} from "@/lib/types";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function loadState(): DemoState {
  const base = cloneSeedState();
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as DemoState;
    return {
      ...base,
      ...parsed,
      reviews: parsed.reviews ?? base.reviews,
      notes: parsed.notes ?? base.notes,
      portfolio: parsed.portfolio ?? base.portfolio,
      valueCreation: parsed.valueCreation ?? base.valueCreation,
      activity: parsed.activity ?? base.activity,
      overrides: parsed.overrides ?? {},
      savedAnalyses: parsed.savedAnalyses ?? base.savedAnalyses,
    };
  } catch {
    return base;
  }
}

let memory = cloneSeedState();
const serverSnapshot = cloneSeedState();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

// CUSTOMIZE: reviews and portfolio persistence — replace localStorage with your CRM/database
function persist(next: DemoState) {
  memory = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): DemoState {
  if (typeof window === "undefined") return memory;
  if (!hydrated) {
    memory = loadState();
    hydrated = true;
  }
  return memory;
}

function getServerSnapshot(): DemoState {
  return serverSnapshot;
}

type StoreApi = {
  state: DemoState;
  resetDemo: () => void;
  company: (id: string) => Company | undefined;
  reviewFor: (companyId: string) => TeamReview | undefined;
  notesFor: (companyId: string) => TeamNote[];
  addToTeamReview: (companyId: string, owner?: TeamMember) => void;
  updateReview: (companyId: string, patch: Partial<TeamReview>) => void;
  addNote: (companyId: string, author: TeamMember, text: string) => void;
  setDecision: (
    companyId: string,
    decision: Decision,
    rationale: string,
    status?: ReviewStatus,
  ) => void;
  markInvested: (companyId: string) => void;
  overrideScore: (companyId: string, score: number, reason: string, by: TeamMember) => void;
  saveAnalysis: (companyId: string) => void;
  updateValueCreation: (id: string, patch: Partial<ValueCreationOpportunity>) => void;
  addValueCreation: (item: Omit<ValueCreationOpportunity, "id">) => void;
  log: (text: string, companyId?: string, kind?: ActivityEvent["kind"]) => void;
  diligenceFor: (companyId: string) => DiligenceReport | undefined;
};

const StoreContext = createContext<StoreApi | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const log = useCallback(
    (text: string, companyId?: string, kind: ActivityEvent["kind"] = "system") => {
      const s = getSnapshot();
      persist({
        ...s,
        activity: [
          { id: uid("act"), at: nowIso(), text, companyId, kind },
          ...s.activity,
        ],
      });
    },
    [],
  );

  const api = useMemo<StoreApi>(() => {
    const company = (id: string) => providers.companies.get(id);
    const reviewFor = (companyId: string) =>
      state.reviews.find((r) => r.companyId === companyId);
    const notesFor = (companyId: string) =>
      state.notes.filter((n) => n.companyId === companyId);
    const diligenceFor = (companyId: string) =>
      providers.diligence.getByCompany(companyId);

    return {
      state,
      company,
      reviewFor,
      notesFor,
      diligenceFor,
      log,
      resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY);
        persist(cloneSeedState());
      },
      addToTeamReview: (companyId, owner = DEFAULT_OWNER) => {
        const s = getSnapshot();
        if (s.reviews.some((r) => r.companyId === companyId)) return;
        const c = providers.companies.get(companyId);
        const review: TeamReview = {
          id: uid("tr"),
          companyId,
          owner,
          status: "New",
          conviction: 3,
          thesis: "",
          whyNow: "",
          concerns: "",
          whatChangesMyMind: "",
          nextAction: "Research further",
          nextActionDate: new Date().toISOString().slice(0, 10),
          decision: null,
          decisionRationale: "",
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        persist({ ...s, reviews: [review, ...s.reviews] });
        log(`${owner} added ${c?.name ?? companyId} to Team Review.`, companyId, "review");
      },
      updateReview: (companyId, patch) => {
        const s = getSnapshot();
        persist({
          ...s,
          reviews: s.reviews.map((r) =>
            r.companyId === companyId
              ? { ...r, ...patch, updatedAt: nowIso() }
              : r,
          ),
        });
        if (patch.status) {
          const c = providers.companies.get(companyId);
          log(`Status → ${patch.status} for ${c?.name ?? companyId}.`, companyId, "review");
        }
        if (patch.status === "Invested") {
          const c = providers.companies.get(companyId);
          const snap = getSnapshot();
          if (!snap.portfolio.some((p) => p.companyId === companyId)) {
            persist({
              ...snap,
              portfolio: [
                {
                  id: uid("pf"),
                  companyId,
                  fund: "Early Stage Fund 3",
                  investmentStage: c?.stage ?? "Seed",
                  investmentDate: new Date().toISOString().slice(0, 10),
                  status: "Invested",
                  notes: "Entered portfolio from Team Review (demo).",
                },
                ...snap.portfolio,
              ],
            });
            log(`${c?.name ?? companyId} is now in Portfolio.`, companyId, "portfolio");
          }
        }
      },
      addNote: (companyId, author, text) => {
        const s = getSnapshot();
        const note: TeamNote = {
          id: uid("note"),
          companyId,
          author,
          text,
          createdAt: nowIso(),
        };
        persist({ ...s, notes: [note, ...s.notes] });
        const c = providers.companies.get(companyId);
        log(`${author} added a note on ${c?.name ?? companyId}.`, companyId, "note");
      },
      setDecision: (companyId, decision, rationale, status) => {
        const s = getSnapshot();
        let nextStatus = status;
        if (!nextStatus && decision === "Invest") nextStatus = "Invested";
        if (!nextStatus && decision === "Pass") nextStatus = "Pass";
        if (!nextStatus && decision === "Hold") nextStatus = "Watchlist";
        if (!nextStatus && decision === "Advance") nextStatus = "Due Diligence";
        persist({
          ...s,
          reviews: s.reviews.map((r) =>
            r.companyId === companyId
              ? {
                  ...r,
                  decision,
                  decisionRationale: rationale,
                  status: nextStatus ?? r.status,
                  updatedAt: nowIso(),
                }
              : r,
          ),
        });
        const c = providers.companies.get(companyId);
        log(
          `Decision ${decision} on ${c?.name ?? companyId}.`,
          companyId,
          "decision",
        );
        if (nextStatus === "Invested") {
          const snap = getSnapshot();
          if (!snap.portfolio.some((p) => p.companyId === companyId)) {
            persist({
              ...snap,
              portfolio: [
                {
                  id: uid("pf"),
                  companyId,
                  fund: "Early Stage Fund 3",
                  investmentStage: c?.stage ?? "Seed",
                  investmentDate: new Date().toISOString().slice(0, 10),
                  status: "Invested",
                  notes: "Entered portfolio from Team Review (demo).",
                },
                ...snap.portfolio,
              ],
            });
            log(`${c?.name ?? companyId} is now in Portfolio.`, companyId, "portfolio");
          }
        }
      },
      markInvested: (companyId) => {
        const s = getSnapshot();
        persist({
          ...s,
          reviews: s.reviews.map((r) =>
            r.companyId === companyId
              ? { ...r, status: "Invested" as ReviewStatus, decision: "Invest" as Decision, updatedAt: nowIso() }
              : r,
          ),
        });
        const c = providers.companies.get(companyId);
        const snap = getSnapshot();
        if (!snap.portfolio.some((p) => p.companyId === companyId)) {
          persist({
            ...snap,
            portfolio: [
              {
                id: uid("pf"),
                companyId,
                fund: "Early Stage Fund 3",
                investmentStage: c?.stage ?? "Seed",
                investmentDate: new Date().toISOString().slice(0, 10),
                status: "Invested",
                notes: "Entered portfolio from Team Review (demo).",
              },
              ...snap.portfolio,
            ],
          });
        }
        log(`${c?.name ?? companyId} marked Invested.`, companyId, "portfolio");
      },
      overrideScore: (companyId, score, reason, by) => {
        const s = getSnapshot();
        persist({
          ...s,
          overrides: {
            ...s.overrides,
            [companyId]: { score, reason, by, at: nowIso() },
          },
        });
        const c = providers.companies.get(companyId);
        log(`${by} overrode AI fit score for ${c?.name ?? companyId} to ${score}.`, companyId, "review");
      },
      saveAnalysis: (companyId) => {
        const s = getSnapshot();
        if (s.savedAnalyses.includes(companyId)) return;
        persist({ ...s, savedAnalyses: [...s.savedAnalyses, companyId] });
        const c = providers.companies.get(companyId);
        log(`Saved analysis for ${c?.name ?? companyId}.`, companyId, "diligence");
      },
      updateValueCreation: (id, patch) => {
        const s = getSnapshot();
        persist({
          ...s,
          valueCreation: s.valueCreation.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        });
        log("Value-creation opportunity updated.", undefined, "portfolio");
      },
      addValueCreation: (item) => {
        const s = getSnapshot();
        persist({
          ...s,
          valueCreation: [{ ...item, id: uid("vc") }, ...s.valueCreation],
        });
        log("New value-creation opportunity added.", undefined, "portfolio");
      },
    };
  }, [state, log]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return ctx;
}

export function useSeedMeta() {
  return seed;
}

export type { NextAction };
