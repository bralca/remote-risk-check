"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
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
  Hand,
  MessageSquareText,
  Play,
  RefreshCw,
  Route,
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
  CUSTOMER_ACTION: "Needs information",
  SPECIALIST_REVIEW: "Specialist review"
};

const routeCopy: Record<ProcessingRoute, string> = {
  rules_only: "Country rules",
  lightweight_ai: "AI document check",
  advanced_ai: "AI summary + specialist",
  specialist: "Specialist review"
};

const routeExplanation: Record<ProcessingRoute, string> = {
  rules_only: "Country rules can answer this case; AI is not used",
  lightweight_ai: "AI reads one document; country rules make the decision",
  advanced_ai: "AI summarizes the evidence; a specialist makes the decision",
  specialist: "A specialist reviews the case because the rules cannot resolve it"
};

const routeIcon = {
  rules_only: ShieldCheck,
  lightweight_ai: Zap,
  advanced_ai: BrainCircuit,
  specialist: UserCheck
};

const tabs: Array<{
  id: ProposalView;
  label: string;
  description: string;
}> = [
  {
    id: "product",
    label: "Product",
    description: "Review the five hires"
  },
  {
    id: "explanation",
    label: "How it works",
    description: "Problem, process, AI, cost and limits"
  }
];

const pipeline = [
  {
    number: "01",
    icon: Database,
    title: "Collect the information already attached to the case",
    copy:
      "The review starts with company verification, the country-specific onboarding form, the employment contract, employee documents and any existing reserve status.",
    output: "Case information"
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Clean the information and label every source",
    copy:
      "The system checks required fields, removes duplicates and gives every fact an evidence ID. This makes it possible to show exactly what supported the result.",
    output: "Clean evidence"
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Check the known country rules first",
    copy:
      "If the country requirements are clear and the case is standard, ordinary software rules can decide what happens next. There is no reason to call an AI model.",
    output: "Rules result"
  },
  {
    number: "04",
    icon: Route,
    title: "Choose the simplest review that can answer the question",
    copy:
      "A missing required document becomes a customer request. A document that only needs reading uses a small model. Ambiguous or high-impact cases receive a fuller summary and a specialist.",
    output: "Review method"
  },
  {
    number: "05",
    icon: BrainCircuit,
    title: "Ask AI for a structured summary when it is useful",
    copy:
      "The model may extract fields, compare evidence and explain a conflict. It must cite the evidence it used and state what is missing or uncertain.",
    output: "Reviewer summary"
  },
  {
    number: "06",
    icon: UserCheck,
    title: "Show the next step and record who decided",
    copy:
      "The case can continue, ask the customer for a specific item, or stop for specialist review. Decisions that affect reserves, holds or rejection remain with a person.",
    output: "Recorded next step"
  }
];

const allowedAgentActions = [
  "Collect and organize the evidence already in the case",
  "Check required information against known country rules",
  "Ask the customer for a specific missing document",
  "Send an approved reminder if the document is still missing",
  "Update the case status after new information arrives",
  "Continue a complete, standard case covered by an approved rule",
  "Prepare a cited summary for a specialist"
];

