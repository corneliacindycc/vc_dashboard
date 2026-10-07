"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageMasthead } from "@/components/PageMasthead";
import { providers } from "@/lib/providers";
import { useDemoStore } from "@/lib/store";
import { ANALYSIS_TYPES } from "@/data/mandate";
import type { AnalysisType } from "@/lib/types";

export default function AgentHome() {
  const router = useRouter();
  const { state } = useDemoStore();
  const companies = providers.companies.list();
  const [name, setName] = useState("");
  const [urls, setUrls] = useState("https://");
  const [type, setType] = useState<AnalysisType>(ANALYSIS_TYPES[1]);
  const [files, setFiles] = useState<string[]>([]);

  const match = companies.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase() || c.id === name.trim(),
  );

  // CUSTOMIZE: INA model API — call your LLM/backend here, persist a DiligenceReport, then navigate. Demo only routes to a preloaded pack.
  function run() {
    const id = match?.id;
    if (!id) {
      alert("Unknown company in the demo dataset. Type a tracked name (e.g. Grab) or pick from the list.");
      return;
    }
    router.push(`/agent/${id}?type=${encodeURIComponent(type)}`);
  }

  const PRELOADED = ["grab", "ninja-van", "carousell", "goto", "razorpay", "airwallex"];
  const saved = companies.filter(
    (c) => PRELOADED.includes(c.id) || state.savedAnalyses.includes(c.id),
  );

  return (
    <>
      <PageMasthead
        title="INVESTMENT ANALYST AGENT"
        subtitle="Hi, I’m INA — your Investment Analyst Agent. I’ll accelerate the research and diligence so you can stay on what only you can do: review the file and make the call."
      />
      <div className="mx-auto max-w-[900px] px-8 py-16 md:px-12">
        <aside className="mb-12 border border-black/10 bg-white p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-ink/50">Demo remark</p>
          <p className="mt-3 text-[17px] leading-relaxed">
            This demo site is not connected to a model API. Uploaded documents and attached links are not processed. Run
            diligence still opens a pre-generated pack for a tracked company name. To see what a finished result looks
            like, explore the preloaded analyses below.
          </p>
          <a href="#preloaded" className="mt-4 inline-block text-sm text-brand">
            Jump to preloaded analyses →
          </a>
        </aside>

        <label className="block text-sm font-medium">Company name</label>
        <input
          list="cos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3"
          placeholder="Required — e.g. Grab"
        />
        <datalist id="cos">
          {companies.map((c) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>

        <label className="mt-8 block text-sm font-medium">Upload documents</label>
        <p className="text-sm text-ink/50">
          Pitch deck, financials, data-room files. In this demo, files are not read — the company name maps to a
          pre-generated analysis.
        </p>
        <input
          type="file"
          multiple
          className="mt-2 block w-full text-sm"
          onChange={(e) =>
            setFiles(Array.from(e.target.files ?? []).map((f) => `${f.name} · received`))
          }
        />
        <ul className="mt-2 text-sm text-ink/60">
          {files.map((f) => (
            <li key={f}>Upload status: {f}</li>
          ))}
        </ul>

        <label className="mt-8 block text-sm font-medium">External links</label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3"
          rows={3}
        />

        <label className="mt-8 block text-sm font-medium">Analysis type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as AnalysisType)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3"
        >
          {ANALYSIS_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <button type="button" className="btn btn-blue mt-10" onClick={run}>
          Run diligence
        </button>

        <section id="preloaded" className="mt-20 scroll-mt-8">
          <h2 className="display text-3xl">Preloaded analyses</h2>
          <p className="mt-3 text-sm text-ink/55">
            Open one of these to see a finished INA report from the curated demo data.
          </p>
          <ul className="mt-4 divide-y divide-black/10">
            {saved.map((c) => (
              <li key={c.id} className="py-3">
                <Link className="text-brand" href={`/agent/${c.id}`}>
                  {c.name}
                </Link>
                <span className="ml-2 text-sm text-ink/50">{c.country}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
