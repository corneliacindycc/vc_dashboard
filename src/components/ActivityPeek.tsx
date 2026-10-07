"use client";

import Link from "next/link";
import { useDemoStore } from "@/lib/store";

export function ActivityPeek({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state } = useDemoStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close activity"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-[420px] flex-col bg-paper text-ink">
        <header className="flex items-start justify-between border-b border-black/10 px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink/45">Notifications</p>
            <h2 className="display mt-1 text-2xl">Activity</h2>
          </div>
          <button type="button" className="text-sm text-ink/50 hover:text-ink" onClick={onClose}>
            Close
          </button>
        </header>
        <ol className="flex-1 overflow-y-auto">
          {state.activity.map((a) => (
            <li key={a.id} className="border-b border-black/10 px-6 py-4">
              <p className="text-[11px] uppercase tracking-wide text-ink/40">
                {new Date(a.at).toLocaleString()} · {a.kind}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{a.text}</p>
              {a.companyId && (
                <Link
                  className="mt-2 inline-block text-sm text-brand"
                  href={`/companies/${a.companyId}`}
                  onClick={onClose}
                >
                  Open company
                </Link>
              )}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
