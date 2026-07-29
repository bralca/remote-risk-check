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
  Layers3,
  PlayCircle,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap
} from "lucide-react";
import { RiskCheck } from "@/components/risk-check";

const fitItems = [
  {
    value: "0 → $10M",
    label: "ARR in 9 months",
    detail: "Built and scaled API products at Moralis"
  },
  {
    value: "2×",
    label: "revenue growth",
    detail: "Growth leadership across Pipe and Celsius"
  },
  {
    value: "12+ yrs",
    label: "building products",
    detail: "Platform, growth, APIs, and operational systems"
  }
];

export default function Home() {
  const initialCaseId = "reserve-required";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Remote Risk Check",
    headline: "Should Remote let this company hire?",
    description:
      "An independent AI-assisted EOR risk product exploration for Remote's Senior Product Manager, Fraud and Compliance role.",
    author: {
      "@type": "Person",
      name: "Alessio Carrà"
    },
    about: [
      "AI-assisted risk operations",
      "Credit risk",
      "Reserve management",
      "KYB",
      "Compliance automation",
      "Human-in-the-loop decision systems"
    ],
    isAccessibleForFree: true
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Risk Check home">
          <span className="brand-mark" aria-hidden="true">
            <ShieldCheck size={19} strokeWidth={2.4} />
          </span>
          <span>
            <strong>Risk Check</strong>
            <small>Independent product exploration</small>
          </span>
        </a>

        <nav aria-label="Primary navigation">
          <a href="#demo">Demo</a>
          <a href="#thinking">Product thinking</a>
          <a href="#fit">Why me</a>
        </nav>

        <a className="header-cta" href="#demo">
          Review the case
          <ArrowDown size={15} />
        </a>
      </header>

      <main id="top">
        <section className="hero page-shell">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Built for Remote’s Senior PM, Fraud &amp; Compliance role
            </div>

            <h1>
              Should Remote let this company{" "}
              <span className="accent-word">hire?</span>
            </h1>

            <p className="hero-lede">
              A working, AI-assisted EOR risk check that turns KYB, credit, and
              reserve signals into one clear, auditable next step.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#demo">
                Review a case
                <ArrowDown size={17} />
              </a>
              <a
                className="button button-secondary"
                href={`${basePath}/remote-risk-check-walkthrough.mp4`}
                target="_blank"
              >
                <PlayCircle size={17} />
                Watch 55-sec walkthrough
              </a>
            </div>

            <div className="hero-meta" aria-label="Project details">
              <span>
                <Clock3 size={15} />
                60-second review
              </span>
              <span>
                <Check size={15} />
                No login
              </span>
              <span>
                <Code2 size={15} />
                Built with Codex
              </span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustrative risk decision">
            <div className="visual-glow" />
            <div className="preview-window">
              <div className="preview-topbar">
                <div className="preview-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span>Employer eligibility</span>
                <span className="synthetic-tag">Synthetic</span>
              </div>

              <div className="preview-body">
                <div className="preview-company">
                  <span className="company-avatar">AR</span>
                  <span>
                    <strong>Atlas Robotics Ltd</strong>
                    <small>United Kingdom · 5 planned hires</small>
                  </span>
                </div>

                <div className="decision-banner yellow">
                  <span className="status-icon" aria-hidden="true">
                    <Scale size={19} />
                  </span>
                  <span>
                    <small>Recommended action</small>
                    <strong>Proceed after a risk reserve</strong>
                  </span>
                  <span className="confidence">High confidence</span>
                </div>

                <div className="preview-signals">
                  <div>
                    <span>Company age</span>
                    <strong>7 months</strong>
                  </div>
                  <div>
                    <span>Monthly payroll</span>
                    <strong>€128K</strong>
                  </div>
                  <div>
                    <span>Payment terms</span>
                    <strong>30 days</strong>
                  </div>
                </div>

                <div className="human-check">
                  <span className="human-icon">
                    <UserCheck size={18} />
                  </span>
                  <span>
                    <strong>AI recommends. A person decides.</strong>
                    <small>High-impact actions always require approval.</small>
                  </span>
                </div>
              </div>
            </div>

            <span className="floating-note note-left">
              <Bot size={16} />
              Evidence linked
            </span>
            <span className="floating-note note-right">
              <ShieldCheck size={16} />
              Human approved
            </span>
          </div>
        </section>

        <section className="proof-strip" aria-label="Project capabilities">
          <div className="page-shell proof-strip-inner">
            <span>What this proves</span>
            <div>
              <Bot size={17} />
              AI-assisted investigation
            </div>
            <div>
              <Braces size={17} />
              Configurable risk rules
            </div>
            <div>
              <UserCheck size={17} />
              Human-approved decisions
            </div>
          </div>
        </section>

        <RiskCheck initialCaseId={initialCaseId} />

        <section className="thinking-section page-shell" id="thinking">
          <div className="section-heading centered">
            <span className="section-kicker">The product judgment</span>
            <h2>Automation should remove work—not accountability.</h2>
            <p>
              The system keeps facts, recommendations, and decisions separate.
              That makes it faster for operators and defensible for Risk,
              Treasury, Legal, and customers.
            </p>
          </div>

          <div className="principle-grid">
            <article>
              <span className="principle-number">01</span>
              <span className="principle-icon purple">
                <Braces size={22} />
              </span>
              <h3>Rules decide the status</h3>
              <p>
                Structured, versioned policy determines green, yellow, or red.
                Operations can understand why every rule fired.
              </p>
            </article>
            <article>
              <span className="principle-number">02</span>
              <span className="principle-icon blue">
                <Sparkles size={22} />
              </span>
              <h3>AI makes evidence usable</h3>
              <p>
                The investigator brief summarizes signals, cites its inputs,
                surfaces uncertainty, and asks for what is missing.
              </p>
            </article>
            <article>
              <span className="principle-number">03</span>
              <span className="principle-icon green">
                <UserCheck size={22} />
              </span>
              <h3>People own the action</h3>
              <p>
                Clear, reserve, and hold actions require explicit human
                approval and leave a readable audit trail.
              </p>
            </article>
          </div>

          <div className="business-case">
            <div>
              <span className="section-kicker">Why this matters to Remote</span>
              <h3>Trust is part of the product—and the growth engine.</h3>
              <p>
                Remote operates employment and payroll infrastructure across
                borders. Better risk decisions protect that infrastructure
                while letting legitimate companies hire without unnecessary
                delay.
              </p>
              <a
                href="https://remote.com/openings/7814948003"
                target="_blank"
                rel="noreferrer"
              >
                See the role this responds to
                <ArrowUpRight size={15} />
              </a>
            </div>

            <ul>
              <li>
                <span>
                  <Zap size={18} />
                </span>
                <div>
                  <strong>Scale without linear operations work</strong>
                  <p>Clear routine cases and focus people on exceptions.</p>
                </div>
              </li>
              <li>
                <span>
                  <Scale size={18} />
                </span>
                <div>
                  <strong>Protect payroll and employment exposure</strong>
                  <p>Use reversible reserves when uncertainty is financial.</p>
                </div>
              </li>
              <li>
                <span>
                  <Layers3 size={18} />
                </span>
                <div>
                  <strong>Reduce avoidable customer friction</strong>
                  <p>Explain the next step without exposing control logic.</p>
                </div>
              </li>
              <li>
                <span>
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <strong>Keep decisions defensible</strong>
                  <p>Link every recommendation and approval to evidence.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="fit-section" id="fit">
          <div className="page-shell">
            <div className="fit-intro">
              <div>
                <span className="section-kicker light">
                  Why I can build this
                </span>
                <h2>I’ve spent my career turning complex platforms into growth.</h2>
              </div>
              <p>
                I’m not presenting myself as a career compliance specialist.
                I’m showing the transferable product strengths Remote asks for:
                platform thinking, APIs, growth judgment, AI fluency, and the
                ability to ship.
              </p>
            </div>

            <div className="fit-metrics">
              {fitItems.map((item) => (
                <article key={item.value}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>

            <div className="fit-links">
              <a href={`${basePath}/alessio-carra-resume.pdf`}>
                <FileText size={18} />
                View résumé
              </a>
              <a href={`${basePath}/product-note`}>
                <Layers3 size={18} />
                Read product note
              </a>
              <a
                href="https://github.com/bralca/remote-risk-check"
                target="_blank"
                rel="noreferrer"
              >
                <FolderGit2 size={18} />
                Review GitHub repository
              </a>
            </div>
          </div>
        </section>

        <section className="technical-section page-shell" id="technical-details">
          <div className="section-heading">
            <span className="section-kicker">Proof under the surface</span>
            <h2>Simple to review. Serious enough to inspect.</h2>
          </div>

          <div className="technical-grid">
            <details>
              <summary>
                <span>
                  <Code2 size={19} />
                  What is actually working?
                </span>
                <span className="summary-plus">+</span>
              </summary>
              <div>
                <p>
                  Three typed synthetic cases run through a deterministic,
                  tested policy engine. Changing policy updates the assessment;
                  human approval creates an in-session audit record.
                </p>
              </div>
            </details>
            <details>
              <summary>
                <span>
                  <Bot size={19} />
                  What does AI do here?
                </span>
                <span className="summary-plus">+</span>
              </summary>
              <div>
                <p>
                  Precomputed briefs turn structured evidence into a concise
                  investigation narrative. They cite source fields, expose
                  uncertainty, and cannot execute an action.
                </p>
              </div>
            </details>
            <details>
              <summary>
                <span>
                  <ShieldCheck size={19} />
                  Is it compatible with Remote?
                </span>
                <span className="summary-plus">+</span>
              </summary>
              <div>
                <p>
                  A server-side adapter verifies Remote-shaped webhook
                  signatures, timestamps, supported event types, and replay
                  attempts. No credentials are needed for this public demo.
                </p>
              </div>
            </details>
          </div>
        </section>

        <section className="closing-cta">
          <div className="page-shell closing-inner">
            <span className="closing-icon">
              <Sparkles size={24} />
            </span>
            <div>
              <span className="section-kicker light">Built, not just specified</span>
              <h2>One small product. One clear point of view.</h2>
              <p>
                AI can make risk operations faster—when evidence stays visible
                and people keep control of consequential decisions.
              </p>
            </div>
            <a className="button button-light" href="#demo">
              Try another case
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="page-shell footer-inner">
          <div>
            <strong>Risk Check</strong>
            <span>Built by Alessio Carrà with Codex · 2026</span>
          </div>
          <p>
            Independent, synthetic, and inspired only by Remote’s public
            documentation. Not affiliated with Remote.
          </p>
          <a
            href="https://github.com/bralca/remote-risk-check"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>

      <noscript>
        <section className="noscript-summary">
          <h2>Project summary</h2>
          <p>
            Risk Check is an independent AI-assisted EOR product exploration
            for Remote’s Senior Product Manager, Fraud and Compliance role. It
            demonstrates deterministic credit-risk and KYB decisions,
            evidence-linked AI summaries, reserve management, false-positive
            tradeoffs, APIs, and human approval.
          </p>
        </section>
      </noscript>
    </>
  );
}
