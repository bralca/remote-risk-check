import type {
  AIInvestigatorBrief,
  EmployerCase,
  PolicyMode,
  RiskAssessment,
  RiskReason
} from "./types";

const reason = (
  id: string,
  title: string,
  explanation: string,
  evidenceIds: string[]
): RiskReason => ({ id, title, explanation, evidenceIds });

export function assessEmployer(
  employerCase: EmployerCase,
  policy: PolicyMode
): RiskAssessment {
  if (
    employerCase.verificationStatus === "mismatch" ||
    employerCase.beneficialOwnerStatus === "review"
  ) {
    return {
      caseId: employerCase.id,
      policy,
      level: policy === "strict" ? "red" : "yellow",
      action: policy === "strict" ? "HOLD" : "REQUEST_INFO",
      headline:
        policy === "strict"
          ? "Pause onboarding for specialist review"
          : "Request ownership information",
      reasons: [
        reason(
          "registration-mismatch",
          "Submitted company details do not align",
          "The authorized representative differs from the current registration record.",
          ["verification"]
        ),
        reason(
          "ownership-document",
          "Ownership evidence is incomplete",
          "A current beneficial-ownership document is needed to resolve the discrepancy.",
          ["contract-risk"]
        ),
        reason(
          "good-payment-terms",
          "Payment terms are otherwise standard",
          "The case should be resolved through verification, not a financial reserve.",
          ["payment-terms"]
        )
      ],
      missingInformation: [
        "Current beneficial-ownership document",
        "Confirmation of the authorized representative"
      ],
      uncertainty:
        "The mismatch may be an outdated record rather than intentional misrepresentation."
    };
  }

  const reserveTrigger =
    employerCase.companyAgeMonths < 12 &&
    employerCase.monthlyPayrollEur >= 100_000 &&
    employerCase.paymentTermsDays >= 30;

  if (reserveTrigger || employerCase.contractRisk === "elevated") {
    return {
      caseId: employerCase.id,
      policy,
      level: "yellow",
      action: "REQUIRE_RESERVE",
      headline: "Proceed after a risk reserve",
      reasons: [
        reason(
          "limited-history",
          "Limited operating history",
          "Seven months of company history provides less evidence of future payment behavior.",
          ["company-age"]
        ),
        reason(
          "high-exposure",
          "Meaningful payroll exposure",
          "The planned hires create a high monthly obligation relative to the observed history.",
          ["payroll-exposure"]
        ),
        reason(
          "longer-obligation",
          "Longer financial obligation window",
          "Thirty-day payment terms and extended notice increase the period of exposure.",
          ["payment-terms", "contract-risk"]
        )
      ],
      missingInformation: [],
      uncertainty:
        "Verification is complete, but there is not enough payment history to estimate future behavior confidently."
    };
  }

  if (
    policy === "strict" &&
    employerCase.companyAgeMonths < 36 &&
    employerCase.monthlyPayrollEur >= 70_000
  ) {
    return {
      caseId: employerCase.id,
      policy,
      level: "yellow",
      action: "REQUEST_INFO",
      headline: "Request financial information",
      reasons: [
        reason(
          "strict-young-company",
          "Stricter age threshold triggered",
          "The strict policy reviews companies with less than three years of operating history.",
          ["company-age"]
        ),
        reason(
          "strict-exposure",
          "Payroll exceeds the strict threshold",
          "The expected monthly payroll is above the stricter review threshold.",
          ["payroll-exposure"]
        ),
        reason(
          "verified-details",
          "Verification is otherwise complete",
          "All submitted company and ownership information matches.",
          ["verification"]
        )
      ],
      missingInformation: ["Recent management accounts"],
      uncertainty:
        "This is likely a false positive created by the stricter policy rather than new adverse evidence."
    };
  }

  return {
    caseId: employerCase.id,
    policy,
    level: "green",
    action: "CLEAR",
    headline: "Clear to continue onboarding",
    reasons: [
      reason(
        "established-history",
        "Established operating history",
        "The company has more than two years of observable operating history.",
        ["company-age"]
      ),
      reason(
        "verified-company",
        "Company information is verified",
        "Registration and beneficial-owner information match the submitted records.",
        ["verification"]
      ),
      reason(
        "standard-obligations",
        "Standard payment and contract terms",
        "No extended payment, notice, or severance obligations were identified.",
        ["payment-terms", "contract-risk"]
      )
    ],
    missingInformation: [],
    uncertainty:
      "No material uncertainty remains within the limited synthetic evidence provided."
  };
}

export function getInvestigatorBrief(
  employerCase: EmployerCase,
  assessment: RiskAssessment
): AIInvestigatorBrief {
  const summaries: Record<RiskAssessment["action"], string> = {
    CLEAR:
      "The available evidence is internally consistent and the financial obligations are standard. No manual exception is necessary.",
    REQUIRE_RESERVE:
      "Verification is complete, but limited history and concentrated payroll exposure justify a reversible financial safeguard.",
    REQUEST_INFO:
      "The case should remain remediable. Request the missing evidence before making a higher-impact decision.",
    HOLD:
      "The unresolved ownership discrepancy crosses the strict review threshold and requires specialist judgment."
  };

  return {
    summary: summaries[assessment.action],
    evidenceIds: Array.from(
      new Set(assessment.reasons.flatMap((riskReason) => riskReason.evidenceIds))
    ),
    missingInformation: assessment.missingInformation,
    uncertainty: assessment.uncertainty,
    recommendedAction: assessment.action,
    limitations:
      "Precomputed from fictional structured inputs. It does not replace KYB, AML, credit, legal, or human review."
  };
}

export function getPolicyComparison(employerCases: EmployerCase[]) {
  const balanced = employerCases.map((item) =>
    assessEmployer(item, "balanced")
  );
  const strict = employerCases.map((item) => assessEmployer(item, "strict"));

  const summary = (items: RiskAssessment[]) => ({
    straightThrough: items.filter((item) => item.action === "CLEAR").length,
    reviewed: items.filter((item) => item.action !== "CLEAR").length,
    held: items.filter((item) => item.action === "HOLD").length
  });

  return {
    balanced: summary(balanced),
    strict: summary(strict),
    additionalLegitimateReviews:
      strict.filter((item) => item.action !== "CLEAR").length -
      balanced.filter((item) => item.action !== "CLEAR").length
  };
}