const humanRequiredActions = [
  "Require or change an onboarding reserve",
  "Place a customer on hold or reject the case",
  "Freeze or block a payment",
  "Interpret a new or unclear policy",
  "Resolve uncertainty with significant legal or financial consequences"
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
      <SiteHeader onSelectView={selectView} view={view} />

      <main className="proposal-main">
        <section
          className="experience-shell"
          id="experience"
          aria-label="Onboarding review product"
        >
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
            {view === "explanation" && (
              <div className="explanation-view" data-testid="explanation-view">
                <BehindView impact={impact} />
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
                <BuildReceipt />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SiteHeader({
  view,
  onSelectView
}: {
  view: ProposalView;
  onSelectView: (view: ProposalView) => void;
}) {
  return (
    <header className="proposal-header">
      <div className="proposal-brand">
        <span className="proposal-brand-mark">
          <ShieldCheck size={18} />
        </span>
        <span>
          <strong>Onboarding review</strong>
          <small>Interactive product concept for Remote</small>
        </span>
      </div>

      <nav className="proposal-nav" role="tablist" aria-label="Page views">
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
            onClick={() => onSelectView(tab.id)}
          >
            <strong>{tab.label}</strong>
            <small>{tab.description}</small>
          </button>
        ))}
      </nav>

      <span className="proposal-header-note">Demo data only</span>
    </header>
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
      <div className="product-intro">
        <div>
          <h1>Onboarding reviews</h1>
          <p>
            Atlas Robotics plans to hire five people through Remote in four
            countries. Select a hire to see which country requirements were
            checked, what evidence supports the result, and whether the case
            can continue, needs information from the customer, or requires a
            specialist.
          </p>
        </div>
        <span className="synthetic-badge">Fictional company and employees</span>
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
          <span>Country rules allow onboarding to continue</span>
        </div>
        <div className="action">
          <CircleAlert size={19} />
          <strong>{summary.customerAction} needs information</strong>
          <span>The customer must provide one missing item</span>
        </div>
        <div className="review">
          <UserCheck size={19} />
          <strong>{summary.specialistReview} specialist review</strong>
          <span>A person must make the final decision</span>
        </div>
      </div>

      <div className="decision-center">
        <div className="hire-list" role="tablist" aria-label="Planned hires">
          <div className="hire-list-heading">
            <span>Planned hires</span>
            <small>Review method and current status</small>
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
              {routeExplanation[selectedHire.route]}
            </span>
            <span>
              <ShieldCheck size={15} />
              Rules used: {selectedHire.policyLabel}
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
              Review details
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={audience === "customer"}
              className={audience === "customer" ? "active" : ""}
              onClick={() => onAudienceChange("customer")}
            >
              Customer message
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
                      ? "AI summary prepared for the reviewer"
                      : "Result from the country rules"}
                  </strong>
                  <p>{selectedHire.decision.summary}</p>
                </div>
              </div>

              <div className="evidence-block">
                <div className="block-heading">
                  <strong>Evidence used for this result</strong>
                  <small>Each statement is linked to its source in the case</small>
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
                      ? "Information still needed"
                      : "What remains uncertain"}
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
              <span className="proposal-kicker">Message shown to the customer</span>
              <h4>What the customer needs to know</h4>
              <p>{selectedHire.customerMessage}</p>
              <small>
                The customer sees the required next step, not internal risk
                rules or model instructions.
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
            <strong>A UK specialist makes this decision.</strong>
            <small>
              AI can summarize the evidence, but it cannot approve or require
              the reserve.
            </small>
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
          <strong>Customer request ready to send</strong>
          <small>
            The rules identify the missing item, so no AI model or specialist
            is needed.
          </small>
        </span>
      </div>
    );
  }

  return (
    <div className="decision-action cleared">
      <CheckCircle2 size={18} />
      <span>
        <strong>Onboarding can continue</strong>
        <small>
          The country requirements are complete and no manual review is needed.
        </small>
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
          <span className="proposal-kicker">Why this product exists</span>
          <h1>How the onboarding review works</h1>
          <p>
            When a customer hires through an employer-of-record service, Remote
            becomes the legal employer. Contract terms, required documents,
            payroll obligations and financial exposure differ by country and
            by employment. The product therefore reviews each hire separately.
            It uses ordinary rules for clear cases, AI only for work that
            benefits from reading or comparing documents, and a specialist for
            decisions with significant consequences.
          </p>
        </div>
      </div>

      <div className="business-value-strip">
        <div>
          <WalletCards size={20} />
          <span>
            <strong>A hire cannot start until the review is complete</strong>
            <small>
              Unnecessary delays frustrate the customer and postpone the start
              of the employment.
            </small>
          </span>
        </div>
        <div>
          <Gauge size={20} />
          <span>
            <strong>Most complete, standard cases should not need a specialist</strong>
            <small>
              Country rules can handle repeated checks and leave people more
              time for cases that genuinely require judgment.
            </small>
          </span>
        </div>
        <div>
          <ShieldCheck size={20} />
          <span>
            <strong>High-impact decisions still belong to a person</strong>
            <small>
              A reserve, hold, rejection or new interpretation of policy can
              affect a customer materially and should be reviewed by a
              specialist.
            </small>
          </span>
        </div>
      </div>

      <div className="pipeline-section">
        <div className="section-heading-row">
          <div>
            <span className="proposal-kicker">Review process</span>
            <h2>From case information to a clear next step</h2>
          </div>
          <span className="pipeline-principle">
            <Zap size={15} />
            Check rules before using AI
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
              <strong>Rules only</strong>
              <small>
                Complete, standard cases are checked without an AI model
              </small>
            </span>
          </div>
          <div className="route-lane light">
            <Zap size={18} />
            <span>
              <strong>Small AI document check</strong>
              <small>
                A lower-cost model reads a document; the country rules still
                decide the result
              </small>
            </span>
          </div>
          <div className="route-lane advanced">
            <BrainCircuit size={18} />
            <span>
              <strong>AI summary followed by specialist review</strong>
              <small>
                Used when evidence conflicts or the decision has significant
                financial or legal consequences
              </small>
            </span>
          </div>
        </div>
        <div className="ai-contract">
          <span className="proposal-kicker">What the AI must return</span>
          <code>
            {"{"} summary, trigger, evidence_ids, missing_information,
            uncertainty, recommended_route {"}"}
          </code>
          <p>
            The response is deliberately limited to these fields. It must cite
            the evidence used, identify missing information and say what
            remains uncertain. The model cannot create a new country rule or
            execute a reserve, hold, rejection or payment freeze.
          </p>
        </div>
      </div>

      <div className="impact-card" data-testid="impact-card">
        <div className="impact-copy">
          <span className="proposal-kicker">Example cost calculation</span>
          <strong className="impact-number">
            −{Math.round(impact.reductionPercent)}%
          </strong>
          <h3>estimated review cost per case</h3>
          <p>
            This example compares a manual review of every case with a mixed
            process in which rules handle standard cases, a small model reads
            straightforward documents, and specialists review the difficult
            cases. The figures are assumptions for this prototype, not Remote
            operating data.
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
              <span>Proposed mixed review process</span>
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
          "Straightforward document reading uses a lower-cost model",
          "A larger model is used only when evidence needs comparison",
          "Specialists receive the evidence and explanation together"
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
        <summary>
          See which inputs are documented publicly and which are assumptions
          in this prototype
        </summary>
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
          <span className="proposal-kicker">Longer-term idea</span>
          <h2>
            Let the system manage routine case work, but stop before important
            decisions
          </h2>
          <p>
            The current product explains one review at a time. A later version
            could also collect missing evidence, send approved follow-ups and
            update the case when the customer responds. It could continue a
            complete standard case when an approved country rule allows it.
            When the case involves a reserve, hold, rejection, unclear policy
            or significant uncertainty, it would stop and give the evidence to
            a specialist.
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
              ? "Running example…"
              : currentStep >= 0
                ? "Run example again"
                : "Run the example"}
          </button>
          <small>
            This is a simulation. It does not call a model, contact a customer
            or change any data.
          </small>
        </div>
      </div>
      <p className="sr-only" id="agent-motion-note">
        {prefersReducedMotion
          ? "Reduced motion is enabled. Use the next and previous controls to step through the case."
          : "The timeline advances automatically and also provides manual controls."}
      </p>

      <div className="vision-maturity">
        <div>
          <span>Current prototype</span>
          <strong>AI prepares a cited summary</strong>
        </div>
        <ArrowRight size={18} />
        <div>
          <span>Possible next step</span>
          <strong>System requests and receives missing information</strong>
        </div>
        <ArrowRight size={18} />
        <div className="active">
          <span>Longer-term version</span>
          <strong>Routine cases continue without manual handling</strong>
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
              The system could do this without approval
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
              A specialist must decide
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
              <strong>What happens in a complete, standard case</strong>
              <small>
                If all evidence is complete and the employment terms match an
                approved country rule, the case can continue automatically. AI
                does not make that decision; the approved rule does.
              </small>
            </span>
          </div>
        </div>
      </div>

      <div className="escalation-rule">
        <CircleAlert size={18} />
        <p>
          The case stops for a specialist when the financial exposure is high,
          the evidence conflicts, the legal consequence is significant, or the
          policy does not clearly cover the situation. A high-value customer
          may receive a faster response, but not a weaker compliance review.
        </p>
      </div>
    </section>
  );
}

function BuildReceipt() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <section className="build-receipt" id="build">
      <div>
        <span className="proposal-kicker">About this prototype</span>
        <h2>What is real and what is simulated</h2>
        <p>
          Alessio Carrà built the interface and decision logic with Codex after
          reviewing Remote&apos;s public developer and support documentation.
          The product interactions, rules engine, cost calculation and tests
          run in code. The company, employees, policies, costs and decisions
          are fictional. No real Remote data is used and the demo does not call
          an AI model.
        </p>
      </div>
      <div className="receipt-facts">
        <span>
          <Code2 size={17} />
          <strong>Built with Codex</strong>
          <small>Research, product writing, implementation and testing</small>
        </span>
        <span>
          <ShieldCheck size={17} />
          <strong>Working decision logic</strong>
          <small>Five cases follow different rules and review methods</small>
        </span>
        <span>
          <FileCheck2 size={17} />
          <strong>26 automated checks</strong>
          <small>18 unit tests and 8 browser tests</small>
        </span>
        <span>
          <Clock3 size={17} />
          <strong>No real customer data</strong>
          <small>All names, cases, decisions and financial figures are fictional</small>
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
