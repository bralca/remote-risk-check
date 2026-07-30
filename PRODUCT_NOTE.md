# Product Note: Onboarding Review

Remote’s EOR product lets a customer hire across borders while Remote becomes
the legal employer. That creates country-specific contract, payroll, benefits,
tax, termination, and financial obligations for every hire. The product problem
is not solved by one risk score. Each employment needs to be checked against
the requirements of its country, the contract that was agreed, the evidence
provided by the employee and the company’s current status.

The default page opens directly in a queue for Atlas Robotics, a fictional
company hiring five people in four countries. Company checks appear once at the
top. Selecting a person shows the evidence and the next step for that
employment:

- Two Portuguese cases have complete information and standard terms. Approved
  country rules allow onboarding to continue without an AI model or manual
  review.
- A German work-eligibility document needs to be read. A lower-cost model
  extracts the document type and expiry date, and the country rules validate
  the result.
- The French case is missing current work-authorization evidence. The product
  can ask the customer for that exact document without using AI.
- The UK contract has a three-month notice period and the fictional employment
  exposure is €126,000. AI organizes the relevant evidence, but a UK specialist
  decides whether a reserve is required.

The product separates work from authority. Country rules handle known,
repeatable checks. AI may read a document, compare evidence and prepare a
summary that cites its sources. A person retains authority over a reserve,
hold, rejection, freeze or new interpretation of policy. If a policy is
unknown, evidence conflicts, or an AI response does not cite known evidence,
the case stops for a specialist.

This matters to the business for two reasons. First, a legitimate hire cannot
start until onboarding is complete, so unnecessary review delays affect the
customer and postpone the employment. Second, specialist time is expensive and
should be reserved for work that needs judgment. The example calculation
compares a twelve-minute manual review of every case, costing €12.00, with a
mixed process that uses rules, smaller document-reading models and specialist
review where needed. Under the disclosed assumptions, the weighted example cost
is €4.54 per case, or 62% lower. These figures are not Remote operating data.

The “How it works” view also shows a longer-term idea. The system could collect
missing evidence, send an approved request and reminder, and update the case
when the customer responds. It could continue a complete standard case when an
approved country rule allows it. It would stop before a reserve, hold,
rejection, payment freeze or unclear policy decision and give the cited
evidence to a specialist.

I would validate this direction with country operations, Risk, Legal, Treasury
and Customer Experience. I would measure how long each case takes, why cases
are sent to specialists, how often a reviewer changes the proposed result and
how many legitimate cases are delayed. New rules and model changes should be
tested against previously reviewed cases before they affect live onboarding.

All companies, employees, policies, messages, costs, and outputs are fictional.
The project maps fixtures to public Remote developer and support documentation,
explicitly labels conceptual internal inputs, and makes no claim to reproduce
Remote’s data, proprietary policies, UX, or operating metrics.
