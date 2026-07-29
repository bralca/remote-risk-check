import type {
  AgentStep,
  HiringPortfolio,
  ImpactAssumptions
} from "./types";

const sources = [
  {
    id: "company-compliance",
    label: "Company compliance profile",
    kind: "public_api" as const,
    endpoint: "GET /v1/companies/{company_id}/compliance-profile",
    documentationUrl:
      "https://developer.remote.com/reference/get_v1_companies_company_id_compliance-profile",
    note: "Remote documents KYB and credit-risk status for the default legal entity."
  },
  {
    id: "company-actions",
    label: "Company pending actions",
    kind: "public_api" as const,
    endpoint: "GET /v1/companies/{company_id}/actions",
    documentationUrl:
      "https://developer.remote.com/reference/get_v1_companies_company_id_actions",
    note: "Remote documents pending verification and Remote Payments setup actions."
  },
  {
    id: "country-schema",
    label: "Country-specific form schema",
    kind: "public_api" as const,
    endpoint: "GET /v1/countries/{country_code}/{form_name}",
    documentationUrl:
      "https://developer.remote.com/docs/working-with-countries",
    note: "Required fields and validation vary dynamically by country."
  },
  {
    id: "employments",
    label: "Employment record",
    kind: "public_api" as const,
    endpoint: "GET /v1/employments/{employment_id}",
    documentationUrl:
      "https://developer.remote.com/reference/get_v1_employments_employment_id",
    note: "Remote documents employment-level status and onboarding data."
  },
  {
    id: "employment-contract",
    label: "Employment contract",
    kind: "public_api" as const,
    endpoint: "GET /v1/employment-contracts?employment_id={employment_id}",
    documentationUrl:
      "https://developer.remote.com/reference/get_v1_employment-contracts",
    note: "Remote documents contract history and country-specific employment terms."
  },
  {
    id: "eligibility-webhooks",
    label: "EOR eligibility webhooks",
    kind: "public_api" as const,
    endpoint: "company.eor_hiring.* webhook events",
    documentationUrl:
      "https://developer.remote.com/docs/verifying-webhooks",
    note: "Remote documents signed webhook delivery; the repository includes a server-side verification reference."
  },
  {
    id: "reserve-status",
    label: "Onboarding reserve status",
    kind: "public_api" as const,
    endpoint:
      "GET /v1/companies/{company_id}/employments/{employment_id}/onboarding-reserves-status",
    documentationUrl:
      "https://developer.remote.com/reference/get_v1_companies_company_id_employments_employment_id_onboarding-reserves-status",
    note: "Remote documents an employment-level reserve status informed by credit policy."
  },
  {
    id: "employee-documents",
    label: "Employee document evidence",
    kind: "conceptual" as const,
    documentationUrl:
      "https://support.remote.com/hc/en-us/articles/4411263188621-Employee-Onboarding-Overview-for-Customers",
    note: "Conceptual internal input. Remote publicly describes document and right-to-work checks; no public document payload is claimed."
  },
  {
    id: "risk-policy",
    label: "Versioned Risk Operations policy",
    kind: "conceptual" as const,
    documentationUrl:
      "https://remote.com/openings/7814948003",
    note: "Conceptual configurable policy layer inspired by the role, not Remote proprietary logic."
  }
];

