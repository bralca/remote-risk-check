"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  Code2,
  Database,
  FileCheck2,
  FileText,
  FolderGit2,
  Gauge,
  GitBranch,
  Globe2,
  Hand,
  MessageSquareText,
  Play,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
  WalletCards,
  Zap
} from "lucide-react";
import {
  calculateImpact,
  resolveUrlState,
  summarizePortfolio
} from "@/lib/decision-engine";
import {
  agentSteps,
  getHire,
  hiringPortfolio,
  impactAssumptions
} from "@/lib/portfolio";
import type {
  AuditEntry,
  HireCase,
  HireOutcome,
  ProcessingRoute,
  ProposalView
} from "@/lib/types";

const outcomeCopy: Record<HireOutcome, string> = {
  READY: "Ready",
  CUSTOMER_ACTION: "Customer action",
  SPECIALIST_REVIEW: "Specialist review"
};

const routeCopy: Record<ProcessingRoute, string> = {
  rules_only: "Rules only",
  lightweight_ai: "Lightweight AI",
  advanced_ai: "Advanced AI + specialist",
  specialist: "Specialist"
};

const routeIcon = {
  rules_only: ShieldCheck,
  lightweight_ai: Zap,
  advanced_ai: BrainCircuit,
  specialist: UserCheck
};

const tabs: Array<{
  id: ProposalView;
  number: string;
  label: string;
  description: string;
}> = [
  {
    id: "product",
    number: "01",
    label: "Product",
    description: "Experience the decision"
  },
  {
    id: "behind",
    number: "02",
    label: "Behind the product",
    description: "System and economics"
  },
  {
    id: "vision",
    number: "03",
    label: "Vision",
    description: "Bounded autonomy"
  }
];

const pipeline = [
  {
    number: "01",
    icon: Database,
    title: "Remote-shaped sources",
    copy: "Company status, country schema, contract, evidence and reserve state.",
    output: "Raw evidence"
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Normalize first",
    copy: "Minimize PII, validate data, deduplicate and assign evidence IDs.",
    output: "Evidence packet"
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Policy before AI",
    copy: "Country rules resolve known requirements and safe standard paths.",
    output: "Policy state"
  },
  {
    number: "04",
    icon: Route,
    title: "Cost-aware router",
    copy: "Choose no model, lightweight extraction, advanced analysis or a specialist.",
    output: "Processing route"
  },
  {
    number: "05",
    icon: BrainCircuit,
    title: "Bounded AI",
    copy: "Extract, compare and summarize only the evidence relevant to the case.",
    output: "Structured brief"
  },
  {
    number: "06",
    icon: UserCheck,
    title: "Action and audit",
    copy: "Clear the standard case or give a person an evidence-ready exception.",
    output: "Defensible action"
  }
];

const allowedAgentActions = [
  "Retrieve and normalize evidence",
  "Validate known requirements",
  "Request missing information",
  "Send controlled follow-ups and reminders",
  "Update case status",
  "Auto-clear policy-covered cases",
  "Assemble audit-ready decision packets"
];

const humanRequiredActions = [
  "Require a reserve",
  "Hold or reject a customer",
  "Freeze or block payments",
  "Interpret a novel policy",
  "Resolve high-impact uncertainty"
];

function updateUrl(view: ProposalView, hireId: string) {
  const url = new URL(window.location.href);
  url.searchParams.delete("case");
  url.searchParams.set("view", view);
  url.searchParams.set("hire", hireId);
  window.history.replaceState({}, "", url);
}

