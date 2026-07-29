import { describe, expect, it } from "vitest";
import {
  assessEmployer,
  getInvestigatorBrief,
  getPolicyComparison
} from "../assess";
import { employerCases, getEmployerCase } from "../cases";

describe("employer assessment", () => {
  it("clears the established verified company under the balanced policy", () => {
    const result = assessEmployer(getEmployerCase("clear-to-hire"), "balanced");

    expect(result.level).toBe("green");
    expect(result.action).toBe("CLEAR");
  });

  it("requires a reserve for concentrated exposure with limited history", () => {
    const result = assessEmployer(
      getEmployerCase("reserve-required"),
      "balanced"
    );

    expect(result.level).toBe("yellow");
    expect(result.action).toBe("REQUIRE_RESERVE");
    expect(result.reasons).toHaveLength(3);
  });

  it("requests ownership information when verification does not align", () => {
    const result = assessEmployer(
      getEmployerCase("more-information"),
      "balanced"
    );

    expect(result.level).toBe("yellow");
    expect(result.action).toBe("REQUEST_INFO");
    expect(result.missingInformation.length).toBeGreaterThan(0);
  });

  it("holds the mismatched company under the strict policy", () => {
    const result = assessEmployer(
      getEmployerCase("more-information"),
      "strict"
    );

    expect(result.level).toBe("red");
    expect(result.action).toBe("HOLD");
  });

  it("exposes the strict-policy false positive", () => {
    const result = assessEmployer(getEmployerCase("clear-to-hire"), "strict");
    const comparison = getPolicyComparison(employerCases);

    expect(result.action).toBe("REQUEST_INFO");
    expect(comparison.additionalLegitimateReviews).toBe(1);
    expect(comparison.balanced.straightThrough).toBe(1);
    expect(comparison.strict.straightThrough).toBe(0);
  });

  it("links every investigator brief to supplied evidence", () => {
    for (const employerCase of employerCases) {
      const assessment = assessEmployer(employerCase, "balanced");
      const brief = getInvestigatorBrief(employerCase, assessment);
      const knownEvidence = new Set(
        employerCase.evidence.map((evidence) => evidence.id)
      );

      expect(brief.evidenceIds.length).toBeGreaterThan(0);
      expect(
        brief.evidenceIds.every((evidenceId) => knownEvidence.has(evidenceId))
      ).toBe(true);
      expect(brief.recommendedAction).toBe(assessment.action);
      expect(brief.limitations).toContain("does not replace");
    }
  });
});
