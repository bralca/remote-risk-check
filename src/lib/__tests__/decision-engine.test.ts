import { describe, expect, it } from "vitest";
import {
  calculateImpact,
  deriveProcessingRoute,
  normalizeEvidencePacket,
  resolveUrlState,
  summarizePortfolio,
  validateDecisionPacket
} from "../decision-engine";
import {
  getHire,
  hiringPortfolio,
  impactAssumptions
} from "../portfolio";

describe("country-aware decision engine", () => {
  it("summarizes three ready, one customer action, and one specialist review", () => {
    expect(summarizePortfolio(hiringPortfolio)).toEqual({
      ready: 3,
      customerAction: 1,
      specialistReview: 1
    });
  });

  it("routes standard cases without generative AI", () => {
    expect(
      deriveProcessingRoute({
        countrySupported: true,
        schemaKnown: true,
        missingRequiredEvidence: false,
        hasUnstructuredEvidence: false,
        evidenceConflict: false,
        highExposure: false,
        consequentialAction: false,
        aiPacketValid: true
      })
    ).toBe("rules_only");
  });

  it("routes bounded document extraction to a lightweight model", () => {
    expect(
      deriveProcessingRoute({
        countrySupported: true,
        schemaKnown: true,
        missingRequiredEvidence: false,
        hasUnstructuredEvidence: true,
        evidenceConflict: false,
        highExposure: false,
        consequentialAction: false,
        aiPacketValid: true
      })
    ).toBe("lightweight_ai");
    expect(getHire("lena-germany")).toMatchObject({
      outcome: "READY",
      route: "lightweight_ai",
      requiredHumanApproval: false
    });
  });

  it("uses a deterministic customer action for known missing evidence", () => {
    expect(
      deriveProcessingRoute({
        countrySupported: true,
        schemaKnown: true,
        missingRequiredEvidence: true,
        hasUnstructuredEvidence: false,
        evidenceConflict: false,
        highExposure: false,
        consequentialAction: false,
        aiPacketValid: true
      })
    ).toBe("rules_only");
    expect(getHire("camille-france").outcome).toBe("CUSTOMER_ACTION");
  });

  it("routes high exposure and consequential actions through advanced analysis", () => {
    expect(
      deriveProcessingRoute({
        countrySupported: true,
        schemaKnown: true,
        missingRequiredEvidence: false,
        hasUnstructuredEvidence: true,
        evidenceConflict: false,
        highExposure: true,
        consequentialAction: true,
        aiPacketValid: true
      })
    ).toBe("advanced_ai");
    expect(getHire("oliver-uk")).toMatchObject({
      outcome: "SPECIALIST_REVIEW",
      route: "advanced_ai",
      requiredHumanApproval: true
    });
    expect(
      getHire("oliver-uk").evidence.map((evidence) => evidence.id)
    ).toEqual(
      expect.arrayContaining(["oliver-contract", "oliver-exposure"])
    );
  });

  it("fails safely to a specialist for unknown policy or invalid AI output", () => {
    expect(
      deriveProcessingRoute({
        countrySupported: false,
        schemaKnown: false,
        missingRequiredEvidence: false,
        hasUnstructuredEvidence: false,
        evidenceConflict: false,
        highExposure: false,
        consequentialAction: false,
        aiPacketValid: true
      })
    ).toBe("specialist");
    expect(
      deriveProcessingRoute({
        countrySupported: true,
        schemaKnown: false,
        missingRequiredEvidence: false,
        hasUnstructuredEvidence: true,
        evidenceConflict: false,
        highExposure: false,
        consequentialAction: false,
        aiPacketValid: true
      })
    ).toBe("specialist");
    expect(
      deriveProcessingRoute({
        countrySupported: true,
        schemaKnown: true,
        missingRequiredEvidence: false,
        hasUnstructuredEvidence: true,
        evidenceConflict: false,
        highExposure: false,
        consequentialAction: false,
        aiPacketValid: false
      })
    ).toBe("specialist");
  });

  it("requires every decision claim to reference supplied evidence", () => {
    for (const hire of hiringPortfolio.hires) {
      expect(
        validateDecisionPacket(
          hire.decision,
          hire.evidence.map((evidence) => evidence.id)
        )
      ).toBe(true);
    }
  });

  it("attributes every company and hire fact to a declared source boundary", () => {
    const sourceIds = new Set(
      hiringPortfolio.sources.map((source) => source.id)
    );
    const referencedSourceIds = [
      ...hiringPortfolio.companyChecks.map((check) => check.sourceId),
      ...hiringPortfolio.hires.flatMap((hire) =>
        hire.evidence.map((evidence) => evidence.sourceId)
      )
    ];

    expect(referencedSourceIds.every((id) => sourceIds.has(id))).toBe(true);
    expect(
      hiringPortfolio.sources.some((source) => source.kind === "public_api")
    ).toBe(true);
    expect(
      hiringPortfolio.sources.some((source) => source.kind === "conceptual")
    ).toBe(true);
  });

  it("normalizes a minimized, evidence-linked packet without the hire name", () => {
    const normalized = normalizeEvidencePacket(getHire("lena-germany"));

    expect(normalized).toMatchObject({
      hireId: "lena-germany",
      countryCode: "DEU",
      policyLabel: "DEU onboarding policy · v2026.07"
    });
    expect(normalized.evidence).toHaveLength(3);
    expect(normalized).not.toHaveProperty("name");
  });

  it("calculates the disclosed illustrative impact", () => {
    const impact = calculateImpact(impactAssumptions);
    expect(impact.baselineCost).toBeCloseTo(12, 2);
    expect(impact.routedCost).toBeCloseTo(4.54, 2);
    expect(Math.round(impact.reductionPercent)).toBe(62);
    expect(impact.annualSavings).toBeCloseTo(746_000, 0);
  });

  it("maps the legacy reserve URL to the UK review case", () => {
    const state = resolveUrlState("?case=reserve-required");
    expect(state.view).toBe("product");
    expect(state.hire.id).toBe("oliver-uk");
  });

  it("resolves shareable view and hire parameters", () => {
    const state = resolveUrlState("?view=behind&hire=lena-germany");
    expect(state.view).toBe("behind");
    expect(state.hire.id).toBe("lena-germany");
  });
});
