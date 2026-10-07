"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ActivityPeek } from "./ActivityPeek";
import { DemoBadge } from "./DemoBadge";
import { SearchPalette } from "./SearchPalette";
import { useDemoStore } from "@/lib/store";

// CUSTOMIZE: branding — product name in the sidebar, nav labels, and wordmark below
const NAV = [
  { href: "/", label: "Overview" },
  { href: "/radar", label: "Deal Radar" },
  { href: "/agent", label: "Investment Agent" },
  { href: "/review", label: "Team Review" },
  { href: "/portfolio", label: "Portfolio" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetDemo, state } = useDemoStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setActivityOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`min-h-screen text-ink ${pathname === "/readme" ? "bg-[#0d1117]" : "bg-paper"}`}>
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[232px] flex-col bg-ink text-white">
        <div className="border-b border-white/10 px-5 py-6">
          <Link href="/" className="display block text-[12px] leading-[1.15] tracking-tight">
            VENTURE CAPITAL
            <br />
            INTERNAL PIPELINE
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2.5 text-sm ${
                  active ? "bg-white text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setActivityOpen(true)}
            className={`mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm ${
              activityOpen ? "bg-white text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>Activity</span>
            <span
              className={`min-w-6 rounded-md px-1.5 py-0.5 text-center text-[11px] ${
                activityOpen ? "bg-brand text-white" : "bg-white/15 text-white"
              }`}
            >
              {state.activity.length}
            </span>
          </button>
          <Link
            href="/readme"
            className={`rounded-xl px-3 py-2.5 font-mono text-[13px] ${
              pathname === "/readme" ? "bg-white text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            README.md
          </Link>
        </nav>

        <div className="space-y-3 border-t border-white/10 px-3 py-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full rounded-xl border border-white/20 px-3 py-2 text-left text-sm text-white/75 hover:text-white"
          >
            Search…
            <span className="mt-0.5 block text-[11px] text-white/40">⌘K</span>
          </button>
          <DemoBadge />
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset demo state to the curated seed?")) resetDemo();
            }}
            className="px-1 text-xs text-white/50 hover:text-white"
          >
            Reset Demo
          </button>
        </div>
      </aside>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ActivityPeek open={activityOpen} onClose={() => setActivityOpen(false)} />
      <main className="min-h-screen pl-[232px]">{children}</main>
    </div>
  );
}
