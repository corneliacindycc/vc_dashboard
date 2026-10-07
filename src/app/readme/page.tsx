import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const mono = JetBrains_Mono({ subsets: ["latin"] });

const shots = {
  overview: "/readme/01-overview.png",
  radar: "/readme/02-radar.png",
  company: "/readme/03-company.png",
  agentInput: "/readme/04-agent-input.png",
  agentReport: "/readme/05-agent-report.png",
  review: "/readme/06-team-review.png",
  reviewDetail: "/readme/07-review-detail.png",
  portfolio: "/readme/08-portfolio.png",
  portfolioDetail: "/readme/09-portfolio-detail.png",
} as const;

export default function ReadmePage() {
  return (
    <div className={`${mono.className} min-h-screen bg-[#0d1117] text-[#e6edf3]`}>
      <div className="mx-auto max-w-[1012px] px-4 py-6 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-md border border-[#30363d] bg-[#0d1117]">
          <header className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 text-[12px] text-[#8b949e]">
            <span className="text-[#e6edf3]">README.md</span>
            <span>vc-internal-pipeline · MIT</span>
          </header>

          <div className="gh-md px-4 py-8 md:px-10 md:py-10">
            <h1>Venture Capital Internal Pipeline</h1>
            <p className="lead">
              Open-source venture capital OS — Discover → Diligence → Decide → Support. Demo prototype. Not a live data
              platform.
            </p>
            <p>
              Live demo:{" "}
              <a href="https://vc-internal-pipeline.vercel.app/">https://vc-internal-pipeline.vercel.app/</a>
            </p>

            <h2>Why this exists</h2>
            <p>
              Most “AI for VC” demos are a chatbot that summarises a deck. Investment work is a pipeline: find the company,
              pressure-test the file, capture judgment, then help after the cheque.
            </p>
            <p>
              Rather than a pile of disconnected AI features, this maps that work into one workflow and asks{" "}
              <strong>what should stay human, and what can be automated?</strong>
            </p>
            <p>
              Discovery, first-pass research, evidence gathering, and a structured diligence pack can be prepared by a system.
              Conviction, the investment thesis, and the invest / pass decision stay with the team. For portfolio companies the
              question is less “how do we score this?” and more <strong>“how can we help?”</strong> — capital, partnerships,
              expansion, talent, or GTM.
            </p>
            <p>
              That thinking became the product: <strong>Deal Radar</strong> for sourcing and pipeline intelligence;{" "}
              <strong>INA</strong> for evidence-based diligence; <strong>Team Review</strong> for discussion, conviction, and
              decisions; <strong>Portfolio</strong> for value creation; and <strong>Overview</strong> as the morning desk.
            </p>
            <p>
              One principle:{" "}
              <strong>
                if something is unknown, it stays <code>Not disclosed</code>. It doesn&apos;t get invented just to make the
                dashboard look complete.
              </strong>
            </p>
            <p>
              Fit scores, theses, and value-creation ideas here are <strong>illustrative synthetic demo data</strong>. They are
              not a real firm’s model, not live market data, and not advice.
            </p>

            <h2>Product walkthrough</h2>
            <p>
              If you have ~8 minutes, follow this path. Screenshots are the live UI (demo environment). Click through the app to
              repeat it.
            </p>

            <h3>1. Overview — the morning desk</h3>
            <p>
              <Link href="/">Overview</Link> is the first screen. Pipeline counts, priority opportunities, emerging signals, team
              actions (from live review state), and portfolio attention.
            </p>
            <Shot src={shots.overview} caption="Overview — morning KPIs and priority files" />

            <h3>2. Deal Radar — APAC discovery</h3>
            <p>
              <Link href="/radar">Deal Radar</Link> is the opportunity layer. Filter Singapore to surface{" "}
              <strong>Grab</strong>, <strong>Ninja Van</strong> and <strong>Carousell</strong>. Names are real; financials stay{" "}
              <code>Not disclosed</code> unless they appear in the public source.
            </p>
            <Shot src={shots.radar} caption="APAC Deal Radar — public ingest, filters, opportunity cards" />

            <h3>3. Company profile — one record</h3>
            <p>
              Open a company for founders, funding, signals, and evidence. Same object is used in diligence, review, and
              (if invested) portfolio.
            </p>
            <Shot src={shots.company} caption="Grab company profile (Wikipedia ingest)" />

            <h3>4. INA — Investment Analyst Agent</h3>
            <p>
              <Link href="/agent">INA</Link> looks like a research runner. This demo does not call an LLM. You still upload
              docs / paste URLs; <strong>Run diligence</strong> plays a progress sequence, then loads a pre-generated report.
            </p>
            <Shot src={shots.agentInput} caption="Agent input — company, documents, analysis type" />
            <p>
              Full packs exist for the three heroes (executive summary through sources, evidence drawer, gaps, founder questions,
              analyst override). Other names get a shallow screen.
            </p>
            <Shot src={shots.agentReport} caption="Grab — public-source screen, unknowns stay Not disclosed" />

            <h3>5. Team Review — pipeline and judgment</h3>
            <p>
              <Link href="/review">Team Review</Link> is a CRM-style pipeline. Owner, conviction, thesis, notes (append-only),
              next action, decision. <code>Invested</code> creates a portfolio record. <code>Pass</code> stays in history.
            </p>
            <Shot src={shots.review} caption="Kanban — coloured stage headers, review cards" />
            <Shot src={shots.reviewDetail} caption="Review detail — judgment fields, not a second AI dashboard" />

            <h3>6. Portfolio — how can we help?</h3>
            <p>
              Twelve synthetic portfolio names. Attention chips mark open support work. Value
              creation is Capital / Partnerships / Expansion / Talent / GTM / Strategic.
            </p>
            <Shot src={shots.portfolio} caption="Portfolio grid — attention highlighted" />
            <Shot src={shots.portfolioDetail} caption="Canva — value-creation opportunities (demo support scenarios)" />

            <h3>7. Activity</h3>
            <p>
              Activity is a notification peek (not a full page). Badge count is the feed. Reset Demo in the sidebar restores
              seed data.
            </p>

            <h2>Demo vs production</h2>
            <table>
              <thead>
                <tr>
                  <th>Now</th>
                  <th>Later</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Wikipedia / homepage ingest, public-info DD screens</td>
                  <td>Live discovery, scheduled morning crawl (metrics you set)</td>
                </tr>
                <tr>
                  <td>No LLM / search / CRM keys</td>
                  <td>LLM/RAG on data room + public web, CRM sync</td>
                </tr>
                <tr>
                  <td>Browser localStorage for mutations</td>
                  <td>Shared team database, audit log</td>
                </tr>
              </tbody>
            </table>
            <p>
              UI talks to provider interfaces, not arrays in React components — so live services can replace the demo layer
              without rebuilding screens.
            </p>

            <h2>Personalize it</h2>
            <p>
              Fork the OS for your firm. Grep <code>CUSTOMIZE:</code> for every fork point. Team roster is{" "}
              <code>TeamMember</code> plus <code>TEAM</code>; mandate and INA weights live in{" "}
              <code>src/data/mandate.ts</code>; companies go in <code>src/data/ingest-targets.json</code> then{" "}
              <code>npm run ingest</code>; live APIs replace methods in <code>src/lib/providers/index.ts</code>.
              Handbook: <code>docs/CUSTOMIZE.md</code> in the repo (same map as the GitHub README).
            </p>

            <h2>Stack</h2>
            <p>
              <code>Next.js</code> (App Router) · <code>TypeScript</code> · <code>Tailwind CSS</code> · desktop-first · no auth
              in this prototype
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Shot({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption}
        className="w-full rounded-md border border-[#30363d]"
      />
      <figcaption className="mt-2 text-center text-[12px] text-[#8b949e]">{caption}</figcaption>
    </figure>
  );
}
