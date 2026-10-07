import Link from "next/link";

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "attention" | "positive" | "risk" | "info";
}) {
  const label =
    tone === "attention"
      ? "Attention"
      : tone === "positive"
        ? "Positive"
        : tone === "risk"
          ? "Risk"
          : tone === "info"
            ? "Info"
            : "Status";
  const shell =
    tone === "attention"
      ? "border-brand/25 bg-[#E8F1FF] text-brand"
      : "border-black/10 bg-white";
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-xs ${shell}`}>
      <span className={tone === "attention" ? "text-brand/70" : "text-ink/40"}>{label}</span>
      <span className="font-medium">{children}</span>
    </span>
  );
}

export function ClaimLabel({ kind }: { kind: "FACT" | "AI INTERPRETATION" | "TEAM VIEW" }) {
  return (
    <span className="mr-2 inline-block text-[10px] font-semibold uppercase tracking-wide text-ink/50">
      {kind}
    </span>
  );
}

export function OriginTag({ origin }: { origin: "public" | "synthetic" }) {
  if (origin === "public") {
    return <span className="text-[11px] uppercase tracking-wide text-ink/40">Public</span>;
  }
  return (
    <span className="text-[11px] uppercase tracking-wide text-ink/40">Demo company</span>
  );
}

export function FitScore({ score, label = "Investment fit" }: { score: number; label?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink/50">{label}</p>
      <p className="display text-3xl">{score}/100</p>
    </div>
  );
}

export function LogoMark({ initials }: { initials: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

export function KpiCard({
  href,
  label,
  value,
  hint,
}: {
  href: string;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-black/10 bg-white p-5 hover:border-brand"
    >
      <p className="text-[11px] uppercase tracking-wide text-ink/50">{label}</p>
      <p className="display mt-3 text-4xl">{value}</p>
      {hint && <p className="mt-2 text-sm text-ink/60">{hint}</p>}
    </Link>
  );
}
