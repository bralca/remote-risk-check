import type { EmployerCase } from "./types";

const currency = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

export const employerCases: EmployerCase[] = [
  {
    id: "clear-to-hire",
    scenario: "Scenario A",
    companyName: "Fable Studio GmbH",
    country: "Germany",
    countryCode: "DE",
    companyAgeMonths: 28,
    monthlyPayrollEur: 72_000,
    paymentTermsDays: 14,
    verificationStatus: "verified",
    beneficialOwnerStatus: "clear",
    contractRisk: "standard",
    latePayments: 0,
    summary:
      "A growing design software company hiring its first two EOR employees.",
    evidence: [
      {
        id: "company-age",
        label: "Company age",
        value: "2 years, 4 months",
        detail: "Operating history is established for this illustrative cohort.",
        tone: "positive"
      },
      {
        id: "payroll-exposure",
        label: "Monthly payroll",
        value: currency.format(72_000),
        detail: "Expected monthly employment exposure across the planned hires.",
        tone: "neutral"
      },
      {
        id: "payment-terms",
        label: "Payment terms",
        value: "14 days",
        detail: "Standard payment timing in this fictional policy.",
        tone: "positive"
      },
      {
        id: "verification",
        label: "Company verification",
        value: "Verified",
        detail: "Registration and submitted company information match.",
        tone: "positive"
      },
      {
        id: "contract-risk",
        label: "Employment terms",
        value: "Standard",
        detail: "No extended notice or guaranteed severance clauses.",
        tone: "positive"
      }
    ],
    customerMessages: {
      CLEAR:
        "Your company checks are complete. You can continue inviting your new hires.",
      REQUEST_INFO:
        "We need one additional company document before onboarding can continue.",
      REQUIRE_RESERVE:
        "A refundable risk reserve is required before onboarding can continue.",
      HOLD:
        "Your onboarding is under specialist review. We will contact you with the next step."
    }
  },
  {
    id: "reserve-required",
    scenario: "Scenario B",
    companyName: "Atlas Robotics Ltd",
    country: "United Kingdom",
    countryCode: "GB",
    companyAgeMonths: 7,
    monthlyPayrollEur: 128_000,
    paymentTermsDays: 30,
    verificationStatus: "verified",
    beneficialOwnerStatus: "clear",
    contractRisk: "elevated",
    latePayments: 0,
    illustrativeReserveEur: 128_000,
    summary:
      "A recently incorporated robotics company planning five senior international hires.",
    evidence: [
      {
        id: "company-age",
        label: "Company age",
        value: "7 months",
        detail: "Limited operating history makes future payment behavior less observable.",
        tone: "caution"
      },
      {
        id: "payroll-exposure",
        label: "Monthly payroll",
        value: currency.format(128_000),
        detail: "The planned hires create meaningful monthly employment exposure.",
        tone: "caution"
      },
      {
        id: "payment-terms",
        label: "Payment terms",
        value: "30 days",
        detail: "Remote would fund obligations for longer before customer settlement.",
        tone: "caution"
      },
      {
        id: "verification",
        label: "Company verification",
        value: "Verified",
        detail: "Registration and beneficial-owner information match.",
        tone: "positive"
      },
      {
        id: "contract-risk",
        label: "Employment terms",
        value: "Extended notice",
        detail: "Two planned contracts include extended notice obligations.",
        tone: "caution"
      }
    ],
    customerMessages: {
      CLEAR:
        "Your company checks are complete. You can continue inviting your new hires.",
      REQUEST_INFO:
        "Please provide updated financial information so we can complete the review.",
      REQUIRE_RESERVE:
        "A refundable €128,000 risk reserve is required before onboarding can continue. The amount is illustrative for this fictional case.",
      HOLD:
        "Your onboarding is under specialist review. We will contact you with the next step."
    }
  },
  {
    id: "more-information",
    scenario: "Scenario C",
    companyName: "Nova Commerce B.V.",
    country: "Netherlands",
    countryCode: "NL",
    companyAgeMonths: 46,
    monthlyPayrollEur: 91_000,
    paymentTermsDays: 14,
    verificationStatus: "mismatch",
    beneficialOwnerStatus: "review",
    contractRisk: "standard",
    latePayments: 0,
    summary:
      "An established commerce platform whose submitted ownership records do not align.",
    evidence: [
      {
        id: "company-age",
        label: "Company age",
        value: "3 years, 10 months",
        detail: "The company has an established operating history.",
        tone: "positive"
      },
      {
        id: "payroll-exposure",
        label: "Monthly payroll",
        value: currency.format(91_000),
        detail: "Expected monthly employment exposure across three hires.",
        tone: "neutral"
      },
      {
        id: "payment-terms",
        label: "Payment terms",
        value: "14 days",
        detail: "Standard payment timing in this fictional policy.",
        tone: "positive"
      },
      {
        id: "verification",
        label: "Company verification",
        value: "Details differ",
        detail: "The registered director does not match the submitted representative.",
        tone: "critical"
      },
      {
        id: "contract-risk",
        label: "Ownership screening",
        value: "Review needed",
        detail: "A current beneficial-ownership document is missing.",
        tone: "critical"
      }
    ],
    customerMessages: {
      CLEAR:
        "Your company checks are complete. You can continue inviting your new hires.",
      REQUEST_INFO:
        "Please upload a current beneficial-ownership document and confirm the authorized representative.",
      REQUIRE_RESERVE:
        "A refundable risk reserve is required before onboarding can continue.",
      HOLD:
        "Onboarding is paused while a specialist verifies the submitted ownership information."
    }
  }
];

export function getEmployerCase(id: string | undefined): EmployerCase {
  return (
    employerCases.find((employerCase) => employerCase.id === id) ??
    employerCases[1]
  );
}
