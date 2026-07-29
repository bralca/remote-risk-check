"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  FileSearch,
  RotateCcw,
  Scale,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { assessEmployer, getInvestigatorBrief, getPolicyComparison } from "@/lib/assess";
import { employerCases, getEmployerCase } from "@/lib/cases";
import type {
  AuditEntry,
  DecisionAction,
  PolicyMode,
  RiskLevel
} from "@/lib/types";

const statusCopy: Record<RiskLevel, string> = {
  green: "Clear",
  yellow: "Action needed",
  red: "Hold"
};

const actionCopy: Record<DecisionAction, string> = {
  CLEAR: "Clear to hire",
  REQUEST_INFO: "Request information",
  REQUIRE_RESERVE: "Require reserve",
  HOLD: "Hold for review"
};

const statusIcon = {
  green: CircleCheck,
  yellow: Scale,
  red: ShieldAlert
};

export function RiskCheck({ initialCaseId }: { initialCaseId: string }) {
  const [ready, setReady] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId);
  const [policy, setPolicy] = useState<PolicyMode>("balanced");
  const [analyzed, setAnalyzed] = useState(false);
  const [view, setView] = useState<"risk" | "customer">("risk");
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);

  const selectedCase = getEmployerCase(selectedCaseId);
  const assessment = useMemo(
    () => assessEmployer(selectedCase, policy),
    [selectedCase, policy]
  );
  const brief = useMemo(
    () => getInvestigatorBrief(selectedCase, assessment),
    [selectedCase, assessment]
  );
  const comparison = useMemo(() => getPolicyComparison(employerCases), []);
  const StatusIcon = statusIcon[assessment.level];
  const currentAudit = auditEntries.find(
    (entry) =>
      entry.caseId === selectedCase.id &&
      entry.policy === policy &&
      entry.action === assessment.action
  );

  useEffect(() => {
    setReady(true);
  }, []);

  function selectCase(caseId: string) {
    setSelectedCaseId(caseId);
    setAnalyzed(false);
    setView("risk");
    const url = new URL(window.location.href);
    url.searchParams.set("case", caseId);
    window.history.replaceState({}, "", url);
  }

  function recordDecision() {
    const decidedAt = new Date().toISOString();
    const entry: AuditEntry = {
      id: `${selectedCase.id}-${policy}-${decidedAt}`,
      caseId: selectedCase.id,
      policy,
      action: assessment.action,
      actor: "Human reviewer",
      decidedAt,
      note: `Approved recommendation: ${actionCopy[assessment.action]}`
    };
    setAuditEntries((entries) => [entry, ...entries]);
  }

  function resetDemo() {
    setSelectedCaseId("reserve-required");
    setPolicy("balanced");
    setAnalyzed(false);
    setView("risk");
    setAuditEntries([]);
    const url = new URL(window.location.href);
    url.searchParams.set("case", "reserve-required");
    window.history.replaceState({}, "", url);
  }

  return (
    <section className="demo-section page-shell" id="demo">
      <div className="section-heading demo-heading">
        <div>
          <span className="section-kicker">The 60-second product demo</span>
          <h2>Review one employer. Make one defensible decision.</h2>
        </div>
        <button className="reset-button" type="button" onClick={resetDemo}>
          <RotateCcw size={15} />
          Reset demo
        </button>
      </div>

      <ol className="step-row" aria-label="Demo steps">
        <li className="active">
          <span>1</span>
          Choose a case
        </li>
        <li className={analyzed ? "active" : ""}>
          <span>2</span>
          Review evidence
        </li>
        <li className={currentAudit ? "active" : ""}>
          <span>3</span>
          Confirm decision
        </li>
      </ol>

      <div
        className="case-picker"
        role="group"
        aria-label="Fictional employer cases"
      >
        {employerCases.map((employerCase) => {
          const isSelected = employerCase.id === selectedCaseId;
          return (
            <button
              className={`case-card ${isSelected ? "selected" : ""}`}
            type="button"
            key={employerCase.id}
            onClick={() => selectCase(employerCase.id)}
            aria-pressed={isSelected}
            disabled={!ready}
            >
              <span className="case-card-topline">
                <span>{employerCase.scenario}</span>
                {isSelected && (
                  <span className="selected-check" aria-label="Selected">
                    <Check size={13} />
                  </span>
                )}
              </span>
              <strong>{employerCase.companyName}</strong>
              <small>{employerCase.summary}</small>
              <span className="case-country">
                <span className="country-code">{employerCase.countryCode}</span>
                {employerCase.country}
              </span>
            </button>
          );
        })}
      </div>

      <div className="review-shell">
        <div className="case-evidence-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">Employer evidence</span>
              <h3>{selectedCase.companyName}</h3>
              <p>{selectedCase.summary}</p>
            </div>
            <span className="fictional-badge">Fictional case</span>
          </div>

          <div className="evidence-list">
            {selectedCase.evidence.map((item) => (
              <div className="evidence-item" id={item.id} key={item.id}>
                <span className={`evidence-dot ${item.tone}`} />
                <span>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </span>
                <span className="evidence-detail">{item.detail}</span>
              </div>
            ))}
          </div>

          <button
            className="button button-primary analyze-button"
            type="button"
            onClick={() => setAnalyzed(true)}
            disabled={!ready}
          >
            <FileSearch size={18} />
            Analyze this case
            <ArrowRight size={17} />
          </button>
          <p className="analyze-note">
            Runs a deterministic policy, then reveals the evidence-grounded
            investigator brief.
          </p>
        </div>

        <div
          className={`result-panel ${analyzed ? "revealed" : "waiting"}`}
          aria-live="polite"
        >
          {!analyzed ? (
            <div className="waiting-state">
              <span className="waiting-icon">
                <Bot size={28} />
              </span>
              <span className="panel-eyebrow">Decision workspace</span>
              <h3>Ready when you are.</h3>
              <p>
                Analyze the case to see the policy decision, AI brief, customer
                explanation, and human approval step.
              </p>
              <div className="waiting-flow" aria-hidden="true">
                <span>Evidence</span>
                <ArrowRight size={14} />
                <span>Policy</span>
                <ArrowRight size={14} />
                <span>Human</span>
              </div>
            </div>
          ) : (
            <>
              <div className={`result-status ${assessment.level}`}>
                <span className="result-status-icon">
                  <StatusIcon size={22} />
                </span>
                <span>
                  <small>{statusCopy[assessment.level]}</small>
                  <strong>{assessment.headline}</strong>
                </span>
                <span className="status-pill">
                  {actionCopy[assessment.action]}
                </span>
              </div>

              <div className="view-toggle" aria-label="Explanation audience">
                <button
                  type="button"
                  className={view === "risk" ? "active" : ""}
                  onClick={() => setView("risk")}
                >
                  For the Risk team
                </button>
                <button
                  type="button"
                  className={view === "customer" ? "active" : ""}
                  onClick={() => setView("customer")}
                >
                  For the customer
                </button>
              </div>

              {view === "risk" ? (
                <div className="risk-view">
                  <div className="ai-brief">
                    <div className="ai-brief-title">
                      <span>
                        <Bot size={18} />
                      </span>
                      <div>
                        <strong>AI investigator brief</strong>
                        <small>Precomputed · evidence constrained</small>
                      </div>
                    </div>
                    <p>{brief.summary}</p>
                  </div>

                  <div className="reason-list">
                    {assessment.reasons.map((riskReason, index) => (
                      <article key={riskReason.id}>
                        <span className="reason-index">{index + 1}</span>
                        <div>
                          <strong>{riskReason.title}</strong>
                          <p>{riskReason.explanation}</p>
                          <span className="evidence-links">
                            Evidence:{" "}
                            {riskReason.evidenceIds.map((evidenceId, itemIndex) => {
                              const evidence = selectedCase.evidence.find(
                                (item) => item.id === evidenceId
                              );
                              return (
                                <a href={`#${evidenceId}`} key={evidenceId}>
                                  {evidence?.label}
                                  {itemIndex < riskReason.evidenceIds.length - 1
                                    ? ", "
                                    : ""}
                                </a>
                              );
                            })}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>

                  {(brief.missingInformation.length > 0 ||
                    brief.uncertainty) && (
                    <div className="uncertainty-box">
                      <CircleAlert size={17} />
                      <div>
                        <strong>
                          {brief.missingInformation.length > 0
                            ? "What is still needed"
                            : "Uncertainty"}
                        </strong>
                        <p>
                          {brief.missingInformation.length > 0
                            ? brief.missingInformation.join(" · ")
                            : brief.uncertainty}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="customer-view">
                  <span className="customer-icon">
                    <Building2 size={22} />
                  </span>
                  <span className="panel-eyebrow">Customer-facing message</span>
                  <h4>Here’s what happens next</h4>
                  <p>{selectedCase.customerMessages[assessment.action]}</p>
                  <div>
                    <BadgeCheck size={17} />
                    Clear next step, without revealing sensitive controls
                  </div>
                </div>
              )}

              <div className="human-decision">
                <div>
                  <span className="human-decision-icon">
                    <UserCheck size={19} />
                  </span>
                  <span>
                    <strong>AI recommends. A person decides.</strong>
                    <small>
                      High-impact actions never execute automatically.
                    </small>
                  </span>
                </div>

                {currentAudit ? (
                  <div className="decision-recorded">
                    <CheckCircle2 size={18} />
                    <span>
                      <strong>Decision recorded</strong>
                      <small>
                        {currentAudit.actor} ·{" "}
                        {new Date(currentAudit.decidedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </small>
                    </span>
                  </div>
                ) : (
                  <button type="button" onClick={recordDecision}>
                    Approve recommendation
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="policy-section">
        <button
          className="policy-heading"
          type="button"
          aria-expanded="true"
        >
          <span>
            <Scale size={19} />
            What if the policy were stricter?
          </span>
          <ChevronDown size={18} />
        </button>

        <div className="policy-content">
          <div>
            <span className="policy-label">Policy mode</span>
            <div className="policy-toggle">
              <button
                className={policy === "balanced" ? "active" : ""}
                type="button"
                disabled={!ready}
                onClick={() => {
                  setPolicy("balanced");
                  setAnalyzed(true);
                }}
              >
                Balanced
                <small>Review real exceptions</small>
              </button>
              <button
                className={policy === "strict" ? "active" : ""}
                type="button"
                disabled={!ready}
                onClick={() => {
                  setPolicy("strict");
                  setAnalyzed(true);
                }}
              >
                Strict
                <small>Review more cases</small>
              </button>
            </div>
          </div>

          <div className="tradeoff-copy">
            <span className="tradeoff-icon">
              {policy === "balanced" ? (
                <CircleCheck size={21} />
              ) : (
                <CircleAlert size={21} />
              )}
            </span>
            <div>
              <strong>
                {policy === "balanced"
                  ? "One company continues automatically"
                  : "One additional legitimate company is delayed"}
              </strong>
              <p>
                {policy === "balanced"
                  ? "The balanced policy sends only the reserve and ownership exceptions to review."
                  : "The stricter threshold catches more uncertainty, but creates a false positive in this three-case demo."}
              </p>
            </div>
          </div>

          <div className="mini-metrics" aria-label={`${policy} policy results`}>
            <div>
              <strong>
                {comparison[policy].straightThrough}
                <span>/3</span>
              </strong>
              <small>Straight-through</small>
            </div>
            <div>
              <strong>
                {comparison[policy].reviewed}
                <span>/3</span>
              </strong>
              <small>Need action</small>
            </div>
          </div>
        </div>
        <p className="synthetic-note">
          Demonstration only: results come from three fictional cases, not
          Remote data or proprietary thresholds.
        </p>
      </div>
    </section>
  );
}
