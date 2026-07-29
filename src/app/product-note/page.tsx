import type { Metadata } from "next";
import "../globals.css";
import {
  ArrowLeft,
  Bot,
  Braces,
  Scale,
  ShieldCheck,
  UserCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Product note | Remote Risk Check",
  description:
    "The product reasoning behind Alessio Carrà's independent Remote Risk Check exploration."
};

export default function ProductNotePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <main className="note-page">
      <article>
        <a className="note-back" href={`${basePath}/`}>
          <ArrowLeft size={16} />
          Back to the interactive demo
        </a>

        <header>
          <span className="section-kicker">One-page product note</span>
          <h1>Risk decisions should be faster to make and easier to defend.</h1>
          <p>
            An independent product exploration for Remote’s Senior Product
            Manager, Fraud and Compliance role by Alessio Carrà.
          </p>
        </header>

        <section>
          <h2>The business problem</h2>
          <p>
            Remote makes it possible for companies to employ people across
            borders. That creates a difficult product balance: prevent fraud,
            credit loss, and compliance failures without delaying legitimate
            employers and their new hires. As volume grows, manual review cannot
            grow at the same rate.
          </p>
        </section>

        <section>
          <h2>The product decision</h2>
          <p>
            Start with one narrow, consequential workflow: employer eligibility
            during EOR onboarding. Give operators one place to see the evidence,
            the policy result, the AI summary, the customer consequence, and
            the final human action.
          </p>

          <div className="note-flow">
            <div>
              <Braces size={20} />
              <strong>Rules determine status</strong>
              <span>Consistent, testable, and versionable.</span>
            </div>
            <div>
              <Bot size={20} />
              <strong>AI explains evidence</strong>
              <span>Grounded, concise, and explicit about uncertainty.</span>
            </div>
            <div>
              <UserCheck size={20} />
              <strong>Humans approve action</strong>
              <span>Consequential decisions remain accountable.</span>
            </div>
          </div>
        </section>

        <section className="note-columns">
          <div>
            <h2>Why a reserve?</h2>
            <p>
              A reserve is reversible. When the company is verified but its
              payment history is limited relative to the expected obligation,
              a reserve can protect exposure without treating the customer as
              fraudulent.
            </p>
          </div>
          <div>
            <h2>Why not automate everything?</h2>
            <p>
              Risk systems affect companies and workers. AI can reduce
              investigation time, but the evidence, uncertainty, and human
              owner should remain visible—especially for holds or denials.
            </p>
          </div>
        </section>

        <section>
          <h2>What I would measure</h2>
          <ul className="note-metrics">
            <li>
              <Scale size={18} />
              False-positive rate and risk recall
            </li>
            <li>
              <ShieldCheck size={18} />
              Protected exposure and reserve coverage
            </li>
            <li>
              <Braces size={18} />
              Straight-through decisions and manual review rate
            </li>
            <li>
              <UserCheck size={18} />
              Median time to a defensible decision
            </li>
          </ul>
          <p>
            The public prototype intentionally does not present invented
            performance metrics. Its three fictional cases illustrate the
            tradeoff; real targets would require Remote’s labeled outcomes,
            operating costs, and loss data.
          </p>
        </section>

        <section>
          <h2>What comes next</h2>
          <p>
            Validate the workflow with Risk Operations and Treasury, instrument
            review reasons, and backtest policy changes on labeled historical
            cases. Only then extend the platform to payment anomalies, freezes,
            disputes, collections, and enforcement.
          </p>
        </section>

        <footer>
          <strong>Boundaries</strong>
          <p>
            All companies, inputs, thresholds, reserve amounts, and outputs are
            fictional. The project is based only on Remote’s public website,
            role description, support articles, and developer documentation.
            It is not affiliated with Remote.
          </p>
        </footer>
      </article>
    </main>
  );
}
