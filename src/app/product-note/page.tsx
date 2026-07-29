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
  title: "Product note | Country-Aware AI Risk Operations",
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
          <h1>Clear standard hires. Route only the exceptions.</h1>
          <p>
            A country-aware EOR decision system designed around the cheapest
            route that preserves safety, evidence, and accountability.
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
              <strong>Policy decides</strong>
              <span>Versioned country rules own standard outcomes.</span>
            </div>
            <div>
              <Bot size={20} />
              <strong>AI handles ambiguity</strong>
              <span>Extract, compare, summarize, and recommend.</span>
            </div>
            <div>
              <UserCheck size={20} />
              <strong>People own consequence</strong>
              <span>Reserves and enforcement cannot self-execute.</span>
            </div>
          </div>
        </section>

        <section className="note-columns">
          <div>
            <h2>Why cost-aware routing?</h2>
            <p>
              Standard work does not need generative AI. Bounded extraction can
              use a smaller model. Advanced reasoning and specialist time
              should be concentrated on ambiguity, exposure, conflict, and
              novel policy.
            </p>
          </div>
          <div>
            <h2>Why this affects margin</h2>
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
              Routed mix: €4.54 weighted cost per case
            </li>
            <li>
              <ShieldCheck size={18} />
              Rounded reduction: 62% per safe decision
            </li>
          </ul>
          <p>
            The route mix and formula are visible in the product. Every value
            is illustrative—not Remote operating data or a claimed Remote
            margin.
          </p>
        </section>

        <section>
          <h2>The autonomous vision remains bounded</h2>
          <p>
            A case agent can retrieve evidence, validate known requirements,
            send approved requests and reminders, update status, and auto-clear
            complete policy-covered cases. When extended notice and material
            exposure cross the threshold, it assembles an evidence-linked
            packet and hands ownership to the UK specialist. Customer value may
            change response priority, never the standard of compliance review.
          </p>
        </section>

        <section>
          <h2>How I would validate it</h2>
          <p>
            Work with country operations, Risk, Legal, Treasury, and Customer
            Experience; instrument reason codes, time-to-resolution, manual
            touches, and false positives; then backtest policy and routing
            changes on labeled historical cases before expanding autonomy.
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