export const hiringPortfolio: HiringPortfolio = {
  id: "atlas-multi-country",
  companyName: "Atlas Robotics Ltd",
  companyInitials: "AR",
  summary: "Five planned EOR hires across four countries",
  companyChecks: [
    {
      id: "company-kyb",
      label: "KYB verification",
      value: "Verified",
      tone: "positive",
      sourceId: "company-compliance"
    },
    {
      id: "company-credit",
      label: "Credit status",
      value: "Available",
      tone: "positive",
      sourceId: "company-compliance"
    },
    {
      id: "company-actions",
      label: "Pending company actions",
      value: "None",
      tone: "positive",
      sourceId: "company-actions"
    }
  ],
  sources,
  hires: [
    {
      id: "ana-portugal",
      name: "Ana Costa",
      initials: "AC",
      role: "Product Designer",
      country: "Portugal",
      countryCode: "PRT",
      provisionalStartDate: "2026-09-01",
      outcome: "READY",
      route: "rules_only",
      routeLabel: "Rules only · no generative AI",
      policyLabel: "PRT onboarding policy · v2026.07",
      requiredHumanApproval: false,
      evidence: [
        {
          id: "ana-schema",
          label: "Country requirements",
          value: "Complete",
          detail:
            "All fields required by the synthetic Portugal onboarding schema are present.",
          tone: "positive",
          sourceId: "country-schema"
        },
        {
          id: "ana-contract",
          label: "Employment terms",
          value: "Standard",
          detail:
            "The contract contains no non-standard notice or severance term in this fixture.",
          tone: "positive",
          sourceId: "employment-contract"
        },
        {
          id: "ana-reserve",
          label: "Reserve status",
          value: "No request",
          detail:
            "The fixture maps to a clear onboarding-reserve status for this employment.",
          tone: "positive",
          sourceId: "reserve-status"
        }
      ],
      decision: {
        headline: "Ready to continue onboarding",
        summary:
          "The country schema is complete, employment terms are standard, and no reserve action is pending.",
        trigger: "standard_policy_match",
        evidenceIds: ["ana-schema", "ana-contract", "ana-reserve"],
        missingInformation: [],
        uncertainty: "No material uncertainty in the supplied synthetic evidence.",
        recommendedRoute: "rules_only",
        recommendedAction: "CONTINUE_ONBOARDING",
        permittedActions: ["CONTINUE_ONBOARDING"],
        aiUsed: false
      },
      customerMessage:
        "Ana’s required onboarding information is complete. You can continue to the next step."
    },
    {
      id: "tiago-portugal",
      name: "Tiago Silva",
      initials: "TS",
      role: "Robotics Engineer",
      country: "Portugal",
      countryCode: "PRT",
      provisionalStartDate: "2026-09-15",
      outcome: "READY",
      route: "rules_only",
      routeLabel: "Rules only · no generative AI",
      policyLabel: "PRT onboarding policy · v2026.07",
      requiredHumanApproval: false,
      evidence: [
        {
          id: "tiago-schema",
          label: "Country requirements",
          value: "Complete",
          detail:
            "Required employment information is present and validates against the fixture schema.",
          tone: "positive",
          sourceId: "country-schema"
        },
        {
          id: "tiago-contract",
          label: "Employment terms",
          value: "Standard",
          detail:
            "Salary, duration, and notice fields match the synthetic standard policy.",
          tone: "positive",
          sourceId: "employment-contract"
        },
        {
          id: "tiago-reserve",
          label: "Reserve status",
          value: "No request",
          detail: "No employment-level reserve action is pending in the fixture.",
          tone: "positive",
          sourceId: "reserve-status"
        }
      ],
      decision: {
        headline: "Ready to continue onboarding",
        summary:
          "All required information is complete and the standard policy path can resolve the case without AI or specialist review.",
        trigger: "standard_policy_match",
        evidenceIds: ["tiago-schema", "tiago-contract", "tiago-reserve"],
        missingInformation: [],
        uncertainty: "No material uncertainty in the supplied synthetic evidence.",
        recommendedRoute: "rules_only",
        recommendedAction: "CONTINUE_ONBOARDING",
        permittedActions: ["CONTINUE_ONBOARDING"],
        aiUsed: false
      },
      customerMessage:
        "Tiago’s required onboarding information is complete. You can continue to the next step."
    },
    {
      id: "lena-germany",
      name: "Lena Weber",
      initials: "LW",
      role: "People Operations Lead",
      country: "Germany",
      countryCode: "DEU",
      provisionalStartDate: "2026-09-01",
      outcome: "READY",
      route: "lightweight_ai",
      routeLabel: "Lightweight extraction → policy validation",
      policyLabel: "DEU onboarding policy · v2026.07",
      requiredHumanApproval: false,
      evidence: [
        {
          id: "lena-document",
          label: "Work eligibility evidence",
          value: "Extracted · valid",
          detail:
            "A lightweight extraction step normalizes the synthetic document’s type and expiry; deterministic validation owns the result.",
          tone: "positive",
          sourceId: "employee-documents"
        },
        {
          id: "lena-schema",
          label: "Country requirements",
          value: "Complete",
          detail:
            "The extracted values and submitted information satisfy the fixture’s required German fields.",
          tone: "positive",
          sourceId: "country-schema"
        },
        {
          id: "lena-contract",
          label: "Employment terms",
          value: "Standard",
          detail: "No exception is identified in the structured contract fields.",
          tone: "positive",
          sourceId: "employment-contract"
        }
      ],
      decision: {
        headline: "Ready after document validation",
        summary:
          "A bounded extraction task normalized the document evidence. The country policy—not the model—validated the case.",
        trigger: "document_extraction_complete",
        evidenceIds: ["lena-document", "lena-schema", "lena-contract"],
        missingInformation: [],
        uncertainty:
          "The model output is constrained to extraction and cannot approve the employment.",
        recommendedRoute: "rules_only",
        recommendedAction: "CONTINUE_ONBOARDING",
        permittedActions: ["CONTINUE_ONBOARDING", "ESCALATE"],
        aiUsed: true
      },
      customerMessage:
        "Lena’s submitted evidence has been validated and onboarding can continue."
    },
    {
      id: "camille-france",
      name: "Camille Laurent",
      initials: "CL",
      role: "Commercial Director",
      country: "France",
      countryCode: "FRA",
      provisionalStartDate: "2026-08-17",
      outcome: "CUSTOMER_ACTION",
      route: "rules_only",
      routeLabel: "Deterministic completeness check",
      policyLabel: "FRA onboarding policy · v2026.07",
      requiredHumanApproval: false,
      evidence: [
        {
          id: "camille-schema",
          label: "Country requirements",
          value: "1 item missing",
          detail:
            "The synthetic country schema expects current work-authorization evidence before invitation.",
          tone: "caution",
          sourceId: "country-schema"
        },
        {
          id: "camille-document",
          label: "Required evidence",
          value: "Not received",
          detail:
            "The workflow can request a known missing item without spending model tokens.",
          tone: "caution",
          sourceId: "employee-documents"
        },
        {
          id: "camille-contract",
          label: "Employment terms",
          value: "Standard",
          detail:
            "The available contract evidence does not create an additional exception.",
          tone: "positive",
          sourceId: "employment-contract"
        }
      ],
      decision: {
        headline: "One customer action required",
        summary:
          "A known country requirement is missing. A controlled request can resolve the case without AI or specialist review.",
        trigger: "missing_required_evidence",
        evidenceIds: ["camille-schema", "camille-document"],
        missingInformation: ["Current work-authorization evidence"],
        uncertainty:
          "No adverse conclusion should be drawn while the required evidence is missing.",
        recommendedRoute: "rules_only",
        recommendedAction: "REQUEST_EVIDENCE",
        permittedActions: ["REQUEST_EVIDENCE", "ESCALATE"],
        aiUsed: false
      },
      customerMessage:
        "Upload Camille’s current work-authorization evidence to preserve the proposed onboarding date."
    },
    {
      id: "oliver-uk",
      name: "Oliver Grant",
      initials: "OG",
      role: "VP Engineering",
      country: "United Kingdom",
      countryCode: "GBR",
      provisionalStartDate: "2026-08-17",
      outcome: "SPECIALIST_REVIEW",
      route: "advanced_ai",
      routeLabel: "Advanced analysis → UK specialist",
      policyLabel: "GBR reserve policy · v2026.07",
      requiredHumanApproval: true,
      evidence: [
        {
          id: "oliver-contract",
          label: "Notice period",
          value: "3 months",
          detail:
            "The synthetic contract includes an extended notice obligation that requires policy review.",
          tone: "caution",
          sourceId: "employment-contract"
        },
        {
          id: "oliver-exposure",
          label: "Illustrative exposure",
          value: "€126,000",
          detail:
            "Derived from supplied synthetic salary and contract terms; this is not a Remote API reserve amount.",
          tone: "caution",
          sourceId: "risk-policy"
        },
        {
          id: "oliver-reserve",
          label: "Reserve status",
          value: "Referred",
          detail:
            "The fixture maps to an onboarding reserve state requiring specialist judgment.",
          tone: "critical",
          sourceId: "reserve-status"
        }
      ],
      decision: {
        headline: "Specialist review before onboarding",
        summary:
          "Extended notice and material employment exposure justify a reserve review. AI assembles the evidence; a person owns the action.",
        trigger: "extended_notice_and_exposure",
        evidenceIds: [
          "oliver-contract",
          "oliver-exposure",
          "oliver-reserve"
        ],
        missingInformation: [],
        uncertainty:
          "The appropriate safeguard depends on Remote’s actual country policy and customer context, which this public prototype does not possess.",
        recommendedRoute: "specialist",
        recommendedAction: "REVIEW_RESERVE",
        permittedActions: ["REVIEW_RESERVE", "ESCALATE"],
        aiUsed: true
      },
      customerMessage:
        "This hire is with a country specialist. We will confirm whether an additional safeguard is required before onboarding continues."
    }
  ]
};

