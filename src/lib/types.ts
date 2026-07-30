export type ProposalView = "product" | "explanation";

export type HireOutcome = "READY" | "CUSTOMER_ACTION" | "SPECIALIST_REVIEW";

export type ProcessingRoute =
  | "rules_only"
  | "lightweight_ai"
  | "advanced_ai"
  | "specialist";

export type RecommendedAction =
  | "CONTINUE_ONBOARDING"
  | "REQUEST_EVIDENCE"
  | "REVIEW_RESERVE"
  | "ESCALATE";

export type EvidenceTone = "positive" | "neutral" | "caution" | "critical";

export interface SourceReference {
  id: string;
  label: string;
  kind: "public_api" | "conceptual";
  endpoint?: string;
  documentationUrl: string;
  note: string;
}

export interface EvidenceItem {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: EvidenceTone;
  sourceId: string;
}

export interface CompanyCheck {
  id: string;
  label: string;
  value: string;
  tone: EvidenceTone;
  sourceId: string;
}

export interface DecisionPacket {
  headline: string;
  summary: string;
  trigger: string;
  evidenceIds: string[];
  missingInformation: string[];
  uncertainty: string;
  recommendedRoute: ProcessingRoute;
  recommendedAction: RecommendedAction;
  permittedActions: RecommendedAction[];
  aiUsed: boolean;
}

export interface HireCase {
  id: string;
  name: string;
  initials: string;
  role: string;
  country: string;
  countryCode: string;
  provisionalStartDate: string;
  outcome: HireOutcome;
  route: ProcessingRoute;
  routeLabel: string;
  policyLabel: string;
  requiredHumanApproval: boolean;
  evidence: EvidenceItem[];
  decision: DecisionPacket;
  customerMessage: string;
}

export interface HiringPortfolio {
  id: string;
  companyName: string;
  companyInitials: string;
  summary: string;
  companyChecks: CompanyCheck[];
  hires: HireCase[];
  sources: SourceReference[];
}

export interface PortfolioSummary {
  ready: number;
  customerAction: number;
  specialistReview: number;
}

export interface RouteInput {
  countrySupported: boolean;
  schemaKnown: boolean;
  missingRequiredEvidence: boolean;
  hasUnstructuredEvidence: boolean;
  evidenceConflict: boolean;
  highExposure: boolean;
  consequentialAction: boolean;
  aiPacketValid: boolean;
}

export interface ImpactRouteAssumption {
  id: string;
  label: string;
  share: number;
  costPerCase: number;
}

export interface ImpactAssumptions {
  reviewerCostPerHour: number;
  baselineMinutesPerCase: number;
  annualCases: number;
  routes: ImpactRouteAssumption[];
}

export interface ImpactResult {
  baselineCost: number;
  routedCost: number;
  reductionPercent: number;
  annualSavings: number;
}

export interface HumanDecision {
  hireId: string;
  action: RecommendedAction;
  actor: "Human reviewer";
  decidedAt: string;
}

export interface AuditEntry extends HumanDecision {
  id: string;
  note: string;
}

export interface AgentStep {
  id: string;
  label: string;
  detail: string;
  actor: "Agent" | "Policy" | "Customer" | "Specialist";
  status: "complete" | "attention" | "human";
}

export interface RemoteWebhookEvent {
  event_type: string;
  company_id?: string;
  employment_id?: string;
  [key: string]: unknown;
}
