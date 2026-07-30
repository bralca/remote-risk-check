import type { Metadata } from "next";
import "../globals.css";
import {
  ArrowLeft,
  Bot,
  Braces,
  Route,
  ShieldCheck,
  UserCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Product note | Onboarding Review",
  description:
    "The product, authority, and business reasoning behind Alessio Carrà's independent Remote proposal."
};

export default function ProductNotePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <main className="note-page">
      <article>
        <a className="note-back" href={`${basePath}/?view=product`}>
          <ArrowLeft size={16} />
          Back to the interactive proposal
        </a>

        <header>
          <span className="section-kicker">One-page product note</span>
          <h1>Onboarding Review</h1>
          <p>
            A queue that shows why an international hire can continue, what
            information is missing, or why a specialist must make the next
            decision.
          </p>
        </header>

        <section>
          <h2>The business problem is country-specific</h2>
          <p>
            Remote lets a customer hire across borders while Remote becomes the
            legal employer. Every hire therefore creates local contract,
            payroll, benefits, tax, termination, and financial obligations.
            The product problem is not a universal risk score. It is resolving
            known local requirements consistently while making real exceptions
            easy for a specialist to defend.
          </p>
        </section>

        <section>
          <h2>One company, five hires, four country paths</h2>
          <p>
            Company checks happen once. Two complete Portuguese cases clear
            with rules. A German document is extracted by a lightweight model
            and then validated by policy. A known French evidence gap becomes
            a precise customer request without AI. A UK case with extended
            notice and illustrative exposure receives advanced evidence
            analysis, then stops for human reserve review.
          </p>

          <div className="note-flow">
            <div>
              <Braces size={20} />
              <strong>Country rules handle clear cases</strong>
              <span>Approved rules check complete and standard employment information.</span>
            </div>
            <div>
              <Bot size={20} />
              <strong>AI reads and explains evidence</strong>
              <span>It can extract fields, compare documents and prepare a cited summary.</span>
            </div>
            <div>
              <UserCheck size={20} />
              <strong>People make important decisions</strong>
              <span>A reserve, hold, rejection or payment block requires a specialist.</span>
            </div>
          </div>
        </section>

        <section className="note-columns">
          <div>
            <h2>Why use different review methods?</h2>
            <p>
              A complete standard case does not need an AI model. Reading a
              straightforward document can use a smaller model. Comparing
              conflicting evidence may need a larger model, followed by a
              specialist who makes the decision.
            </p>
          </div>
          <div>
            <h2>Why this affects cost and customer experience</h2>
            <p>
              EOR recurring revenue begins when legitimate hires become active.
              Manual review, false positives, delay, and financial loss reduce
              contribution margin. Faster safe resolution improves both
              customer experience and operating capacity.
            </p>
          </div>
        </section>

        <section>
          <h2>One disclosed impact scenario</h2>
          <ul className="note-metrics">
            <li>
              <UserCheck size={18} />
              Baseline: 12 specialist minutes at €60/hour = €12.00
            </li>
            <li>
              <Route size={18} />
              Mixed review process: €4.54 weighted example cost per case
            </li>
            <li>
              <ShieldCheck size={18} />
              Rounded reduction in this example: 62% per case
            </li>
          </ul>
          <p>
            The route mix and formula are visible in the product. Every value
            is illustrative—not Remote operating data or a claimed Remote
            margin.
          </p>
        </section>

        <section>
          <h2>What the system could do later</h2>
          <p>
            A later version could collect evidence, check known requirements,
            send an approved request and reminder, and update the case when the
            customer responds. It could continue a complete case when an
            approved country rule allows it. When a reserve or unclear policy
            is involved, it would stop and give the cited evidence to a
            specialist. Customer value may change response time, but not the
            standard of compliance review.
          </p>
        </section>

        <section>
          <h2>How I would validate it</h2>
          <p>
            Work with country operations, Risk, Legal, Treasury, and Customer
            Experience; instrument reason codes, time-to-resolution, manual
            touches, and false positives; then backtest policy and routing
            changes on previously reviewed cases before giving the system more
            responsibility.
          </p>
        </section>

        <footer>
          <strong>Source and authority boundary</strong>
          <p>
            All companies, employees, policies, messages, costs, and outputs
            are fictional. Public API-mapped and conceptual internal inputs are
            labeled separately. This independent proposal makes no claim to
            reproduce Remote’s proprietary policy, data, UX, or performance.
          </p>
        </footer>
      </article>
    </main>
  );
}
