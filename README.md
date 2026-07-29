# Remote Risk Check

**A working, recruiter-first product exploration by Alessio Carrà.**  
It answers one question: **Should Remote let this company hire?**  
Three fictional employers demonstrate KYB, credit-risk, and reserve decisions.  
Deterministic rules set status; an evidence-grounded AI brief explains it; a human approves the action.  
The experience is designed for Remote’s Senior Product Manager, Fraud and Compliance role.

## What to review

Open the site, choose a fictional employer, and select **Analyze this case**. In under 60 seconds you can:

1. Inspect five understandable employer signals.
2. See a green, yellow, or red policy result.
3. Read an AI investigator brief linked to its evidence.
4. Switch between the Risk-team and customer explanations.
5. Confirm the action as a human reviewer.
6. Compare balanced and strict policy behavior.

A 55-second silent walkthrough is included at
`/remote-risk-check-walkthrough.mp4`; the matching narration script is in
[`WALKTHROUGH_SCRIPT.md`](./WALKTHROUGH_SCRIPT.md).

## Product point of view

AI should reduce investigation work without obscuring accountability:

- **Rules decide status.** The policy is deterministic, inspectable, and tested.
- **AI explains evidence.** The public demo uses committed, precomputed briefs with explicit limitations.
- **People own action.** Clear, reserve, request-information, and hold actions require human approval.

All cases, thresholds, reserve amounts, and results are fictional. The repository contains no real Remote, customer, employee, or applicant data.

## Run locally

Requirements: Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Or run the main checks together:

```bash
npm run verify
```

## Remote-shaped webhook adapter

The optional endpoint at `/api/integrations/remote/webhooks` verifies:

- `X-Remote-Signature`
- `X-Remote-Timestamp`
- HMAC-SHA256 over the raw body
- timestamp tolerance
- duplicate/replayed deliveries
- supported public event types

Copy `.env.example` to `.env.local` and add a sandbox signing key to exercise the endpoint. The public product does not need credentials.

## AI methodology

The investigator brief follows this contract:

```ts
interface AIInvestigatorBrief {
  summary: string;
  evidenceIds: string[];
  missingInformation: string[];
  uncertainty: string;
  recommendedAction: DecisionAction;
  limitations: string;
}
```

Conceptual prompt:

> Summarize only the provided structured employer evidence and deterministic policy result. Every material claim must reference an evidence ID. Identify missing information and uncertainty. Recommend—but never execute—one permitted action. Do not infer protected traits, invent data, or replace KYB, AML, legal, credit, or human review.

Evaluation requirements:

- Every material claim maps to a supplied evidence ID.
- Recommended action is in the permitted enum.
- Missing information remains distinct from adverse evidence.
- Uncertainty is explicit.
- The output contains no autonomous action call.
- Insufficient evidence produces an escalation rather than invented certainty.

The deployed product uses precomputed briefs, so it has no model cost, secret, latency, or sensitive-data exposure.

## Sources and boundaries

The concept uses only public Remote materials:

- [Senior Product Manager, Fraud and Compliance](https://remote.com/openings/7814948003)
- [EOR hiring eligibility](https://developer.remote.com/docs/eor-hiring-eligibility)
- [Verifying Remote webhooks](https://developer.remote.com/docs/verifying-webhooks)
- [What is an EOR reserve payment?](https://support.remote.com/hc/en-us/articles/12695731865229-What-is-a-reserve-payment-under-the-Employer-of-Record-EOR-product)
- [Remote MCP documentation](https://developer.remote.com/docs/introduction-to-remote-mcp)
- [Remote’s 2026 business update](https://remote.com/news/remotes-modern-payroll-platform-surpasses-300-growth-fueling-ambitious-next-chapter-as-the-leading-global-employment-infrastructure)

This is an independent exploration and is not affiliated with Remote. It does not claim to reproduce Remote’s internal policies, models, data, UX, or architecture.
