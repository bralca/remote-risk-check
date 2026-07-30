# Onboarding Review

**An interactive product concept for Remote by Alessio Carrà.**

Remote becomes the legal employer, so each international hire creates
country-specific contract, document, payroll and financial obligations. This
prototype shows how one queue could explain the status of each hire, the
evidence used, the information still missing and the person responsible for an
important decision.

**[Open the live proposal](https://bralca.github.io/remote-risk-check/?view=product&hire=oliver-uk)** ·
**[Watch the walkthrough](https://bralca.github.io/remote-risk-check/remote-risk-check-walkthrough.mp4)**

## Two separate views

The default URL opens directly in the product. There is no landing page before
the queue.

1. **Product** — Atlas Robotics is hiring five people in Portugal, Germany,
   France and the UK. Three hires can continue, one needs a document from the
   customer and one must be reviewed by a UK specialist. Selecting a hire shows
   the country rules, evidence, remaining uncertainty and customer message.
2. **How it works** — This view explains why Remote needs a separate review for
   each employment, what information enters the process, when ordinary rules
   are sufficient, when AI helps read or compare documents, what a specialist
   must decide and how the example cost calculation is derived.

The product does not use AI for every case. Complete standard cases are checked
with ordinary software rules. A lower-cost model can read a straightforward
document. A larger model can organize conflicting evidence for a specialist,
but it cannot approve a reserve, hold or rejection.

## Decision boundaries

- **Country rules handle clear cases.** Approved rules are versioned and tested
  for each country.
- **AI reads and explains supplied evidence.** It can extract fields, compare
  documents and prepare a cited summary. It cannot create a new rule.
- **People make important decisions.** Reserve requirements, holds, rejections,
  payment blocks and new interpretations of policy require a specialist.
- **Incomplete or invalid results stop.** If the policy is unknown or the AI
  response does not cite known evidence, the case goes to a specialist.

All employers, employees, policies, messages, costs, and decisions are
fictional. The demo uses committed fixtures, makes no live model call, and
contains no real Remote, customer, employee, or applicant data.

## Illustrative economics

The single impact chart is calculated from disclosed assumptions:

- Baseline: 12 minutes of specialist review at €60/hour = €12.00 per case.
- Routed mix: 60% rules at €0.05, 20% lightweight AI plus two minutes of QA at
  €2.05, and 20% advanced AI plus 20 minutes of specialist review at €20.50.
- Weighted example cost: €4.54 per case, a rounded 62% reduction.
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
contains a server-side reference adapter for signed, timestamped Remote webhook
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