export const impactAssumptions: ImpactAssumptions = {
  reviewerCostPerHour: 60,
  baselineMinutesPerCase: 12,
  annualCases: 100_000,
  routes: [
    {
      id: "rules",
      label: "Rules only",
      share: 0.6,
      costPerCase: 0.05
    },
    {
      id: "lightweight",
      label: "Lightweight AI + 2 min QA",
      share: 0.2,
      costPerCase: 2.05
    },
    {
      id: "advanced",
      label: "Advanced AI + 20 min specialist",
      share: 0.2,
      costPerCase: 20.5
    }
  ]
};

export const agentSteps: AgentStep[] = [
  {
    id: "created",
    label: "Case created",
    detail: "A UK EOR employment enters the onboarding queue.",
    actor: "Agent",
    status: "complete"
  },
  {
    id: "context",
    label: "Context assembled",
    detail:
      "Company status, country policy, employment fields, and evidence IDs are retrieved.",
    actor: "Agent",
    status: "complete"
  },
  {
    id: "missing",
    label: "Evidence gap found",
    detail: "A required supporting document is missing.",
    actor: "Policy",
    status: "attention"
  },
  {
    id: "message",
    label: "Customer follow-up sent",
    detail:
      "An approved template requests the exact evidence and schedules a reminder.",
    actor: "Agent",
    status: "complete"
  },
  {
    id: "received",
    label: "Evidence received",
    detail: "The customer responds; the new document is normalized and validated.",
    actor: "Customer",
    status: "complete"
  },
  {
    id: "exception",
    label: "Non-standard term detected",
    detail:
      "Extended notice and material exposure cross the human-review threshold.",
    actor: "Policy",
    status: "attention"
  },
  {
    id: "packet",
    label: "Decision packet assembled",
    detail:
      "The agent cites evidence, states uncertainty, and recommends reserve review.",
    actor: "Agent",
    status: "complete"
  },
  {
    id: "escalated",
    label: "UK specialist owns the action",
    detail:
      "The agent stops. A person approves, changes, or rejects the recommendation.",
    actor: "Specialist",
    status: "human"
  },
  {
    id: "approved",
    label: "Human decision and audit event",
    detail:
      "The specialist approves or changes the recommendation; the final action and rationale are recorded.",
    actor: "Specialist",
    status: "human"
  }
];

export function getHire(id: string | undefined) {
  return (
    hiringPortfolio.hires.find((hire) => hire.id === id) ??
    hiringPortfolio.hires[hiringPortfolio.hires.length - 1]
  );
}
