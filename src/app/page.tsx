import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Braces,
  Check,
  Clock3,
  Code2,
  FileText,
  FolderGit2,
  Gauge,
  PlayCircle,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { RiskCheck } from "@/components/risk-check";

const productChoices = [
  {
    number: "01",
    icon: Braces,
    title: "Rules own the outcome.",
    copy: "A deterministic, versioned policy produces the green, yellow, or red status. AI cannot change it."
  },
  {
    number: "02",
    icon: Bot,
    title: "AI owns the explanation.",
    copy: "AI turns structured evidence into a concise brief, cites the relevant signals, and states uncertainty."
  },
  {
    number: "03",
    icon: UserCheck,
    title: "People own the action.",
    copy: "Clear, reserve, and hold recommendations require an explicit approval and create an audit record."
  }
];

const buildStats = [
  { value: "49 min", label: "first release" },
  { value: "Codex", label: "GPT-5" },
  { value: "≈721k", label: "context tokens*" },
  { value: "13", label: "automated checks" },
  { value: "5", label: "source commits" },
  { value: "99", label: "desktop performance" }
];

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Employer Eligibility — a product proposal for Remote",
    headline: "Should Remote let this company hire?",
    description:
      "A working employer-eligibility product proposal by Alessio Carrà: deterministic policy, AI explanation, and human-approved decisions.",
    author: {
      "@type": "Person",
      name: "Alessio Carrà"
    },
    isAccessibleForFree: true
  };

  return (
    <div className="proposal-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="proposal-header">
        <a className="proposal-brand" href="#top">
          <span className="proposal-brand-mark">AC</span>
          <span>
            <strong>Product proposal</strong>
            <small>Employer eligibility</small>
          </span>
        </a>

        <nav className="proposal-nav" aria-label="Primary navigation">
          <a href="#proposal">Proposal</a>
          <a href="#choices">Decisions</a>
          <a href="#build">Build note</a>
        </nav>

        <a className="proposal-header-action" href="#proposal">
          Open proposal
          <ArrowDown size={15} />
        </a>
      </header>

      <main id="top">
        <section className="proposal-hero proposal-shell">
          <div className="proposal-hero-copy">
            <span className="proposal-kicker">
              Product proposal for Remote
            </span>
            <h1>Should Remote let this company hire?</h1>
            <p>
              My proposal: let policy decide the status, use AI to explain the
              evidence, and keep the consequential action with a person.
            </p>
            <div className="proposal-hero-actions">
              <a className="proposal-button primary" href="#proposal">
                See the proposal
                <ArrowDown size={16} />
              </a>
              <a
                className="proposal-button secondary"
                href={`${basePath}/remote-risk-check-walkthrough.mp4`}
                target="_blank"
              >
                <PlayCircle size={17} />
                51-sec walkthrough
              </a>
            </div>
            <div className="proposal-hero-meta">
              <span>
                <Check size={15} />
                One workflow
              </span>
              <span>
                <Clock3 size={15} />
                60-second review
              </span>
              <span>
                <Code2 size={15} />
                Built with Codex
              </span>
            </div>
          </div>

          <div className="proposal-hero-card" aria-label="Proposal summary">
            <div className="proposal-hero-card-top">
              <span>Employer eligibility</span>
              <span className="proposal-live-badge">Synthetic case</span>
            </div>
            <div className="proposal-hero-company">
              <span className="proposal-company-avatar">AR</span>
              <span>
                <strong>Atlas Robotics Ltd</strong>
                <small>United Kingdom · 5 planned hires</small>
              </span>
            </div>
            <div className="proposal-hero-result">
              <span className="proposal-result-icon">
                <ShieldCheck size={20} />
              </span>
              <span>
                <small>Recommended action</small>
                <strong>Require €128K reserve</strong>
              </span>
              <span className="proposal-status yellow">Action needed</span>
            </div>
            <ol className="proposal-hero-flow">
              <li>
                <Braces size={17} />
                <span>
                  <strong>Policy decided</strong>
                  <small>Yellow · rule CR-04</small>
                </span>
              </li>
              <li>
                <Bot size={17} />
                <span>
                  <strong>AI explained</strong>
                  <small>3 evidence signals cited</small>
                </span>
              </li>
              <li>
                <UserCheck size={17} />
                <span>
                  <strong>Approval required</strong>
                  <small>No automatic action</small>
                </span>
              </li>
            </ol>
          </div>
        </section>

        <section className="proposal-principle-bar">
          <div className="proposal-shell">
            <span>One clear point of view</span>
            <strong>Rules decide</strong>
            <i />
            <strong>AI explains</strong>
            <i />
            <strong>People approve</strong>
          </div>
        </section>

        <RiskCheck initialCaseId="reserve-required" />

        <section className="proposal-choices proposal-shell" id="choices">
          <div className="proposal-section-heading">
            <span className="proposal-kicker">The product judgment</span>
            <h2>Three deliberate choices.</h2>
            <p>
              The proposal is intentionally narrow: one EOR onboarding
              decision, with a clear boundary between automation and
              accountability.
            </p>
          </div>

          <div className="proposal-choice-grid">
            {productChoices.map((choice) => {
              const Icon = choice.icon;
              return (
                <article key={choice.number}>
                  <div>
                    <span className="proposal-choice-icon">
                      <Icon size={20} />
                    </span>
                    <span className="proposal-choice-number">
                      {choice.number}
                    </span>
                  </div>
                  <h3>{choice.title}</h3>
                  <p>{choice.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="proposal-remote-fit">
          <div className="proposal-shell proposal-fit-layout">
            <div>
              <span className="proposal-kicker light">Why this is Remote-specific</span>
              <h2>Not a generic risk demo.</h2>
            </div>
            <div className="proposal-fit-points">
              <a
                href="https://developer.remote.com/docs/eor-hiring-eligibility"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Eligibility already uses green, yellow, and red.</strong>
                <span>
                  This proposal makes the evidence and next action legible.
                </span>
                <ArrowUpRight size={16} />
              </a>
              <a
                href="https://support.remote.com/hc/en-us/articles/12695731865229-What-is-a-reserve-payment"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Reserves are a real financial control.</strong>
                <span>
                  The product shows why one is required and what happens next.
                </span>
                <ArrowUpRight size={16} />
              </a>
              <a
                href="https://remote.com/blog/whats-new-remote-product-updates-may-july-2026"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Remote is moving reserve visibility earlier.</strong>
                <span>
                  The proposal extends that transparency into the decision.
                </span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="proposal-proof proposal-shell">
          <div className="proposal-proof-main">
            <span className="proposal-kicker">Why I can build it</span>
            <h2>
              I turn complex platforms into products people can understand and
              adopt.
            </h2>
            <p>
              Twelve years across platform, API, growth, and operational
              products—paired with the ability to use AI tooling to go from
              ambiguity to a tested release.
            </p>
            <div className="proposal-proof-actions">
              <a
                className="proposal-button primary"
                href={`${basePath}/alessio-carra-resume.pdf`}
              >
                <FileText size={17} />
                View tailored résumé
              </a>
              <a
                className="proposal-text-link"
                href={`${basePath}/product-note`}
              >
                Read product note
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="proposal-proof-metrics">
            <div>
              <strong>12+ years</strong>
              <span>building products</span>
            </div>
            <div>
              <strong>0 → $10M</strong>
              <span>ARR in 9 months</span>
            </div>
            <div>
              <strong>2×</strong>
              <span>revenue growth</span>
            </div>
          </div>
        </section>

        <section className="proposal-build proposal-shell" id="build">
          <div className="proposal-build-heading">
            <div>
              <span className="proposal-kicker">Build receipt</span>
              <h2>How this was made.</h2>
            </div>
            <p>
              Official-doc research → product slice → UX → code → tests →
              public release. The demo uses synthetic data and precomputed AI
              briefs; no live model can take an action.
            </p>
          </div>

          <div className="proposal-build-stats">
            {buildStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="proposal-build-footer">
            <p>
              * Approximate context processed during the first end-to-end
              build, including cached context and tool output—not an API cost
              estimate.
            </p>
            <div>
              <a
                href="https://github.com/bralca/remote-risk-check"
                target="_blank"
                rel="noreferrer"
              >
                <FolderGit2 size={16} />
                Repository
              </a>
              <a
                href={`${basePath}/remote-risk-check-walkthrough.mp4`}
                target="_blank"
              >
                <PlayCircle size={16} />
                Walkthrough
              </a>
              <span>
                <Gauge size={16} />
                100 a11y · BP · SEO
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="proposal-footer">
        <div className="proposal-shell">
          <span>
            <strong>Alessio Carrà</strong> · Product proposal · 2026
          </span>
          <p>
            Independent, synthetic, and based only on Remote’s public
            documentation. Not affiliated with Remote.
          </p>
        </div>
      </footer>
    </div>
  );
}
