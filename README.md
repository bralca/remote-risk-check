# Country-Aware AI Risk Operations

**A working product proposal for Remote by Alessio Carrà.**

Remote becomes the legal employer, so each international hire creates
country-specific compliance and financial obligations. This prototype asks:
**what is the lowest-cost safe route for each case?**

**[Open the live proposal](https://bralca.github.io/remote-risk-check/?view=product&hire=oliver-uk)** ·
**[Watch the walkthrough](https://bralca.github.io/remote-risk-check/remote-risk-check-walkthrough.mp4)**

## The 90-second story

The proposal has three URL-backed views:

1. **Product** — Atlas Robotics is hiring five people across Portugal, Germany,
   France, and the UK. Three standard hires are ready, one known evidence gap
   becomes a customer action, and one consequential reserve exception reaches a
   UK specialist.
2. **Behind the product** — Remote-shaped sources are normalized, evaluated
   against deterministic country policy, and routed to no model, lightweight
   extraction, advanced analysis, or a specialist. A disclosed illustrative
   scenario shows €12.00 versus €4.54 per safe decision.
3. **Vision** — A bounded agent retrieves evidence, handles controlled
   follow-ups, auto-clears policy-covered cases, and stops before executing
   reserves, holds, rejections, freezes, or novel policy interpretations.

The key product choice is not “AI everywhere.” It is using the cheapest
mechanism that preserves safety, evidence, and accountability.

## Decision boundaries

- **Policy owns standard outcomes.** Rules are versioned, deterministic, and
  testable by country.
- **AI handles bounded ambiguity.** It may extract, compare, summarize, and
  recommend only from supplied evidence and permitted actions.
- **People own consequential action.** Reserve requirements, holds, rejections,
  payment blocks, and novel policy decisions cannot execute autonomously.
- **Invalid output fails safely.** Unknown policy, missing evidence references,
  or invalid structured output routes to a specialist.

All employers, employees, policies, messages, costs, and decisions are
fictional. The demo uses committed fixtures, makes no live model call, and
contains no real Remote, customer, employee, or applicant data.

## Illustrative economics

The single impact chart is calculated from disclosed assumptions:

- Baseline: 12 minutes of specialist review at €60/hour = €12.00 per case.
- Routed mix: 60% rules at €0.05, 20% lightweight AI plus two minutes of QA at
  €2.05, and 20% advanced AI plus 20 minutes of specialist review at €20.50.
- Weighted cost: €4.54 per case, a rounded 62% reduction.
- At 100,000 cases, every €1 saved per case represents €100,000 of potential
  annual operating savings.

This is an illustrative scenario, not Remote operational data or a claimed
Remote margin.

## Run and verify

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```

`npm run verify` runs type checking, unit tests, and the production build.

## Source model

Fixtures distinguish two boundaries:

- **Public API-mapped surfaces:** company compliance profile, company pending
  actions, country form schemas, employment contracts, and onboarding reserve
  status.
- **Conceptual internal inputs:** employee document payloads, reviewer queues,
  policy configuration, and model telemetry. The prototype does not claim these
  are publicly retrievable.

The source mapping is visible inside the Product view. The repository also
contains a server-side reference adapter for signed, timestamped Remote-shaped
webhooks; the public product remains a credential-free static export.

## Public materials

- [Live product](https://bralca.github.io/remote-risk-check/?view=product&hire=oliver-uk)
- [Source repository](https://github.com/bralca/remote-risk-check)
- [One-page product note](https://bralca.github.io/remote-risk-check/product-note)
- [Tailored résumé](https://bralca.github.io/remote-risk-check/alessio-carra-resume.pdf)
- [Walkthrough script](./WALKTHROUGH_SCRIPT.md)
- [Recruiter email](./RECRUITER_EMAIL.md)

This independent proposal is based only on public Remote materials and is not
affiliated with Remote. It demonstrates product judgment and architecture, not
legal advice or Remote’s actual data, policy, UX, or operating performance.
