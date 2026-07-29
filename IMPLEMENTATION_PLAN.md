# Country-Aware AI Risk Operations — Delivery Plan

## Summary

Transform the existing single-company eligibility demo into a recruiter-first, three-tab product proposal for Remote:

1. **Product:** A working multi-country EOR decision center.
2. **Behind the product:** Data pipeline, AI routing, business-model fit, and one cost-impact chart.
3. **Vision:** A bounded autonomous case agent that resolves routine work and escalates consequential exceptions.

The experience remains synthetic, credential-free, static, and reviewable in approximately 90 seconds. It will use Remote-shaped fixtures mapped to public documentation, not claim access to Remote data or proprietary policies.

## Product Experience

### Positioning

Replace “Should Remote let this company hire?” with:

> **Clear standard hires. Route only the exceptions.**

Explain Remote’s business context in one sentence:

> Remote becomes the legal employer, so each international hire creates country-specific compliance and financial obligations.

Retain Remote-inspired purple, white, typography, spacing, and rounded components while preserving the independent-proposal disclaimer.

### Three-tab structure

Use URL-backed tabs:

- `?view=product`
- `?view=behind`
- `?view=vision`

Support `&hire={id}` for shareable selected cases. Map the legacy `?case=reserve-required` URL to the new UK specialist-review case.

Remove the long-scroll résumé presentation, balanced/strict policy toggle, generic company-age scoring, and duplicate explanation sections.

### Tab 1: Multi-country decision center

Show fictional Atlas Robotics hiring five people across four countries:

| Hire | Country | Route | Outcome |
|---|---|---|---|
| Ana Costa | Portugal | Rules only | Ready |
| Tiago Silva | Portugal | Rules only | Ready |
| Lena Weber | Germany | Lightweight document extraction followed by policy validation | Ready |
| Camille Laurent | France | Missing required country evidence | Customer action |
| Oliver Grant | United Kingdom | Advanced evidence analysis plus specialist | Reserve review |

The portfolio header shows exactly:

- **3 ready**
- **1 customer action**
- **1 specialist review**

Company-level checks appear once: KYB verified, credit status available, and no pending company action.

Selecting a hire opens one focused decision panel containing:

- Outcome and next action
- Applicable country requirement
- Evidence and source identifiers
- Processing route used
- Concise AI brief only when AI adds value
- Known uncertainty or missing information
- Customer-facing message
- Human approval for the UK reserve recommendation

Use three product outcomes: `READY`, `CUSTOMER_ACTION`, and `SPECIALIST_REVIEW`. Reserve, hold, reject, freeze, and enforcement remain recommended actions requiring human approval.

## Data, Policy, and AI Architecture

### Fixture model

Replace the employer-only case model with:

- `HiringPortfolio`: company checks, hires, aggregate outcomes, sources.
- `HireCase`: country, employment data, evidence, route, decision packet, customer action.
- `ProcessingRoute`: `rules_only`, `lightweight_ai`, `advanced_ai`, `specialist`.
- `DecisionPacket`: summary, trigger, evidence IDs, uncertainty, missing information, recommended route, permitted action.
- `ImpactAssumptions`: route mix, reviewer time, labor cost, model cost, volume.
- `SourceReference`: public endpoint or conceptual internal source, documentation URL, and synthetic-data label.

Map fixtures to Remote’s documented surfaces:

- Company compliance profile
- Company pending actions
- Employments
- Employment contracts
- Country-specific JSON schemas
- Employment onboarding-reserve status
- Eligibility webhooks

Explicitly distinguish public API-mapped fields from conceptual internal inputs such as documents, reviewer queues, and model telemetry.

Remove unsupported or misleading inputs:

- Do not use company age as incorporation age.
- Do not present generic “contract risk.”
- Represent specific terms such as extended notice or guaranteed severance.
- Do not expose beneficial-owner details; use KYB status.
- Do not show payment history or reserve amounts as API-derived unless the fixture clearly labels them illustrative.

### Decision pipeline

The “Behind the product” pipeline shows:

```text
Remote-shaped sources
→ Normalize, minimize PII, assign evidence IDs
→ Deterministic country policy
→ Cost-aware router
→ Structured AI investigation where needed
→ Customer action or human-reviewed decision
→ Audit event and learning metrics
```

Routing behavior is fixed:

- Complete, standard case: rules only.
- Known missing field: deterministic customer action.
- Low-impact unstructured extraction: lightweight model.
- Conflicting evidence or higher exposure: advanced model.
- Unknown policy, high uncertainty, or consequential action: specialist.
- Invalid AI output or missing evidence references: specialist fallback.

AI receives only relevant evidence, applicable policy, permitted actions, and evidence IDs. Its structured output includes summary, trigger, evidence references, missing information, uncertainty, and recommended route.

AI may extract, compare, summarize, and recommend. It cannot create policy, override rules, impose a reserve, reject a customer, freeze an account, or execute enforcement.

## Behind the Product and Business Impact

### Tab 2 content

Keep this view to three elements:

1. The technical pipeline and routing branches.
2. One large cost-impact chart.
3. A compact build receipt and source list.

