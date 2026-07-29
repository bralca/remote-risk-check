export type PolicyMode = "balanced" | "strict";

export type RiskLevel = "green" | "yellow" | "red";

export type DecisionAction =
  | "CLEAR"
  | "REQUEST_INFO"
  | "REQUIRE_RESERVE"
  | "HOLD";

export type EvidenceTone = "positive" | "neutral" | "caution" | "critical";

export interface RiskEvidence {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: EvidenceTone;
}

export interface EmployerCase {
  id: string;
  scenario: string;
  companyName: string;
  country: string;
  countryCode: string;
  companyAgeMonths: number;
  monthlyPayrollEur: number;
  paymentTermsDays: number;
  verificationStatus: "verified" | "partial" | "mismatch";
  beneficialOwnerStatus: "clear" | "review";
  contractRisk: "standard" | "elevated";
  latePayments: number;
  illustrativeReserveEur?: number;
  summary: string;
  evidence: RiskEvidence[];
  customerMessages: Record<DecisionAction, string>;
}

export interface RiskReason {
  id: string;
  title: string;
  explanation: string;
  evidenceIds: string[];
}

export interface RiskAssessment {
  caseId: string;
  policy: PolicyMode;
  level: RiskLevel;
  action: DecisionAction;
  headline: string;
  reasons: RiskReason[];
  missingInformation: string[];
  uncertainty: string;
}

export interface AIInvestigatorBrief {
  summary: string;
  evidenceIds: string[];
  missingInformation: string[];
  uncertainty: string;
  recommendedAction: DecisionAction;
  limitations: string;
}

export interface HumanDecision {
  caseId: string;
  action: DecisionAction;
  policy: PolicyMode;
  actor: "Human reviewer";
  decidedAt: string;
}

export interface AuditEntry extends HumanDecision {
  id: string;
  note: string;
}

export interface RemoteWebhookEvent {
  event_type: string;
  company_id?: string;
  employment_id?: string;
  [key: string]: unknown;
}
