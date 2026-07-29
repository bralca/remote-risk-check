"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  CircleAlert,
  CircleCheck,
  Scale,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import {
  assessEmployer,
  getInvestigatorBrief,
  getPolicyComparison
} from "@/lib/assess";
import { employerCases, getEmployerCase } from "@/lib/cases";
import type {
  AuditEntry,
  DecisionAction,
  PolicyMode,
  RiskLevel
} from "@/lib/types";

const scenarioCopy: Record<string, string> = {
  "clear-to-hire": "Clear",
  "reserve-required": "Reserve",
  "more-information": "Verify"
};

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
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId);
  const [policy, setPolicy] = useState<PolicyMode>("balanced");
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
    const requestedCase = new URLSearchParams(window.location.search).get(
      "case"
    );

    if (
      requestedCase &&
      employerCases.some((employerCase) => employerCase.id === requestedCase)
    ) {
      setSelectedCaseId(requestedCase);
    }
  }, []);

  function selectCase(caseId: string) {
    setSelectedCaseId(caseId);
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

  return (
    <section className="proposal-demo proposal-shell" id="proposal">
      <div className="proposal-demo-intro">
        <div>
          <span className="proposal-kicker">Working product slice</span>
          <h2>Employer eligibility</h2>
          <p>
            Review the evidence, understand the recommendation, and approve the
            next action.
          </p>
        </div>
        <span className="proposal-demo-disclaimer">
          Synthetic data · no live AI
        </span>
      </div>

      <div className="proposal-app">
        <div className="proposal-app-topbar">
          <div>
            <span>Team management</span>
            <i>/</i>
            <strong>Employer eligibility</strong>
          </div>
          <span className="proposal-app-user">
            AC
          </span>
        </div>

        <div className="proposal-case-tabs" role="tablist" aria-label="Cases">
          {employerCases.map((employerCase) => {
            const isSelected = employerCase.id === selectedCaseId;
            const tabAssessment = assessEmployer(employerCase, policy);
            return (
              <button
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={isSelected ? "active" : ""}
                key={employerCase.id}
                onClick={() => selectCase(employerCase.id)}
              >
                <span className={`proposal-tab-dot ${tabAssessment.level}`} />
                <span>
                  <strong>{scenarioCopy[employerCase.id]}</strong>
                  <small>{employerCase.companyName}</small>
                </span>
                {isSelected && <Check size={15} />}
              </button>
            );
          })}
        </div>

        <div className="proposal-workspace">
          <aside className="proposal-evidence">
            <div className="proposal-employer">
              <span className="proposal-company-avatar">
                {selectedCase.companyName
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </span>
              <span>
                <h3>{selectedCase.companyName}</h3>
                <p>
                  {selectedCase.country} · {selectedCase.summary}
                </p>
              </span>
            </div>

            <div className="proposal-evidence-list">
              <div className="proposal-list-heading">
                <span>Evidence</span>
                <span>Current value</span>
              </div>
              {selectedCase.evidence.map((item) => (
                <div className="proposal-evidence-row" key={item.id}>
                  <span>
                    <i className={item.tone} />
                    {item.label}
                  </span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="proposal-evidence-note">
              <CircleAlert size={16} />
              <span>
                <strong>Why these signals?</strong>
                <small>
                  They represent verification, exposure, payment timing, and
                  contractual obligation.
                </small>
              </span>
            </div>
          </aside>

          <div className="proposal-decision">
            <div className={`proposal-decision-banner ${assessment.level}`}>
              <span className="proposal-decision-icon">
                <StatusIcon size={22} />
              </span>
              <span>
                <small>{statusCopy[assessment.level]}</small>
                <h3>{assessment.headline}</h3>
              </span>
              <span className={`proposal-action-badge ${assessment.level}`}>
                {actionCopy[assessment.action]}
              </span>
            </div>

            <div className="proposal-audience-toggle">
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
              <div className="proposal-risk-view">
                <div className="proposal-ai-summary">
                  <span className="proposal-ai-icon">
                    <Bot size={18} />
                  </span>
                  <div>
                    <span className="proposal-ai-label">
                      <strong>AI evidence summary</strong>
                      <small>Precomputed · evidence constrained</small>
                    </span>
                    <p>{brief.summary}</p>
                  </div>
                </div>

                <div className="proposal-reasons">
                  <span className="proposal-block-label">Why this decision</span>
                  {assessment.reasons.map((reason) => (
                    <div key={reason.id}>
                      <CheckCircle2 size={16} />
                      <span>
                        <strong>{reason.title}</strong>
                        <small>{reason.explanation}</small>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="proposal-uncertainty">
                  <CircleAlert size={16} />
                  <span>
                    <strong>
                      {brief.missingInformation.length
                        ? "Still needed"
                        : "Known uncertainty"}
                    </strong>
                    <small>
                      {brief.missingInformation.length
                        ? brief.missingInformation.join(" · ")
                        : brief.uncertainty}
                    </small>
                  </span>
                </div>
              </div>
            ) : (
              <div className="proposal-customer-view">
                <span className="proposal-block-label">
                  Customer-facing message
                </span>
                <h4>Here&apos;s what happens next</h4>
                <p>{selectedCase.customerMessages[assessment.action]}</p>
                <span>
                  Clear next step · sensitive control logic stays private
                </span>
              </div>
            )}

            <div className="proposal-approval">
              <div>
                <span className="proposal-approval-icon">
                  <UserCheck size={18} />
                </span>
                <span>
                  <strong>A person owns the action.</strong>
                  <small>The recommendation cannot execute itself.</small>
                </span>
              </div>

              {currentAudit ? (
                <div className="proposal-recorded">
                  <CheckCircle2 size={17} />
                  <span>
                    <strong>Decision recorded</strong>
                    <small>Human reviewer · audit entry created</small>
                  </span>
                </div>
              ) : (
                <button type="button" onClick={recordDecision}>
                  Approve recommendation
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="proposal-policy">
          <div className="proposal-policy-heading">
            <span>
              <Scale size={17} />
              Policy trade-off
            </span>
            <p>Stricter is not automatically safer.</p>
          </div>

          <div className="proposal-policy-controls">
            <div className="proposal-policy-toggle" aria-label="Policy mode">
              <button
                type="button"
                className={policy === "balanced" ? "active" : ""}
                onClick={() => setPolicy("balanced")}
              >
                Balanced policy
              </button>
              <button
                type="button"
                className={policy === "strict" ? "active" : ""}
                onClick={() => setPolicy("strict")}
              >
                Strict policy
              </button>
            </div>
            <div className={`proposal-tradeoff ${policy}`}>
              {policy === "balanced" ? (
                <CircleCheck size={18} />
              ) : (
                <CircleAlert size={18} />
              )}
              <span>
                <strong>
                  {policy === "balanced"
                    ? "1 of 3 cases continues automatically"
                    : "One additional legitimate company is delayed"}
                </strong>
                <small>
                  {comparison[policy].straightThrough}/3 straight-through ·{" "}
                  {comparison[policy].reviewed}/3 need action
                </small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="proposal-synthetic-note">
        Demonstration only. Results use three fictional companies and
        illustrative thresholds—not Remote data or proprietary policy.
      </p>
    </section>
  );
}
