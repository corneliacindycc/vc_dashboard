/**
 * CUSTOMIZE: swap Wikipedia for a licensed Affinity / Crunchbase / news API. Keep ToS:
 * do not scrape Crunchbase, PitchBook, or LinkedIn HTML. Wikipedia REST + Wikidata
 * are the default public ingest (CC BY-SA — keep source URLs).
 *
 *   npm run ingest
 *
 * Writes src/data/ingested.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.join(__dirname, "..");
const TARGETS = path.join(ROOT, "src/data/ingest-targets.json");
const OUT = path.join(ROOT, "src/data/ingested.json");
const UA =
  "VCInternalPipeline/0.1 (open-source VC pipeline demo; https://github.com/corneliacindycc/vc_dashboard)";

function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function yearFromIso(iso) {
  if (!iso || typeof iso !== "string") return "Not disclosed";
  const y = iso.slice(0, 4);
  return /^\d{4}$/.test(y) ? y : "Not disclosed";
}

async function wikiSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`Wikipedia ${res.status} for ${title}`);
  return res.json();
}

async function wikidataWebsiteAndInception(title) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=${encodeURIComponent(
    title.replace(/_/g, " "),
  )}&props=claims&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) return { website: null, foundedYear: null };
  const json = await res.json();
  const entity = json.entities && Object.values(json.entities)[0];
  if (!entity || entity.missing) return { website: null, foundedYear: null };
  const claims = entity.claims || {};
  const site =
    claims.P856?.[0]?.mainsnak?.datavalue?.value ||
    null;
  const inception =
    claims.P571?.[0]?.mainsnak?.datavalue?.value?.time || null;
  return { website: site, foundedYear: inception ? yearFromIso(inception.replace("+", "")) : null };
}

async function homepageBlurb(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const desc =
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1] ||
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1];
    return desc ? desc.replace(/\s+/g, " ").trim().slice(0, 600) : null;
  } catch {
    return null;
  }
}

function toCompany(target, kind, summary, wikiExtra) {
  const extract = (summary.extract || target.oneLiner).trim();
  const wikiUrl = summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${target.wikipedia}`;
  const website = wikiExtra.website || target.website;
  const foundedYear = wikiExtra.foundedYear || "Not disclosed";
  return {
    id: target.id,
    name: target.name,
    logoInitials: initials(target.name),
    website,
    country: target.country,
    city: target.city,
    foundedYear,
    sector: target.sector,
    subSector: target.subSector,
    stage: target.stage,
    description: extract,
    businessModel: "Not disclosed",
    pipelineStatus: target.pipelineStatus,
    origin: "public",
    source: `Wikipedia · ${wikiUrl}`,
    wikipediaUrl: wikiUrl,
    knownInvestors: ["Not disclosed"],
    fundingSummary: "Not disclosed (public encyclopedia extract only)",
    opportunityScore: target.opportunityScore,
    fitBand: target.fitBand,
    whyItMatters: target.oneLiner,
    oneLiner: target.oneLiner,
    createdAt: "2026-09-01",
    updatedAt: new Date().toISOString().slice(0, 10),
    hero: target.hero,
    book: kind,
  };
}

async function main() {
  const spec = JSON.parse(fs.readFileSync(TARGETS, "utf8"));
  const companies = [];
  const founders = [];
  const skipped = [];

  async function ingest(target, kind) {
    try {
      let summary = null;
      let extra = { website: null, foundedYear: null };
      try {
        summary = await wikiSummary(target.wikipedia);
        extra = await wikidataWebsiteAndInception(target.wikipedia);
      } catch {
        summary = null;
      }
      if (!summary) {
        const blurb = await homepageBlurb(target.website);
        summary = {
          extract: blurb || `${target.oneLiner}. Public company; no English Wikipedia article at ingest time.`,
          content_urls: { desktop: { page: target.website } },
        };
        extra = { website: target.website, foundedYear: null };
        process.stdout.write(`web  ${target.id}\n`);
      } else {
        process.stdout.write(`wiki ${target.id}\n`);
      }
      companies.push(toCompany(target, kind, summary, extra));
      (target.founders || []).forEach((f, i) => {
        founders.push({
          id: `f-${target.id}-${i + 1}`,
          companyId: target.id,
          name: f.name,
          role: f.role,
          bio: "Publicly reported founder. No private biography in this dataset.",
          previousCompanies: [],
          domainExpertise: "Not disclosed",
          technicalBackground: "Not disclosed",
        });
      });
    } catch (err) {
      skipped.push({ id: target.id, error: String(err.message || err) });
      process.stdout.write(`skip ${target.id}  ${err.message}\n`);
    }
    await new Promise((r) => setTimeout(r, 350));
  }

  for (const t of spec.radar) await ingest(t, "radar");
  for (const t of spec.portfolio) await ingest(t, "portfolio");

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: "Wikipedia REST API + Wikidata (CC BY-SA). Not Crunchbase/PitchBook.",
    licenseNote:
      "Wikipedia text is CC BY-SA. Keep attribution on company.source. Re-run npm run ingest to refresh.",
    companies,
    founders,
    skipped,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${companies.length} companies to src/data/ingested.json (${skipped.length} skipped)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