Explain the business model briefly: EOR recurring revenue begins when legitimate hires become active, while manual review, delayed onboarding, false positives, and financial losses reduce contribution margin.

Do not claim a Remote margin figure or present the proposal as a duplicate of Compliance Watchtower.

### Single impact chart

Use one dominant number:

> **62% lower illustrative cost per safe decision**

Show two horizontal bars:

- Baseline: **€12.00 per case**
- Cost-aware routing: **€4.54 per case**

Use these disclosed assumptions:

- Baseline: 12 minutes of specialist review at €60/hour.
- Routed mix:
  - 60% rules-only at €0.05 system cost.
  - 20% lightweight AI plus two minutes of QA at €2.05.
  - 20% advanced AI plus 20 minutes of specialist review at €20.50.
- Weighted routed cost: €4.54.
- Reduction: 62%, rounded from the calculated result.
- Scale caption: at 100,000 annual cases, each €1 saved per case represents €100,000 of potential annual operating savings.

Label every value “Illustrative scenario—not Remote operational data.” Put the assumptions and formula in one expandable disclosure, not alongside the primary chart.

Supporting bullets:

- Standard cases incur no generative-model cost.
- Lightweight models handle bounded extraction.
- Expensive reasoning is reserved for ambiguity and exposure.
- Specialists receive evidence-ready exceptions rather than raw cases.

### Compact build receipt

Replace the full personal-proof section with one footer containing:

- Alessio Carrà
- Built with Codex
- Actual final implementation duration
- Actual test count
- Model identifier only if verifiable
- Token usage only if available from reliable tooling
- Repository, résumé, walkthrough, and product-note links

Do not retain the existing 49-minute, token, commit, or performance numbers unless remeasured after the redesign.

## Autonomous Operations Vision

### Tab 3: Bounded autonomous case manager

Headline:

> **Autonomous case operations, within policy.**

Provide one “Run agent” interaction with a controlled animated timeline:

1. A UK employment case is created.
2. The agent retrieves company status, country policy, employment data, and contract evidence.
3. It identifies missing evidence.
4. It sends an approved customer message and schedules a reminder.
5. New evidence arrives and is validated.
6. The agent detects a non-standard notice term and elevated reserve exposure.
7. It assembles an evidence-linked decision packet.
8. Because the action is consequential, it routes the case to the UK specialist rather than executing it.
9. The human approves or changes the reserve recommendation; the audit record is created.

At the decision point, show the alternate standard-case path: a complete policy-covered case would be automatically cleared by the deterministic policy engine.

Allowed autonomous actions:

- Retrieve and normalize evidence
- Validate known requirements
- Request missing information
- Send controlled follow-ups and reminders
- Update case status
- Auto-clear standard policy-covered cases
- Assemble audit-ready investigation packets

Human-required actions:

- Reserve requirements
- Holds and rejections
- Account freezes or payment blocks
- Novel policy interpretation
- High financial exposure
- Low-confidence or contradictory evidence

Escalation depends on exposure, uncertainty, legal consequence, evidence conflict, and policy novelty. Customer value may affect service priority or SLA, but never the standard of compliance review.

Respect reduced-motion preferences and provide manual next/previous controls. No actual messages, API writes, or model calls occur.

## Verification and Delivery

### Tests

Add unit coverage for:

- Fixture normalization and source attribution
- Aggregate count of three ready, one action, one review
- Standard-case rules-only routing
- Missing evidence producing customer action
- Document extraction followed by deterministic clearance
- Extended notice and reserve exposure producing specialist review
- Invalid AI packet and unknown country producing safe escalation
- Human approval required for consequential actions
- Cost calculation returning €12.00, €4.54, and rounded 62%
- Legacy URL mapping

Add end-to-end coverage for:

- Default recruiter product flow
- Selecting each hire and seeing the correct evidence and action
- Customer/internal message switching
- Human approval and audit record
- Navigation across all three tabs
- Agent timeline and escalation
- Assumption disclosure
- Keyboard navigation, mobile layout, and reduced motion

Run type checking, unit tests, production build, Playwright, desktop/mobile visual inspection, accessibility checks, and performance validation.

### Supporting artifacts

Update the README, product note, recruiter email, AI interview script, project summary, metadata, sitemap, and walkthrough script. Re-record the walkthrough around the three-tab story and update the tailored résumé project description and PDF.

Keep source history intentional, push the completed source to the existing GitHub repository, package the exact verified commit, and deploy a saved version through the existing Sites project ID in `.openai/hosting.json`. Validate the production deployment and existing public links before handoff.

## Assumptions

- Audience: Remote recruiter or automated first-pass reviewer, followed by Product/Risk leadership.
- Primary review time: 60–90 seconds; deeper technical material is optional.
- All employers, employees, policies, messages, costs, and decisions are fictional.
- No live Remote token, production data, model endpoint, or messaging integration is used.
- The project demonstrates architecture and product judgment, not legal advice or Remote’s actual decision policy.
- Policy decides standard outcomes, the agent performs routine orchestration, and humans retain consequential authority.