export function ProposalExperience() {
  const [view, setView] = useState<ProposalView>("product");
  const [selectedHireId, setSelectedHireId] = useState("oliver-uk");
  const [audience, setAudience] = useState<"internal" | "customer">(
    "internal"
  );
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [agentStep, setAgentStep] = useState(-1);
  const [agentRunning, setAgentRunning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const selectedHire = getHire(selectedHireId);
  const summary = useMemo(() => summarizePortfolio(hiringPortfolio), []);
  const impact = useMemo(() => calculateImpact(impactAssumptions), []);
  const auditEntry = auditEntries.find(
    (entry) => entry.hireId === selectedHire.id
  );

  useEffect(() => {
    const state = resolveUrlState(window.location.search);
    setView(state.view);
    setSelectedHireId(state.hire.id);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const syncMotionPreference = () =>
      setPrefersReducedMotion(reducedMotion.matches);
    syncMotionPreference();
    reducedMotion.addEventListener("change", syncMotionPreference);
    return () =>
      reducedMotion.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!agentRunning) return;
    if (agentStep >= agentSteps.length - 1) {
      setAgentRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setAgentStep((step) => step + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [agentRunning, agentStep]);

  function selectView(nextView: ProposalView) {
    setView(nextView);
    updateUrl(nextView, selectedHireId);
    window.requestAnimationFrame(() =>
      document.getElementById("experience")?.scrollIntoView()
    );
  }

  function selectHire(hireId: string) {
    setSelectedHireId(hireId);
    setAudience("internal");
    updateUrl("product", hireId);
  }

  function recordDecision(hire: HireCase) {
    const decidedAt = new Date().toISOString();
    setAuditEntries((entries) => [
      {
        id: `${hire.id}-${decidedAt}`,
        hireId: hire.id,
        action: hire.decision.recommendedAction,
        actor: "Human reviewer",
        decidedAt,
        note: "Reserve review approved by human reviewer"
      },
      ...entries
    ]);
  }

  function runAgent() {
    setAgentStep(0);
    setAgentRunning(!prefersReducedMotion);
  }

  return (
    <div className="proposal-site">
      <SiteHeader onSelectView={selectView} />

      <main>
        <Hero onOpenProduct={() => selectView("product")} />

        <section className="experience-shell" aria-label="Product proposal">
          <div className="experience-tabs" role="tablist" aria-label="Proposal views">
            {tabs.map((tab) => (
              <button
                type="button"
                role="tab"
                id={`proposal-tab-${tab.id}`}
                aria-controls={`proposal-panel-${tab.id}`}
                aria-selected={view === tab.id}
                className={view === tab.id ? "active" : ""}
                data-testid={`view-${tab.id}`}
                key={tab.id}
                onClick={() => selectView(tab.id)}
              >
                <span>{tab.number}</span>
                <strong>{tab.label}</strong>
                <small>{tab.description}</small>
              </button>
            ))}
          </div>

          <div
            className="experience-panel"
            id={`proposal-panel-${view}`}
            role="tabpanel"
            aria-labelledby={`proposal-tab-${view}`}
          >
            {view === "product" && (
              <ProductView
                auditEntry={auditEntry}
                audience={audience}
                onAudienceChange={setAudience}
                onDecision={recordDecision}
                onSelectHire={selectHire}
                selectedHire={selectedHire}
                summary={summary}
              />
            )}
            {view === "behind" && <BehindView impact={impact} />}
            {view === "vision" && (
              <VisionView
                currentStep={agentStep}
                isRunning={agentRunning}
                onNext={() =>
                  {
                    setAgentRunning(false);
                    setAgentStep((step) =>
                      Math.min(step + 1, agentSteps.length - 1)
                    );
                  }
                }
                onPrevious={() =>
                  {
                    setAgentRunning(false);
                    setAgentStep((step) => Math.max(step - 1, 0));
                  }
                }
                onRun={runAgent}
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
          </div>
        </section>

        <BuildReceipt />
      </main>

      <footer className="proposal-footer">
        <div className="proposal-shell">
          <span>
            <strong>Alessio Carrà</strong> · Independent product proposal · 2026
          </span>
          <p>
            Synthetic, based only on public Remote documentation, and not
            affiliated with Remote.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SiteHeader({
  onSelectView
}: {
  onSelectView: (view: ProposalView) => void;
}) {
  return (
    <header className="proposal-header">
      <a className="proposal-brand" href="#top">
        <span className="proposal-brand-mark">AC</span>
        <span>
          <strong>Product proposal</strong>
          <small>Risk operations · Remote</small>
        </span>
      </a>

      <nav className="proposal-nav" aria-label="Primary navigation">
        <button type="button" onClick={() => onSelectView("product")}>
          Product
        </button>
        <button type="button" onClick={() => onSelectView("behind")}>
          System
        </button>
        <button type="button" onClick={() => onSelectView("vision")}>
          Vision
        </button>
      </nav>

      <a className="proposal-header-action" href="#experience">
        Open proposal
        <ArrowRight size={15} />
      </a>
    </header>
  );
}

function Hero({ onOpenProduct }: { onOpenProduct: () => void }) {
  return (
    <>
      <section className="proposal-hero proposal-shell" id="top">
        <div className="proposal-hero-copy">
          <span className="proposal-kicker">Product proposal for Remote</span>
          <h1>
            Clear standard hires.
            <span> Route only the exceptions.</span>
          </h1>
          <p>
            A country-aware EOR decision center that combines company risk,
            local employment requirements, cost-aware AI, and accountable
            human action.
          </p>
          <div className="proposal-hero-actions">
            <button
              className="proposal-button primary"
              type="button"
              onClick={onOpenProduct}
            >
              Experience the product
              <ArrowRight size={16} />
            </button>
            <a className="proposal-button secondary" href="#build">
              <Code2 size={16} />
              How it was built
            </a>
          </div>
          <div className="proposal-hero-meta">
            <span>
              <Globe2 size={15} />
              5 hires · 4 countries
            </span>
            <span>
              <Clock3 size={15} />
              90-second review
            </span>
            <span>
              <Sparkles size={15} />
              Built with Codex
            </span>
          </div>
        </div>

        <div className="business-model-card">
          <div className="business-model-top">
            <span>Why risk exists</span>
            <span className="synthetic-badge">Product context</span>
          </div>
          <div className="business-flow">
            <div>
              <Building2 size={20} />
              <span>
                <strong>Customer</strong>
                <small>Wants to hire abroad</small>
              </span>
            </div>
            <ArrowRight size={18} />
            <div className="business-flow-focus">
              <ShieldCheck size={20} />
              <span>
                <strong>Remote</strong>
                <small>Becomes legal employer</small>
              </span>
            </div>
            <ArrowRight size={18} />
            <div>
              <BriefcaseBusiness size={20} />
              <span>
                <strong>Employee</strong>
                <small>Receives local employment</small>
              </span>
            </div>
          </div>
          <p>
            Each hire creates country-specific contract, payroll, tax,
            benefits, termination, and financial obligations.
          </p>
          <div className="business-model-result">
            <Scale size={18} />
            <span>
              <small>The product decision</small>
              <strong>What is the lowest-cost safe route?</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="proposal-principle-bar" id="experience">
        <div className="proposal-shell">
          <span>Operating principle</span>
          <strong>Policy decides</strong>
          <i />
          <strong>Agent handles routine work</strong>
          <i />
          <strong>People own consequential action</strong>
        </div>
      </section>
    </>
  );
}

function ProductView({
  selectedHire,
  summary,
  audience,
  auditEntry,
  onSelectHire,
  onAudienceChange,
  onDecision
}: {
  selectedHire: HireCase;
  summary: ReturnType<typeof summarizePortfolio>;
  audience: "internal" | "customer";
  auditEntry: AuditEntry | undefined;
  onSelectHire: (id: string) => void;
  onAudienceChange: (audience: "internal" | "customer") => void;
  onDecision: (hire: HireCase) => void;
}) {
  const RouteIcon = routeIcon[selectedHire.route];

  return (
    <section className="product-view" data-testid="product-view">
      <div className="view-heading">
        <div>
          <span className="proposal-kicker">Working product slice</span>
          <h2>Multi-country onboarding queue</h2>
          <p>
            Standard cases continue. Fixable gaps become clear customer
            actions. Only meaningful exceptions reach a specialist.
          </p>
        </div>
        <span className="synthetic-badge">Synthetic · Remote-shaped fixtures</span>
      </div>

      <div className="company-overview">
        <div className="company-identity">
          <span className="company-avatar">{hiringPortfolio.companyInitials}</span>
          <span>
            <strong>{hiringPortfolio.companyName}</strong>
            <small>{hiringPortfolio.summary}</small>
          </span>
        </div>
        <div className="company-checks">
          {hiringPortfolio.companyChecks.map((check) => (
            <span key={check.id}>
              <Check size={13} />
              {check.label}: <strong>{check.value}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="portfolio-summary" aria-label="Portfolio outcomes">
        <div className="ready">
          <CircleCheck size={19} />
          <strong>{summary.ready} ready</strong>
          <span>Can continue</span>
        </div>
        <div className="action">
          <CircleAlert size={19} />
          <strong>{summary.customerAction} customer action</strong>
          <span>Remediable</span>
        </div>
        <div className="review">
          <UserCheck size={19} />
          <strong>{summary.specialistReview} specialist review</strong>
          <span>Human-owned</span>
        </div>
      </div>

      <div className="decision-center">
        <div className="hire-list" role="tablist" aria-label="Planned hires">
          <div className="hire-list-heading">
            <span>Planned hires</span>
            <small>Lowest-cost safe route</small>
          </div>
          {hiringPortfolio.hires.map((hire) => {
            const Icon = routeIcon[hire.route];
            return (
              <button
                type="button"
                role="tab"
                id={`hire-tab-${hire.id}`}
                aria-controls="decision-detail"
                aria-selected={selectedHire.id === hire.id}
                className={selectedHire.id === hire.id ? "active" : ""}
                data-testid={`hire-${hire.id}`}
                key={hire.id}
                onClick={() => onSelectHire(hire.id)}
              >
                <span className="hire-avatar">{hire.initials}</span>
                <span className="hire-copy">
                  <strong>{hire.name}</strong>
                  <small>
                    {hire.country} · {hire.role}
                  </small>
                </span>
                <span className={`hire-route ${hire.route}`}>
                  <Icon size={13} />
                  {routeCopy[hire.route]}
                </span>
                <span className={`outcome-pill ${hire.outcome.toLowerCase()}`}>
                  {outcomeCopy[hire.outcome]}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="decision-detail"
          id="decision-detail"
          role="tabpanel"
          aria-labelledby={`hire-tab-${selectedHire.id}`}
          aria-live="polite"
        >
          <div className="decision-detail-top">
            <div>
              <span className="country-code">{selectedHire.countryCode}</span>
              <span>
                <small>
                  {selectedHire.country} · Start {selectedHire.provisionalStartDate}
                </small>
                <h3>{selectedHire.decision.headline}</h3>
              </span>
            </div>
            <span
              className={`outcome-pill ${selectedHire.outcome.toLowerCase()}`}
            >
              {outcomeCopy[selectedHire.outcome]}
            </span>
          </div>

          <div className="decision-context">
            <span>
              <RouteIcon size={15} />
              {selectedHire.routeLabel}
            </span>
            <span>
              <ShieldCheck size={15} />
              {selectedHire.policyLabel}
            </span>
          </div>

          <div className="audience-toggle" role="tablist" aria-label="Decision audience">
            <button
              type="button"
              role="tab"
              aria-selected={audience === "internal"}
              className={audience === "internal" ? "active" : ""}
              onClick={() => onAudienceChange("internal")}
            >
              Internal decision
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={audience === "customer"}
              className={audience === "customer" ? "active" : ""}
              onClick={() => onAudienceChange("customer")}
            >
              Customer next step
            </button>
          </div>

          {audience === "internal" ? (
            <div className="internal-decision">
              <div className={`analysis-summary ${selectedHire.decision.aiUsed ? "ai" : "policy"}`}>
                <span>
                  {selectedHire.decision.aiUsed ? (
                    <Bot size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                </span>
                <div>
                  <strong>
                    {selectedHire.decision.aiUsed
                      ? "Evidence-grounded AI brief"
                      : "Deterministic policy result"}
                  </strong>
                  <p>{selectedHire.decision.summary}</p>
                </div>
              </div>

              <div className="evidence-block">
                <div className="block-heading">
                  <strong>Decision evidence</strong>
                  <small>Every claim maps to an evidence ID</small>
                </div>
                {selectedHire.evidence.map((evidence) => (
                  <div className="evidence-row" key={evidence.id}>
                    <span className={`evidence-dot ${evidence.tone}`} />
                    <span>
                      <strong>{evidence.label}</strong>
                      <small>{evidence.detail}</small>
                    </span>
                    <span>
                      <strong>{evidence.value}</strong>
                      <small>{evidence.id}</small>
                    </span>
                  </div>
                ))}
              </div>

              <div className="uncertainty-row">
                <CircleAlert size={16} />
                <span>
                  <strong>
                    {selectedHire.decision.missingInformation.length
                      ? "Still needed"
                      : "Known uncertainty"}
                  </strong>
                  <small>
                    {selectedHire.decision.missingInformation.length
                      ? selectedHire.decision.missingInformation.join(" · ")
                      : selectedHire.decision.uncertainty}
                  </small>
                </span>
              </div>
            </div>
          ) : (
            <div className="customer-decision">
              <MessageSquareText size={22} />
              <span className="proposal-kicker">Customer message</span>
              <h4>Here&apos;s what happens next</h4>
              <p>{selectedHire.customerMessage}</p>
              <small>
                Clear next step · private control logic remains internal
              </small>
            </div>
          )}

          <DecisionAction
            auditEntry={auditEntry}
            hire={selectedHire}
            onDecision={onDecision}
          />
        </div>
      </div>

      <details className="source-map">
        <summary>View fixture-to-source mapping</summary>
        <div>
          {hiringPortfolio.sources.map((source) => (
            <a
              href={source.documentationUrl}
              key={source.id}
              rel="noreferrer"
              target="_blank"
            >
              <span>
                <strong>{source.label}</strong>
                <small>{source.endpoint ?? "Conceptual internal input"}</small>
              </span>
              <span className={`source-kind ${source.kind}`}>
                {source.kind === "public_api" ? "Public API" : "Conceptual"}
              </span>
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}

function DecisionAction({
  hire,
  auditEntry,
  onDecision
}: {
  hire: HireCase;
  auditEntry: AuditEntry | undefined;
  onDecision: (hire: HireCase) => void;
}) {
  if (auditEntry) {
    return (
      <div className="decision-action recorded">
        <CheckCircle2 size={19} />
        <span>
          <strong>Human decision recorded</strong>
          <small>Reserve review approved · audit entry created</small>
        </span>
      </div>
    );
  }

  if (hire.requiredHumanApproval) {
    return (
      <div className="decision-action human">
        <span>
          <UserCheck size={18} />
          <span>
            <strong>A person owns this action.</strong>
            <small>The AI recommendation cannot execute itself.</small>
          </span>
        </span>
        <button type="button" onClick={() => onDecision(hire)}>
          Approve reserve review
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  if (hire.outcome === "CUSTOMER_ACTION") {
    return (
      <div className="decision-action action-ready">
        <MessageSquareText size={18} />
        <span>
          <strong>Controlled request ready</strong>
          <small>No model or specialist needed for a known missing item.</small>
        </span>
      </div>
    );
  }

  return (
    <div className="decision-action cleared">
      <CheckCircle2 size={18} />
      <span>
        <strong>Policy-cleared</strong>
        <small>Standard onboarding can continue without manual review.</small>
      </span>
    </div>
  );
}

function BehindView({
  impact
}: {
  impact: ReturnType<typeof calculateImpact>;
}) {
  const baselineWidth = 100;
  const routedWidth = (impact.routedCost / impact.baselineCost) * 100;

  return (
    <section className="behind-view" data-testid="behind-view">
      <div className="view-heading compact">
        <div>
          <span className="proposal-kicker">System and economics</span>
          <h2>Spend intelligence in proportion to risk.</h2>
          <p>
            Remote is the legal employer. The system must protect employment
            obligations while allowing good customers to start hiring quickly.
          </p>
        </div>
      </div>

      <div className="business-value-strip">
        <div>
          <WalletCards size={20} />
          <span>
            <strong>Revenue starts with active hires</strong>
            <small>Fewer false positives protect legitimate EOR growth.</small>
          </span>
        </div>
        <div>
          <Gauge size={20} />
          <span>
            <strong>Automation expands capacity</strong>
            <small>Specialist headcount does not need to scale case-for-case.</small>
          </span>
        </div>
        <div>
          <ShieldCheck size={20} />
          <span>
            <strong>Better routing limits loss</strong>
            <small>High-exposure exceptions still receive human judgment.</small>
          </span>
        </div>
      </div>

      <div className="pipeline-section">
        <div className="section-heading-row">
          <div>
            <span className="proposal-kicker">Technical pipeline</span>
            <h3>What goes in, what AI does, and what comes back.</h3>
          </div>
          <span className="pipeline-principle">
            <Zap size={15} />
            Rules before models
          </span>
        </div>
        <div className="pipeline-grid">
          {pipeline.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.number}>
                <div>
                  <span>{step.number}</span>
                  <Icon size={19} />
                </div>
                <strong>{step.title}</strong>
                <p>{step.copy}</p>
                <small>{step.output}</small>
                {index < pipeline.length - 1 && (
                  <ArrowRight className="pipeline-arrow" size={16} />
                )}
              </article>
            );
          })}
        </div>
      </div>

      <div className="routing-contract">
        <div className="routing-lanes">
          <div className="route-lane rules">
            <ShieldCheck size={18} />
            <span>
              <strong>Standard</strong>
              <small>Rules only · €0 model spend</small>
            </span>
          </div>
          <div className="route-lane light">
            <Zap size={18} />
            <span>
              <strong>Bounded extraction</strong>
              <small>Lightweight model</small>
            </span>
          </div>
          <div className="route-lane advanced">
            <BrainCircuit size={18} />
            <span>
              <strong>Ambiguous or exposed</strong>
              <small>Advanced model + specialist</small>
            </span>
          </div>
        </div>
        <div className="ai-contract">
          <span className="proposal-kicker">Structured AI contract</span>
          <code>
            {"{"} summary, trigger, evidence_ids, missing_information,
            uncertainty, recommended_route {"}"}
          </code>
          <p>
            AI extracts, compares, and explains. It cannot create policy or
            execute reserves, holds, rejections, or freezes.
          </p>
        </div>
      </div>

      <div className="impact-card" data-testid="impact-card">
        <div className="impact-copy">
          <span className="proposal-kicker">Illustrative operating leverage</span>
          <strong className="impact-number">
            −{Math.round(impact.reductionPercent)}%
          </strong>
          <h3>cost per safe decision</h3>
          <p>
            Standard work moves to deterministic policy. Expensive reasoning
            and specialist time remain concentrated on meaningful exceptions.
          </p>
          <span className="illustrative-note">
            Illustrative scenario · not Remote operational data
          </span>
        </div>

        <div className="impact-chart" aria-label="Cost per decision comparison">
          <div className="bar-row">
            <div>
              <span>Manual baseline</span>
              <strong>€{impact.baselineCost.toFixed(2)}</strong>
            </div>
            <span className="bar-track">
              <i style={{ width: `${baselineWidth}%` }} />
            </span>
            <small>12 specialist minutes per case</small>
          </div>
          <div className="bar-row routed">
            <div>
              <span>Cost-aware routing</span>
              <strong>€{impact.routedCost.toFixed(2)}</strong>
            </div>
            <span className="bar-track">
              <i style={{ width: `${routedWidth}%` }} />
            </span>
            <small>60% rules · 20% light · 20% advanced + specialist</small>
          </div>
          <div className="scale-caption">
            <Sparkles size={17} />
            <span>
              At 100,000 cases, every €1 removed per case represents €100,000
              in potential annual operating savings.
            </span>
          </div>
        </div>
      </div>

      <div className="impact-reasons">
        {[
          "No generative-model cost for standard cases",
          "Bounded tasks use lightweight models",
          "Advanced reasoning is reserved for real ambiguity",
          "Specialists receive evidence-ready exceptions"
        ].map((reason) => (
          <span key={reason}>
            <Check size={14} />
            {reason}
          </span>
        ))}
      </div>

      <details className="assumptions">
        <summary>See the assumptions and formula</summary>
        <div className="assumptions-grid">
          <div>
            <strong>Baseline</strong>
            <span>12 min × €60/hour = €12.00</span>
          </div>
          {impactAssumptions.routes.map((route) => (
            <div key={route.id}>
              <strong>{Math.round(route.share * 100)}% {route.label}</strong>
              <span>€{route.costPerCase.toFixed(2)} per routed case</span>
            </div>
          ))}
          <div>
            <strong>Weighted result</strong>
            <span>
              €{impact.routedCost.toFixed(2)} · potential annual savings €
              {Math.round(impact.annualSavings).toLocaleString("en-IE")}
            </span>
          </div>
        </div>
      </details>

      <details className="assumptions source-boundary">
        <summary>See public and conceptual source boundaries</summary>
        <div className="assumptions-grid">
          {hiringPortfolio.sources.map((source) => (
            <a
              href={source.documentationUrl}
              key={source.id}
              rel="noreferrer"
              target="_blank"
            >
              <strong>{source.label}</strong>
              <span>
                {source.kind === "public_api"
                  ? source.endpoint
                  : "Conceptual internal input"}
              </span>
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}

function VisionView({
  currentStep,
  isRunning,
  prefersReducedMotion,
  onRun,
  onNext,
  onPrevious
}: {
  currentStep: number;
  isRunning: boolean;
  prefersReducedMotion: boolean;
  onRun: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const activeStep = currentStep >= 0 ? agentSteps[currentStep] : undefined;

  return (
    <section className="vision-view" data-testid="vision-view">
      <div className="view-heading compact">
        <div>
          <span className="proposal-kicker">Future state</span>
          <h2>Autonomous case operations, within policy.</h2>
          <p>
            The agent handles evidence, follow-ups, and routine resolution. It
            stops when judgment becomes consequential.
          </p>
        </div>
        <div className="run-agent-wrap">
          <button
            className="run-agent"
            type="button"
            onClick={onRun}
            aria-describedby="agent-motion-note"
          >
            {currentStep >= agentSteps.length - 1 ? (
              <RefreshCw size={16} />
            ) : (
              <Play size={16} />
            )}
            {isRunning
              ? "Agent running…"
              : currentStep >= 0
                ? "Run again"
                : "Run agent"}
          </button>
          <small>Simulation only · no model call or external write</small>
        </div>
      </div>
      <p className="sr-only" id="agent-motion-note">
        {prefersReducedMotion
          ? "Reduced motion is enabled. Use the next and previous controls to step through the case."
          : "The timeline advances automatically and also provides manual controls."}
      </p>

      <div className="vision-maturity">
        <div>
          <span>Today</span>
          <strong>AI evidence brief</strong>
        </div>
        <ArrowRight size={18} />
        <div>
          <span>Next</span>
          <strong>Case orchestration</strong>
        </div>
        <ArrowRight size={18} />
        <div className="active">
          <span>Vision</span>
          <strong>Bounded autonomy</strong>
        </div>
      </div>

      <div className="agent-workspace">
        <div className="agent-case">
          <div className="agent-case-header">
            <span className="company-avatar small">OG</span>
            <span>
              <strong>Oliver Grant · United Kingdom</strong>
              <small>VP Engineering · EOR onboarding case</small>
            </span>
            <span className="agent-live">
              <i className={isRunning ? "running" : ""} />
              {isRunning ? "Processing" : currentStep < 0 ? "Ready" : "Paused"}
            </span>
          </div>

          <div className="agent-timeline">
            {agentSteps.map((step, index) => {
              const isComplete = index <= currentStep;
              const isActive = index === currentStep;
              return (
                <div
                  className={`${isComplete ? "complete" : ""} ${isActive ? "active" : ""}`}
                  key={step.id}
                >
                  <span className={`agent-step-dot ${step.status}`}>
                    {isComplete ? <Check size={12} /> : index + 1}
                  </span>
                  <span>
                    <strong>{step.label}</strong>
                    <small>{isComplete || currentStep < 0 ? step.detail : "Waiting for previous step"}</small>
                  </span>
                  <em>{step.actor}</em>
                </div>
              );
            })}
          </div>

          <div className="agent-controls">
            <button
              type="button"
              disabled={currentStep <= 0}
              onClick={onPrevious}
              aria-label="Previous agent step"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {activeStep
                ? `${currentStep + 1} of ${agentSteps.length} · ${activeStep.label}`
                : "Run the case to see each decision"}
            </span>
            <button
              type="button"
              disabled={currentStep < 0 || currentStep >= agentSteps.length - 1}
              onClick={onNext}
              aria-label="Next agent step"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="agent-boundaries">
          <div className="allowed">
            <span>
              <Bot size={19} />
              Agent may
            </span>
            {allowedAgentActions.map((action) => (
              <p key={action}>
                <Check size={14} />
                {action}
              </p>
            ))}
          </div>
          <div className="human">
            <span>
              <Hand size={19} />
              Human required
            </span>
            {humanRequiredActions.map((action) => (
              <p key={action}>
                <UserCheck size={14} />
                {action}
              </p>
            ))}
          </div>
          <div className="alternate-path">
            <GitBranch size={20} />
            <span>
              <strong>The alternate standard path</strong>
              <small>
                If evidence were complete and terms standard, deterministic
                policy would clear the case automatically. AI would not decide.
              </small>
            </span>
          </div>
        </div>
      </div>

      <div className="escalation-rule">
        <CircleAlert size={18} />
        <p>
          Escalation follows <strong>exposure, uncertainty, legal consequence,
          evidence conflict, and policy novelty</strong>. Account value can
          change service priority—not the standard of compliance scrutiny.
        </p>
      </div>
    </section>
  );
}

function BuildReceipt() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <section className="build-receipt proposal-shell" id="build">
      <div>
        <span className="proposal-kicker">Build receipt</span>
        <h2>A working product, not a slide deck.</h2>
        <p>
          Official-doc research → product decision → synthetic data contract →
          UX → code → automated tests → public release.
        </p>
      </div>
      <div className="receipt-facts">
        <span>
          <Code2 size={17} />
          <strong>Codex</strong>
          <small>AI development partner</small>
        </span>
        <span>
          <ShieldCheck size={17} />
          <strong>Rules + AI + human</strong>
          <small>Explicit authority boundaries</small>
        </span>
        <span>
          <FileCheck2 size={17} />
          <strong>25 automated checks</strong>
          <small>17 unit · 8 end-to-end</small>
        </span>
        <span>
          <Clock3 size={17} />
          <strong>35-minute implementation</strong>
          <small>Measured from plan lock to verified build</small>
        </span>
      </div>
      <div className="receipt-links">
        <a
          href="https://github.com/bralca/remote-risk-check"
          rel="noreferrer"
          target="_blank"
        >
          <FolderGit2 size={16} />
          Repository
        </a>
        <a href={`${basePath}/product-note`}>
          <FileText size={16} />
          Product note
        </a>
        <a href={`${basePath}/alessio-carra-resume.pdf`}>
          <FileText size={16} />
          Tailored résumé
        </a>
        <a href={`${basePath}/remote-risk-check-walkthrough.mp4`}>
          <Play size={16} />
          Walkthrough
        </a>
      </div>
    </section>
  );
}
