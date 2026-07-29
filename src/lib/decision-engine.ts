import { getHire } from "./portfolio";
import type {
  DecisionPacket,
  HiringPortfolio,
  ImpactAssumptions,
  ImpactResult,
  HireCase,
  PortfolioSummary,
  ProcessingRoute,
  ProposalView,
  RouteInput
} from "./types";

export function summarizePortfolio(
  portfolio: HiringPortfolio
): PortfolioSummary {
  return portfolio.hires.reduce<PortfolioSummary>(
    (summary, hire) => {
      if (hire.outcome === "READY") summary.ready += 1;
      if (hire.outcome === "CUSTOMER_ACTION") summary.customerAction += 1;
      if (hire.outcome === "SPECIALIST_REVIEW") {
        summary.specialistReview += 1;
      }
      return summary;
    },
    { ready: 0, customerAction: 0, specialistReview: 0 }
  );
}

export function deriveProcessingRoute(input: RouteInput): ProcessingRoute {
  if (!input.countrySupported || !input.schemaKnown || !input.aiPacketValid) {
    return "specialist";
  }
  if (input.missingRequiredEvidence) return "rules_only";
  if (
    input.evidenceConflict ||
    input.highExposure ||
    input.consequentialAction
  ) {
    return "advanced_ai";
  }
  if (input.hasUnstructuredEvidence) return "lightweight_ai";
  return "rules_only";
}

export function validateDecisionPacket(
  packet: DecisionPacket,
  knownEvidenceIds: string[]
) {
  const knownEvidence = new Set(knownEvidenceIds);
  return (
    packet.evidenceIds.length > 0 &&
    packet.evidenceIds.every((id) => knownEvidence.has(id)) &&
    [
      "rules_only",
      "lightweight_ai",
      "advanced_ai",
      "specialist"
    ].includes(packet.recommendedRoute) &&
    packet.permittedActions.includes(packet.recommendedAction)
  );
}

export function normalizeEvidencePacket(hire: HireCase) {
  return {
    hireId: hire.id,
    countryCode: hire.countryCode,
    policyLabel: hire.policyLabel,
    evidence: hire.evidence.map((item) => ({
      id: item.id,
      sourceId: item.sourceId,
      label: item.label,
      value: item.value
    }))
  };
}

export function calculateImpact(
  assumptions: ImpactAssumptions
): ImpactResult {
  const baselineCost =
    (assumptions.baselineMinutesPerCase / 60) *
    assumptions.reviewerCostPerHour;
  const routedCost = assumptions.routes.reduce(
    (total, route) => total + route.share * route.costPerCase,
    0
  );
  const reductionPercent = ((baselineCost - routedCost) / baselineCost) * 100;
  const annualSavings =
    (baselineCost - routedCost) * assumptions.annualCases;

  return {
    baselineCost,
    routedCost,
    reductionPercent,
    annualSavings
  };
}

const isProposalView = (value: string | null): value is ProposalView =>
  value === "product" || value === "behind" || value === "vision";

export function resolveUrlState(search: string) {
  const params = new URLSearchParams(search);
  const requestedView = params.get("view");
  const legacyCase = params.get("case");
  const hireId =
    legacyCase === "reserve-required"
      ? "oliver-uk"
      : (params.get("hire") ?? undefined);

  return {
    view: isProposalView(requestedView) ? requestedView : "product",
    hire: getHire(hireId)
  };
}
